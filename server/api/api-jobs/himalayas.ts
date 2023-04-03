import { H3Event } from 'h3'
import slug from 'slug'
import { addJobToQueueFromAPIJob, benefitsParser } from '~~/server/api/api-jobs/apiJobsService'
import { HimalayasJob, JobFromAPIs } from '~~/server/api/api-jobs/JobsFromAPIs.type'

export default defineEventHandler(async (event: H3Event) => {
  const data = await (await fetch('https://himalayas.app/jobs/api'))

  const responseData: {jobs: HimalayasJob[]} = await data.json()

  const PrismaClient = event.context.prisma

  const developeJobs = responseData.jobs.filter((job) => {
    // check to see if one of the categories in the job contains the text 'developer'
    return job.categories.some((category) => {
      return category.toLowerCase().includes('developer')
    })
  }).splice(0, 20)

  const jobsFromAPI = developeJobs.map(job => getAPIJobFromHimalaysJob(job))

  const jobsAddedToQueue = await Promise.all(jobsFromAPI.map(async (job) => {
    return await addJobToQueueFromAPIJob(job, PrismaClient)
  }))

  return {
    jobsAddedToQueue: jobsAddedToQueue.map(job => job?.link)
  }
})

const getAPIJobFromHimalaysJob = (job: HimalayasJob): JobFromAPIs => {
  // const duration = getDurationFromJobType(job.job_type)

  const experienceLevel = getExperienceLevelFromTitle(job.title)

  const role = getRoleFromTitle(job.title)

  const tags = getTagsFromCategories(job.categories)

  const benefits = getBenefitsFromDescription(job.description)

  const locations = getLocations(job.locationRestrictions)

  const duration = {
    name: 'Full Time',
    slug: 'full-time'
  }

  return {
    ...job,
    company: {
      name: job.companyName,
      logo: job.companyLogo,
      slug: slug(job.companyName),
      description: ''
    },
    link: job.applicationLink,
    postedAt: new Date(job.pubDate * 1000),
    slug: slug(job.title + '-' + job.companyName + '-' + job.pubDate),
    locations,
    duration,
    role: {
      name: role,
      slug: slug(role)
    },
    tags,
    salary: 'unknown salary',
    experienceLevel: {
      name: experienceLevel,
      slug: slug(experienceLevel)
    },

    benefits

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

const getTagsFromCategories = (categories: string[]) => categories.map((category) => {
  return {
    name: category,
    slug: slug(category)
  }
})

const getBenefitsFromDescription = (description: string) => {
  // scrape description for benefits

  const benefits = benefitsParser(description)

  return benefits
}

const getLocations = (locationRestrictions: string[]) => {
  let locations
  if (locationRestrictions.length > 0) {
    locations = locationRestrictions.map(location => ({
      name: location,
      slug: slug(location)
    }))
  } else {
    locations = [{
      name: 'Worldwide',
      slug: 'worldwide'
    }]
  }
  return locations
}
