import { H3Event } from 'h3'
import slug from 'slug'
import { addJobToQueueFromAPIJob, benefitsParser } from '~~/server/api/api-jobs/apiJobsService'
import { JobFromAPIs, WorkingNomadsJob } from '~~/server/api/api-jobs/JobsFromAPIs.type'

export default defineEventHandler(async (event: H3Event) => {
  const data = await (await fetch('https://www.workingnomads.com/api/exposed_jobs/'))

  const responseData: WorkingNomadsJob[] = await data.json()

  const devJobs = responseData.filter(job => job.category_name.toLowerCase() === 'development')

  const PrismaClient = event.context.prisma

  const jobsFromAPI = devJobs.map(job => getApiJobFromWorkingNomadsJob(job))

  const jobsAddedToQueue = await Promise.all(jobsFromAPI.map(async (job) => {
    return await addJobToQueueFromAPIJob(job, PrismaClient)
  }))

  return {
    success: true,
    jobs: jobsAddedToQueue
  }
})

const getApiJobFromWorkingNomadsJob = (job: WorkingNomadsJob): JobFromAPIs => {
  const experienceLevel = getExperienceLevelFromTitle(job.title)

  const role = getRoleFromTitle(job.title)

  const tags = getTagsFromJobTags(job.tags)

  const benefits = getBenefitsFromDescription(job.description)

  const locations = job.location.split(',').map((location) => {
    return {
      name: location.trim(),
      slug: slug(location.trim())
    }
  })

  return {
    ...job,
    company: {
      description: '',
      name: job.company_name,
      slug: slug(job.company_name),
      logo: ''
    },
    locations,
    experienceLevel: {
      name: experienceLevel,
      slug: slug(experienceLevel)
    },
    role: {
      name: role,
      slug: slug(role)
    },
    tags,
    benefits,
    duration: {
      name: 'Full Time',
      slug: 'full-time'
    },
    salary: 'unknown',
    link: job.url,
    postedAt: new Date(job.pub_date),
    slug: slug(job.title + '-' + job.company_name + '-' + new Date(job.pub_date).getTime())
  }
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

const getTagsFromJobTags = (tags: string) => tags.split(',').map((tag) => {
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
