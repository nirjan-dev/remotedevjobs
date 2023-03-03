import { PrismaClient } from '@prisma/client'
import { H3Event } from 'h3'
import slug from 'slug'
import { RemotiveJob } from '~~/server/api/api-jobs/JobsFromAPIs.type'
import { logger } from '~~/utils/logger'

export default defineEventHandler(async (event: H3Event) => {
  const data = await (await fetch('https://remotive.io/api/remote-jobs?category=software-dev&limit=12'))

  const responseData: {jobs: RemotiveJob[]} = await data.json()

  const PrismaClient = event.context.prisma

  const createdJobs = await Promise.all(responseData.jobs.map(async (job) => {
    return await createJobFromRemotiveJob(job, PrismaClient)
  }))

  return {
    createdJobs,
    remotiveJobs: responseData.jobs
  }
})

const createJobFromRemotiveJob = async (job: RemotiveJob, PrismaClient: PrismaClient) => {
  // check if job exists with the link
  const existingJob = await PrismaClient.job.findUnique({
    where: {
      link: job.url
    }
  })

  if (existingJob) { return existingJob }

  // if not, create job

  // get all the linked data
  let companyId, durationId, roleId, experienceLevelId, locationIds, techIds, benefitIds
  try {
    companyId = await createCompanyFromRemotiveJob(job, PrismaClient)
    durationId = await createDurationFromRemotiveJob(job, PrismaClient)
    roleId = await createRoleFromRemotiveJob(job, PrismaClient)
    experienceLevelId = await createExperienceLevelFromRemotiveJob(job, PrismaClient)
    locationIds = await createLocationsFromRemotiveJob(job, PrismaClient)
    techIds = await createTechFromRemotiveJob(job, PrismaClient)
    benefitIds = await createBenefitsFromRemotiveJob(job, PrismaClient)
  } catch (error: any) {
    logger.error(`Error creating job from Remotive job: ${JSON.stringify(job.url)}`, { error: error.message, stack: error.stack, job })
    return null
  }

  // create job

  const newJob = await PrismaClient.job.create({
    data: {
      title: job.title,
      description: job.description,
      link: job.url,
      salary: job.salary,
      postedAt: new Date(job.publication_date),
      slug: slug(job.title + '-' + job.publication_date),
      companyId,
      durationId,
      roleId,
      experienceLevelId,

      locations: {
        connect: locationIds.map(locationId => ({ id: locationId }))
      },

      tech: {
        connect: techIds.map(techId => ({ id: techId }))
      },

      benefits: {
        connect: benefitIds.map(benefitId => ({ id: benefitId }))
      }

    }
  })
  logger.info(`Created job from Remotive API: ${JSON.stringify(job.url)}`, { jobTitle: newJob.title, jobLink: newJob.link })
  return newJob
}

const createCompanyFromRemotiveJob = async (job: RemotiveJob, PrismaClient: PrismaClient) => {
  // check if company exists
  const existingCompany = await PrismaClient.company.findUnique({
    where: {
      slug: slug(job.company_name)
    }
  })

  if (existingCompany) { return existingCompany.id }

  // if not, create company
  const createdCompany = await PrismaClient.company.create({
    data: {
      name: job.company_name,
      slug: slug(job.company_name),
      logo: job.company_logo_url,
      description: ''
    }
  })

  return createdCompany.id
}

const createLocationsFromRemotiveJob = async (job: RemotiveJob, PrismaClient:PrismaClient) => {
  const locationsInJob = job.candidate_required_location.split(',').map(location => location.trim())

  const locationsInJobSlugs = locationsInJob.map(location => slug(location))

  // check if location exists for each location in job
  const existingLocations = await PrismaClient.location.findMany(
    {
      where: {
        slug: {
          in: locationsInJobSlugs
        }
      }
    })

  // if not, create location
  const locationsToCreate = locationsInJob.filter(location => !existingLocations.find(existingLocation => existingLocation.name === location))

  const createdLocations = await Promise.all(locationsToCreate.map(async (location) => {
    return await PrismaClient.location.create({
      data: {
        name: location,
        slug: slug(location)
      }
    })
  }
  ))

  // return all locations

  return [...existingLocations, ...createdLocations].map(location => location.id)
}

