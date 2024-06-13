import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const slug = event.context.params?.slug ?? ''

  const PrismaClient = event.context.prisma

  const jobWithRole = await PrismaClient.job.findUnique({
    where: {
      slug
    },
    select: {
      id: true,
      roleId: true
    }
  })

  if (!jobWithRole) {
    return null
  }

  const jobRequest = PrismaClient.job.findUnique({
    where: {
      id: jobWithRole.id
    },
    select: {
      id: true,
      description: true,
      title: true,
      slug: true,
      salary: true,
      link: true,
      postedAt: true,
      company: {
        select: {
          name: true,
          id: true
        }
      },
      locations: {
        select: {
          name: true,
          id: true
        }
      },
      tags: {
        select: {
          name: true,
          id: true
        }
      },
      benefits: {
        select: {
          name: true,
          id: true
        }
      },
      Duration: {
        select: {
          name: true,
          id: true
        }
      }
    }
  })

  const similarJobsRequest = PrismaClient.job.findMany({
    where: {
      NOT: {
        id: jobWithRole.id
      },
      AND: [
        {
          roleId: jobWithRole.roleId
        }
      ]
    },
    take: 5,
    select: {
      id: true,
      title: true,
      slug: true,
      salary: true,
      link: true,
      postedAt: true,
      company: {
        select: {
          name: true,
          id: true
        }
      },
      locations: {
        select: {
          name: true,
          id: true
        }
      },
      tags: {
        select: {
          name: true,
          id: true
        }
      },
      benefits: {
        select: {
          name: true,
          id: true
        }
      },
      Duration: {
        select: {
          name: true,
          id: true
        }
      }
    },
    orderBy: {
      postedAt: 'desc'
    }
  })

  const [job, similarJobs] = await Promise.all([jobRequest, similarJobsRequest])

  return {
    ...job,
    similarJobs
  }
})
