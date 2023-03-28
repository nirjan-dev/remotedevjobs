import { H3Event } from 'h3'
import slug from 'slug'
import { JobFromAPIs, RemoteOkJob } from '~~/server/api/api-jobs/JobsFromAPIs.type'
import { addJobToQueueFromAPIJob, benefitsParser } from '~~/server/api/api-jobs/apiJobsService'
import { logger } from '~/utils/logger'

export default defineEventHandler(async (event: H3Event) => {
  let data
  try {
    data = await (await fetch('https://remoteok.com/api?api=1'))
  } catch (error:any) {
    logger.error(error.message, 'Error fetching remoteok jobs')
    return {
      error: error.message
    }
  }

  const responseData: RemoteOkJob[] = await data.json()

  // don't get the first item as it's just some disclaimer text
  const latestJobs = responseData.filter((job) => {
    return job?.tags?.includes('developer') || job?.tags?.includes('engineer')
  }).slice(0, 6)

  const PrismaClient = event.context.prisma

  const jobsFromAPI = latestJobs.map(job => getApiJobFromRemoteOkJob(job))
  const jobsAddedToQueue = await Promise.all(jobsFromAPI.map(async (job) => {
    return await addJobToQueueFromAPIJob(job, PrismaClient)
  }))

  return {
    jobsAddedToQueue
  }
})

const getApiJobFromRemoteOkJob = (job: RemoteOkJob): JobFromAPIs => {
  const duration = 'Full Time'

  const experienceLevel = getExperienceLevelFromPositionAndTags(job.position, job.tags)

  const role = job.position

  const tags = getTagsFromRemoteOkTags(job.tags)

  const benefits = getBenefitsFromDescription(job.description)

  const locations = getLocationsFromLocationField(job.location)

  return {
    ...job,
    title: job.position,
    salary: String(job.salary_min),
    link: job.url,
    postedAt: new Date(job.date),
    slug: slug(job.position + '-' + job.company + '-' + job.id),
    description: `<p>${job.description}</p>`,
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

    tags,

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

const getTagsFromRemoteOkTags = (remoteOkTags:string[]) => {
  const tags = remoteOkTags.map(tag => ({
    name: tag,
    slug: slug(tag)
  }))

  return tags
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