const createDurationFromRemotiveJob = async (job: RemotiveJob, PrismaClient: PrismaClient) => {
  // check if duration exists
  const existingDuration = await PrismaClient.duration.findUnique({
    where: {
      slug: slug(job.job_type)
    }
  })

  if (existingDuration) { return existingDuration.id }

  // if not, create duration

  // transform job_type to duration name
  const getDurationName = (jobType: string) => jobType.split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')

  const createdDuration = await PrismaClient.duration.create({
    data: {
      name: getDurationName(job.job_type),
      slug: slug(job.job_type)
    }
  })

  return createdDuration.id
}

const createExperienceLevelFromRemotiveJob = async (job: RemotiveJob, PrismaClient: PrismaClient) => {
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

  const experienceLevel = getExperienceLevelFromTitle(job.title)
  // check if experience level exists
  const existingExperienceLevel = await PrismaClient.experienceLevel.findUnique({
    where: {
      slug: slug(experienceLevel)

    }
  })

  if (existingExperienceLevel) { return existingExperienceLevel.id }

  // if not, create experience level

  const createdExperienceLevel = await PrismaClient.experienceLevel.create({
    data: {
      name: experienceLevel,
      slug: slug(experienceLevel)
    }
  })

  return createdExperienceLevel.id
}

const createRoleFromRemotiveJob = async (job: RemotiveJob, PrismaClient: PrismaClient) => {
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

  const role = getRoleFromTitle(job.title)

  // check if role exists
  const existingRole = await PrismaClient.role.findUnique({
    where: {
      slug: slug(role)
    }
  })

  if (existingRole) { return existingRole.id }

  // if not, create role

  const createdRole = await PrismaClient.role.create({
    data: {
      name: role,
      slug: slug(role)
    }
  })

  return createdRole.id
}

const createTechFromRemotiveJob = async (job: RemotiveJob, PrismaClient: PrismaClient) => {
  // get tech from the tags
  const tech = job.tags.map((tag) => {
    return {
      name: tag,
      slug: slug(tag.replace(/#/g, 'sharp '))
    }
  })

  // check if tech exists
  const existingTech = await PrismaClient.tech.findMany({
    where: {
      slug: {
        in: tech.map(tech => tech.slug)
      }
    }
  })

  // if not, create tech
  const techToCreate = tech.filter(tech => !existingTech.find(existingTech => existingTech.slug === tech.slug))

  const createdTech = await Promise.all(techToCreate.map(async (tech) => {
    return await PrismaClient.tech.create({
      data: {
        name: tech.name,
        slug: tech.slug
      }
    })
  }
  ))

  // return all tech

  return [...existingTech, ...createdTech].map(tech => tech.id)
}

const createBenefitsFromRemotiveJob = async (job: RemotiveJob, PrismaClient: PrismaClient) => {
  // scrape description for benefits

  const termsToCheck = ['flexible', 'work from home',
    'work from anywhere', '4 day work week', 'visa sponsorship', 'relocation', 'unlimited pto', 'childcare', 'gym', 'stock options', 'equity', 'pension', 'health insurance', 'dental', 'wellness programs', 'employee discount', 'pet friendly']

  const benefits = termsToCheck.filter(term => job.description.toLowerCase().includes(term))

  // check if benefits exist
  const existingBenefits = await PrismaClient.benefit.findMany({
    where: {
      name: {
        in: benefits
      }
    }
  })

  // if not, create benefits
  const benefitsToCreate = benefits.filter(benefit => !existingBenefits.find(existingBenefit => existingBenefit.name === benefit))

  const createdBenefits = await Promise.all(benefitsToCreate.map(async (benefit) => {
    return await PrismaClient.benefit.create({
      data: {
        name: benefit,
        slug: slug(benefit)

      }
    })
  }

  ))

  // return all benefits

  return [...existingBenefits, ...createdBenefits].map(benefit => benefit.id)
}
