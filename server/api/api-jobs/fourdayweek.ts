import { H3Event } from 'h3'
import slug from 'slug'
import { marked } from 'marked'
import { FourDayWeekJob, JobFromAPIs } from '~~/server/api/api-jobs/JobsFromAPIs.type'
import { addJobToQueueFromAPIJob, benefitsParser } from '~~/server/api/api-jobs/apiJobsService'

export default defineEventHandler(async (event: H3Event) => {
  const data = await (await fetch('https://4dayweek.io/api'))

  const responseData: {jobs: FourDayWeekJob[]} = await data.json()

  const latestJobs = responseData.jobs.slice(0, 20)

  const engineeringJobs = latestJobs.filter(job => job.category === 'Engineering')

  const PrismaClient = event.context.prisma

  const jobsFromAPI = engineeringJobs.map(job => getApiJobFromFourDayWeekJob(job))

  const jobsAddedToQueue = await Promise.all(jobsFromAPI.map(async (job) => {
    return await addJobToQueueFromAPIJob(job, PrismaClient)
  }))

  return {
    jobsAddedToQueue
  }
})

const getApiJobFromFourDayWeekJob = (job: FourDayWeekJob): JobFromAPIs => {
  const duration = getDurationFromReducedHoursAndOriginalTitle(job.reduced_hours, job.title_original)

  let experienceLevel, role, tags, benefits, location

  try {
    experienceLevel = getExperienceLevelFromTitle(job.title)
    role = job.role

    tags = getTagsFromFilters(job.filters)

    benefits = getBenefitsFromCompanyDescription(job.company.description ?? job.company.short_description ?? job.description)

    location = getLocationFromLocationFields(job.location_continent, job.location_country)
  } catch (error: any) {
    throw new Error(`Error parsing job from 4dayweek.io: ${job.url} ${error.message} ${error.stack}}`)
  }

  return {
    ...job,
    salary: 'unknown salary',
    link: job.url,
    description: marked.parse(job.description),
    // the date is in seconds after the linux epoch, so we need to multiply by 1000
    postedAt: new Date(job.posted * 1000),
    slug: slug(job.title + '-' + job.company_name + '-' + job.id_str),
    company: {
      name: job.company.name,
      logo: job.company.logo_url,
      slug: slug(job.company.name),
      description: marked.parse(job.company.description ?? job.company.short_description ?? '')
    },
    locations: [{
      name: location,
      slug: slug(location)
    }],
    duration: {
      name: duration,
      slug: slug(duration)
    },

    experienceLevel: {
      name: experienceLevel,
      slug: slug(experienceLevel)
    },

    role: {
      name: role,
      slug: slug(role)
    },

    tags,

    benefits
  }
}

// get duration from job type
const getDurationFromReducedHoursAndOriginalTitle = (reducedHours: string, originalTitle?: string) => {
  let duration = 'Full Time'
  if (reducedHours === 'Part time') {
    duration = 'Part Time'
  }

  if (originalTitle?.toLowerCase().includes('contract')) {
    duration = 'Contract'
  }

  return duration
}

// get experience level from job title
const getExperienceLevelFromTitle = (title: string) => {
  let experienceLevel = ''

  if (title.toLowerCase().includes('senior')) {
    experienceLevel = 'senior'
  } else if (title.toLowerCase().includes('mid')) {
    experienceLevel = 'mid'
  } else if (title.toLowerCase().includes('junior')) {
    experienceLevel = 'junior'
  } else if (title.toLowerCase().includes('entry')) {
    experienceLevel = 'entry'
  } else if (title.toLowerCase().includes('intern')) {
    experienceLevel = 'intern'
  }

  return experienceLevel
}

const getTagsFromFilters = (filters: {label: string, value: string}[]) => {
  const tags = filters.map(filter => ({
    name: filter.label,
    slug: slug(filter.label)
  }))

  return tags
}

const getBenefitsFromCompanyDescription = (description: string) => {
  const benefits = benefitsParser(description)

  if (!benefits.map(benefits => benefits.name).includes('4 day work week')) {
    benefits.push({
      name: '4 day work week',
      slug: slug('4 day work week')
    })
  }

  return benefits
}
function getLocationFromLocationFields (locationContinent: string|null, locationCountry: string|null) {
  let location = 'Worldwide'

  if (locationContinent) {
    location = locationContinent
  }

  if (locationCountry) {
    location = locationCountry
  }

  return location
}
