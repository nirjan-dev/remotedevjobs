import { H3Event } from 'h3'
import slug from 'slug'
import { JobFromAPIs, RemoteOkJob } from '~~/server/api/api-jobs/JobsFromAPIs.type'
import { benefitsParser, createJobFromAPIJob } from '~~/server/api/api-jobs/apiJobsService'

export default defineEventHandler(async (event: H3Event) => {
  const data = await (await fetch('https://remoteok.com/api?api=1'))

  const responseData: RemoteOkJob[] = await data.json()

  // don't get the first item as it's just some disclaimer text
  const latestJobs = responseData.filter((job) => {
    return job?.tags?.includes('developer') || job?.tags?.includes('engineer')
  }).slice(0, 6)

  const PrismaClient = event.context.prisma

  const jobsFromAPI = latestJobs.map(job => getApiJobFromRemoteOkJob(job))
  const createdJobs = await Promise.all(jobsFromAPI.map(async (job) => {
    return await createJobFromAPIJob(job, PrismaClient)
  }))

  return {
    createdJobs,
    remoteOkJobs: latestJobs
  }
})

const getApiJobFromRemoteOkJob = (job: RemoteOkJob): JobFromAPIs => {
  const duration = 'Full Time'

  const experienceLevel = getExperienceLevelFromPositionAndTags(job.position, job.tags)

  const role = job.position

  const tech = getTechFromTags(job.tags)

  const benefits = getBenefitsFromDescription(job.description)

  const locations = getLocationsFromLocationField(job.location)

  return {
    ...job,
    title: job.position,
    salary: String(job.salary_min),
    link: job.url,
    postedAt: new Date(job.date),
    slug: slug(job.position + '-' + job.date),
    company: {
      name: job.company,
      logo: job.company_logo,
      slug: slug(job.company),
      description: ''
    },
    locations,
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

// get experience level from job title
const getExperienceLevelFromPositionAndTags = (position: string, tags: string[]) => {
  let experienceLevel = ''

  if (position.toLowerCase().includes('senior')) {
    experienceLevel = 'senior'
  } else if (position.toLowerCase().includes('mid')) {
    experienceLevel = 'mid'
  } else if (position.toLowerCase().includes('junior')) {
    experienceLevel = 'junior'
  } else if (position.toLowerCase().includes('entry')) {
    experienceLevel = 'entry'
  } else if (position.toLowerCase().includes('intern')) {
    experienceLevel = 'intern'
  }

  if (!experienceLevel) {
    if (tags.includes('senior')) {
      experienceLevel = 'senior'
    } else if (tags.includes('mid')) {
      experienceLevel = 'mid'
    } else if (tags.includes('junior')) {
      experienceLevel = 'junior'
    } else if (tags.includes('entry')) {
      experienceLevel = 'entry'
    } else if (tags.includes('intern')) {
      experienceLevel = 'intern'
    }
  }

  return experienceLevel
}

// get tech from the tags
const getTechFromTags = (tags:string[]) => {
  const tech = tags.map(tag => ({
    name: tag,
    slug: slug(tag)
  }))

  return tech
}

const getBenefitsFromDescription = (description: string) => {
  const benefits = benefitsParser(description)

  return benefits
}

const getLocationsFromLocationField = (location: string) => {
  let finalLocations
  if (location.toLowerCase() === 'global' || location.toLowerCase() === 'wordlwide') {
    finalLocations = [{
      name: 'Worldwide',
      slug: slug('Worldwide')
    }]
  } else if (location) {
    finalLocations = location.split(',').map(location => ({
      name: location.trim(),
      slug: slug(location.trim())
    }))
  } else {
    finalLocations = [{
      name: 'Probably Worldwide',
      slug: slug('Probably Worldwide')
    }]
  }

  return finalLocations
}
