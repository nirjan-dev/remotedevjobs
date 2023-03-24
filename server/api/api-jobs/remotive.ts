import { H3Event } from 'h3'
import slug from 'slug'
import { addJobToQueueFromAPIJob, benefitsParser } from '~~/server/api/api-jobs/apiJobsService'
import { JobFromAPIs, RemotiveJob } from '~~/server/api/api-jobs/JobsFromAPIs.type'

export default defineEventHandler(async (event: H3Event) => {
  const data = await (await fetch('https://remotive.io/api/remote-jobs?category=software-dev&limit=12'))

  const responseData: {jobs: RemotiveJob[]} = await data.json()

  const PrismaClient = event.context.prisma

  const jobsFromAPI = responseData.jobs.map(job => getAPIJobFromRemotiveJob(job))

  const jobsAddedToQueue = await Promise.all(jobsFromAPI.map(async (job) => {
    return await addJobToQueueFromAPIJob(job, PrismaClient)
  }))

  return {
    jobsAddedToQueue
  }
})

const getAPIJobFromRemotiveJob = (job: RemotiveJob): JobFromAPIs => {
  const duration = getDurationFromJobType(job.job_type)

  const experienceLevel = getExperienceLevelFromTitle(job.title)

  const role = getRoleFromTitle(job.title)

  const tags = getTagsFromRemotiveTags(job.tags)

  const benefits = getBenefitsFromDescription(job.description)

  return {
    ...job,
    link: job.url,
    postedAt: new Date(job.publication_date),
    slug: slug(job.title + '-' + job.company_name + '-' + job.id),
    company: {
      name: job.company_name,
      logo: job.company_logo_url,
      slug: slug(job.company_name),
      description: ''
    },
    locations: job.candidate_required_location.split(',').map(location => ({
      name: location,
      slug: slug(location)
    })),
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
const getDurationFromJobType = (jobType: string) => {
  return jobType.split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
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

// get role from job title
const getRoleFromTitle = (title: string) => {
  let role = ''

  if (title.toLowerCase().includes('frontend')) {
    role = 'frontend'
  }

  if (title.toLowerCase().includes('backend')) {
    role = 'backend'
  }

  if (title.toLowerCase().includes('fullstack')) {
    role = 'fullstack'
  }

  if (title.toLowerCase().includes('mobile')) {
    role = 'mobile'
  }

  if (title.toLowerCase().includes('devops')) {
    role = 'devops'
  }

  if (title.toLowerCase().includes('designer')) {
    role = 'designer'
  }

  if (title.toLowerCase().includes('product')) {
    role = 'product'
  }

  if (title.toLowerCase().includes('manager')) {
    role = 'manager'
  }

  if (title.toLowerCase().includes('qa')) {
    role = 'qa'
  }

  if (title.toLowerCase().includes('data')) {
    role = 'data'
  }

  if (title.toLowerCase().includes('security')) {
    role = 'security'
  }

  if (title.toLowerCase().includes('support')) {
    role = 'support'
  }

  if (title.toLowerCase().includes('android')) {
    role = 'android'
  }

  if (title.toLowerCase().includes('ios')) {
    role = 'ios'
  }

  return role
}

const getTagsFromRemotiveTags = (tags: string[]) => tags.map((tag) => {
  return {
    name: tag,
    slug: slug(tag.replace(/#/g, 'sharp '))
  }
})

const getBenefitsFromDescription = (description: string) => {
  // scrape description for benefits

  const benefits = benefitsParser(description)

  return benefits
}
