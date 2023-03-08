import { H3Event } from 'h3'
import slug from 'slug'
import { marked } from 'marked'
import { FourDayWeekJob, JobFromAPIs } from '~~/server/api/api-jobs/JobsFromAPIs.type'
import { benefitsParser, createJobFromAPIJob } from '~~/server/api/api-jobs/apiJobsService'

export default defineEventHandler(async (event: H3Event) => {
  const data = await (await fetch('https://4dayweek.io/api'))

  const responseData: {jobs: FourDayWeekJob[]} = await data.json()

  const latestJobs = responseData.jobs.slice(0, 5)

  const engineeringJobs = latestJobs.filter(job => job.category === 'Engineering')

  const PrismaClient = event.context.prisma

  const jobsFromAPI = engineeringJobs.map(job => getApiJobFromFourDayWeekJob(job))

  const createdJobs = await Promise.all(jobsFromAPI.map(async (job) => {
    return await createJobFromAPIJob(job, PrismaClient)
  }))

  return {
    createdJobs,
    FourDayWeekJobs: engineeringJobs
  }
})

const getApiJobFromFourDayWeekJob = (job: FourDayWeekJob): JobFromAPIs => {
  const duration = getDurationFromReducedHoursAndOriginalTitle(job.reduced_hours, job.title_original)

  const experienceLevel = getExperienceLevelFromTitle(job.title)

  const role = job.role

  const tech = getTechFromFilters(job.filters)

  const benefits = getBenefitsFromCompanyDescription(job.company.description)

  const location = getLocationFromLocationFields(job.location_continent, job.location_country)

  return {
    ...job,
    salary: 'unknown',
    link: job.url,
    description: marked.parse(job.description),
    postedAt: new Date(job.posted),
    slug: slug(job.title + '-' + job.posted),
    company: {
      name: job.company.name,
      logo: job.company.logo_url,
      slug: slug(job.company.name),
      description: marked.parse(job.company.description)
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

    tech,

    benefits
  }
}

// get duration from job type
const getDurationFromReducedHoursAndOriginalTitle = (reducedHours: string, originalTitle: string) => {
  let duration = 'Full Time'
  if (reducedHours === 'Part time') {
    duration = 'Part Time'
  }

  if (originalTitle.toLowerCase().includes('contract')) {
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

// get tech from the tags
const getTechFromFilters = (filters: {label: string, value: string}[]) => {
  const tech = filters.map(filter => ({
    name: filter.label,
    slug: slug(filter.label)
  }))

  return tech
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
