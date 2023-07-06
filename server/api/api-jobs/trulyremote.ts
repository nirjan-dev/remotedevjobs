import { H3Event } from 'h3'
import slug from 'slug'
import { addJobToQueueFromAPIJob, benefitsParser } from '~~/server/api/api-jobs/apiJobsService'
import { JobFromAPIs, TrulyRemoteFields, TrulyRemoteRecord } from '~~/server/api/api-jobs/JobsFromAPIs.type'

export default defineEventHandler(async (event: H3Event) => {
  const data = await (await fetch('https://trulyremote.co/api/getListing', {
    method: 'POST',
    body: JSON.stringify({
      category: 'Development'
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }))

  const responseData: {records: TrulyRemoteRecord[]} = await data.json()

  const PrismaClient = event.context.prisma

  const jobsFromAPI = responseData.records.map(job => getAPIJobFromTrulyRemoteJob(job))

  const jobsAddedToQueue = await Promise.all(jobsFromAPI.map(async (job) => {
    return await addJobToQueueFromAPIJob(job, PrismaClient)
  }))

  return {
    jobsAddedToQueue
  }
})

const getAPIJobFromTrulyRemoteJob = (record: TrulyRemoteRecord): JobFromAPIs => {
  const { fields: job } = record

  const experienceLevel = getExperienceLevelFromJob(job)

  const role = getRoleFromJob(job)

  const tags = getTagsFromJob(job)

  // const benefits = getBenefitsFromDescription(job.description)

  // const duration = job.postitionType?.toLowerCase() ?? 'Full Time'

  // const salary = job.noSalary ? `${job.salaryLower} - ${job.salaryUpper}` : 'unknown salary'

  const locations = job.useListingRegions === 'Anywhere in the world'
    ? [{
        name: 'Worldwide',
        slug: slug('Worldwide')
      }]
    : job.useListingRegions.split(',').map(location => ({
      name: location,
      slug: slug(location)
    }))

  const description = `
  <h2>Apply to the role of ${job.role} at ${job.companyName[0]}</h2>
  <img width="250" height="250" src="${job.companyLogoURL[0]}" alt="${job.companyName[0]} logo" />
    <p>
    ${job.companyName[0]} is a ${job.companyIndustry} company with teams in ${job.companyRegions}
    </p>

    <p>
      This is a fully remote job so you'll be able to work from ${job.useListingRegions}.
    </p>

    <p>
    To apply for the role please visit <a rel="noreferrer noopener" href="${job.roleApplyURL}">the application link.</a>
    </p>
    `.replaceAll('\n', '')

  return {
    ...job,
    company: {
      name: job.companyName[0],
      description: '',
      logo: job.companyLogoURL[0],
      slug: slug(job.companyName[0])
    },
    locations,
    duration: {
      name: 'Full Time',
      slug: slug('Full Time')
    },
    experienceLevel,
    tags,
    title: job.role,
    link: job.roleApplyURL,
    postedAt: job.createdOn,
    salary: 'unknown salary',
    role,
    slug: slug(`${job.role}-${job.companyName[0]}-${job.listingID}`),
    // couldn't really find a good way to parse the benefits
    benefits: [{
      name: 'Flexible',
      slug: slug('Flexible')
    }],
    description

  }
}

const getExperienceLevelFromJob = (job: TrulyRemoteFields) => {
  let experienceLevel = ''

  const title = job.role

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

  return {
    name: experienceLevel,
    slug: slug(experienceLevel)
  }
}

// get role from job title
const getRoleFromJob = (job: TrulyRemoteFields) => {
  let role = ''
  const title = job.role

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

  return {
    name: role,
    slug: slug(role)
  }
}

const getTagsFromJob = (job: TrulyRemoteFields) => {
  const tags = []

  tags.push(job.roleCategory[0])
  tags.push(job.companyIndustry[0])

  return tags.map(tag => ({ name: tag, slug: slug(tag) }))
}
