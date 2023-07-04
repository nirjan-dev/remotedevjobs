import { H3Event } from 'h3'
import slug from 'slug'
import { addJobToQueueFromAPIJob, benefitsParser } from '~~/server/api/api-jobs/apiJobsService'
import { DevRemoteJob, JobFromAPIs } from '~~/server/api/api-jobs/JobsFromAPIs.type'

export default defineEventHandler(async (event: H3Event) => {
  const data = await (await fetch('https://devremote.io/api/jobs/filter', {
    method: 'POST',
    body: JSON.stringify({
      query: {
        search: '',
        techStack: [],
        date: 'ALL',
        employmentType: 'FULL_TIME',
        removeCompetitiveSalary: false,
        salaryRange: {
          min: 0,
          max: 10000000
        },
        tags: []
      },
      pageSize: 30,
      skip: 0
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }))

  const responseData: {jobs: DevRemoteJob[]} = await data.json()

  const PrismaClient = event.context.prisma

  const jobsFromAPI = responseData.jobs.map(job => getAPIJobFromDevRemoteJob(job))

  const jobsAddedToQueue = await Promise.all(jobsFromAPI.map(async (job) => {
    return await addJobToQueueFromAPIJob(job, PrismaClient)
  }))

  return {
    jobsAddedToQueue
  }
})

const getAPIJobFromDevRemoteJob = (job: DevRemoteJob): JobFromAPIs => {
  const experienceLevel = getExperienceLevelFromJob(job)

  const role = getRoleFromTitle(job.title)

  const tags = getTagsFromJobTags(job.tags)

  const benefits = getBenefitsFromDescription(job.description)

  const duration = job.postitionType?.toLowerCase() ?? 'Full Time'

  const salary = job.noSalary ? `${job.salaryLower} - ${job.salaryUpper}` : 'unknown salary'

  return {
    ...job,
    // I'm only searching worldwide jobs from the endpoint
    locations: [{
      name: 'worldwide',
      slug: slug('worldwide')
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

    benefits,

    link: job.applicationLink,

    postedAt: new Date(job.createdAt),

    company: {
      name: job.company,
      description: '',
      logo: job.companyLogo,
      slug: slug(job.company)
    },

    tags,

    salary

  }
}

const getExperienceLevelFromJob = (job: DevRemoteJob) => {
  let experienceLevel = ''

  if (job.seniority && job.seniority !== 'NOT_STATED') {
    return job.seniority
  }

  const title = job.title

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

const getTagsFromJobTags = (tags: string[]) => tags.map((tag) => {
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
