import slug from 'slug'
import { PrismaClient } from '@prisma/client'
import DOMPurify from 'isomorphic-dompurify'
import { JobFromAPIs } from '~~/server/api/api-jobs/JobsFromAPIs.type'
import { logger } from '~~/utils/logger'

export const createJobFromAPIJob = async (job: JobFromAPIs, PrismaClient: PrismaClient) => {
  // check if job exists with the link
  const existingJob = await PrismaClient.job.findUnique({
    where: {
      link: job.link
    }
  })

  if (existingJob) { return existingJob }

  // if not, create job

  // get all the linked data
  let companyId, durationId, roleId, experienceLevelId, locationIds, techIds, benefitIds
  try {
    companyId = await createCompanyFromAPIJob(job, PrismaClient)
    durationId = await createDurationFromAPIJob(job, PrismaClient)
    roleId = await createRoleFromAPIJob(job, PrismaClient)
    experienceLevelId = await createExperienceLevelAPIJob(job, PrismaClient)
    locationIds = await createLocationsFromAPIJob(job, PrismaClient)
    techIds = await createTechFromAPIJob(job, PrismaClient)
    benefitIds = await createBenefitsFromAPIJob(job, PrismaClient)
  } catch (error: any) {
    logger.error(`Error creating job from Remotive job: ${JSON.stringify(job.link)}`, { error: error.message, stack: error.stack, job: { ...job, description: null } })
    return null
  }

  // create job

  const newJob = await PrismaClient.job.create({
    data: {
      title: job.title,
      description: DOMPurify.sanitize(job.description),
      link: job.link,
      salary: job.salary,
      postedAt: job.postedAt,
      slug: job.slug,
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
  logger.info(`Created job from Remotive API: ${JSON.stringify(job.link)}`, { jobTitle: newJob.title, jobLink: newJob.link })
  return newJob
}

const createCompanyFromAPIJob = async (job: JobFromAPIs, PrismaClient: PrismaClient) => {
  const { company } = job

  // check if company exists
  const existingCompany = await PrismaClient.company.findUnique({
    where: {
      slug: slug(company.slug)
    }
  })

  if (existingCompany) { return existingCompany.id }

  // if not, create company
  const createdCompany = await PrismaClient.company.create({
    data: {
      name: company.name,
      slug: company.slug,
      logo: company.logo,
      description: DOMPurify.sanitize(company.description)
    }
  })

  return createdCompany.id
}

const createLocationsFromAPIJob = async (job: JobFromAPIs, PrismaClient:PrismaClient) => {
  const { locations } = job

  // check if location exists for each location in job
  const existingLocations = await PrismaClient.location.findMany(
    {
      where: {
        slug: {
          in: locations.map(location => location.slug)
        }
      }
    })

  // if not, create location
  const locationsToCreate = locations.filter(location => !existingLocations.find(existingLocation => existingLocation.name === location.name))

  const createdLocations = await Promise.all(locationsToCreate.map(async (location) => {
    return await PrismaClient.location.create({
      data: {
        name: location.name,
        slug: location.slug
      }
    })
  }
  ))

  // return all locations

  return [...existingLocations, ...createdLocations].map(location => location.id)
}

const createDurationFromAPIJob = async (job: JobFromAPIs, PrismaClient: PrismaClient) => {
  const { duration } = job

  // check if duration exists
  const existingDuration = await PrismaClient.duration.findUnique({
    where: {
      slug: duration.slug
    }
  })

  if (existingDuration) { return existingDuration.id }

  // if not, create duration

  const createdDuration = await PrismaClient.duration.create({
    data: {
      name: duration.name,
      slug: duration.slug
    }
  })

  return createdDuration.id
}

const createExperienceLevelAPIJob = async (job: JobFromAPIs, PrismaClient: PrismaClient) => {
  const { experienceLevel } = job

  // check if experience level exists
  const existingExperienceLevel = await PrismaClient.experienceLevel.findUnique({
    where: {
      slug: experienceLevel.slug

    }
  })

  if (existingExperienceLevel) { return existingExperienceLevel.id }

  // if not, create experience level

  const createdExperienceLevel = await PrismaClient.experienceLevel.create({
    data: {
      name: experienceLevel.name,
      slug: experienceLevel.slug
    }
  })

  return createdExperienceLevel.id
}

const createRoleFromAPIJob = async (job: JobFromAPIs, PrismaClient: PrismaClient) => {
  const { role } = job

  // check if role exists
  const existingRole = await PrismaClient.role.findUnique({
    where: {
      slug: role.slug
    }
  })

  if (existingRole) { return existingRole.id }

  // if not, create role

  const createdRole = await PrismaClient.role.create({
    data: {
      name: role.name,
      slug: role.slug
    }
  })

  return createdRole.id
}

const createTechFromAPIJob = async (job: JobFromAPIs, PrismaClient: PrismaClient) => {
  const { tech } = job

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

const createBenefitsFromAPIJob = async (job: JobFromAPIs, PrismaClient: PrismaClient) => {
  const { benefits } = job

  // check if benefits exist
  const existingBenefits = await PrismaClient.benefit.findMany({
    where: {
      name: {
        in: benefits.map(benefit => benefit.name)
      }
    }
  })

  // if not, create benefits
  const benefitsToCreate = benefits.filter(benefit => !existingBenefits.find(existingBenefit => existingBenefit.name === benefit.name))

  const createdBenefits = await Promise.all(benefitsToCreate.map(async (benefit) => {
    return await PrismaClient.benefit.create({
      data: {
        name: benefit.name,
        slug: benefit.slug

      }
    })
  }

  ))

  // return all benefits

  return [...existingBenefits, ...createdBenefits].map(benefit => benefit.id)
}

export const benefitsParser = (text: string) => {
  const termsToCheck = ['flexible', 'work from home',
    'work from anywhere', '4 day work week', 'visa sponsorship', 'relocation', 'unlimited pto', 'childcare', 'gym', 'stock options', 'equity', 'pension', 'health insurance', 'dental', 'wellness programs', 'employee discount', 'pet friendly']

  const benefits = termsToCheck.filter(term => text.toLowerCase().includes(term)).map(benefit => ({
    name: benefit,
    slug: slug(benefit)
  }))

  return benefits
}
