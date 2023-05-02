import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const PrismaClient = event.context.prisma
  const query = getQuery(event)

  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const jobsPerPage = limit

  // filters
  const locationsFilter = query.locations === 'undefined' ? undefined : query.locations?.toString().split(',') || undefined
  const rolesFilter = query.roles === 'undefined' ? undefined : query.roles?.toString().split(',') || undefined

  const experienceLevelsFilter = query.experienceLevels === 'undefined' ? undefined : query.experienceLevels?.toString().split(',') || undefined

  const tagsFilter = query.tags === 'undefined' ? undefined : query.tags?.toString().split(',') || undefined

  const benefitsFilter = query.benefits === 'undefined' ? undefined : query.benefits?.toString().split(',') || undefined

  // send all jobs
  const [jobs, count] = await Promise.all([PrismaClient.job.findMany({
    orderBy: {
      postedAt: 'desc'
    },
    select: {
      title: true,
      salary: true,
      link: true,
      postedAt: true,
      slug: true,
      id: true,
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
      Duration: {
        select: {
          name: true,
          id: true
        }
      },
      Role: {
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
      ExperienceLevel: {
        select: {
          name: true,
          id: true
        }
      }
    },
    where: {
      locations: {
        some: {
          name: {
            in: locationsFilter
          }
        }
      },
      Role: {
        is: {
          name: {
            in: rolesFilter
          }
        }
      },
      ExperienceLevel: {
        is: {
          name: {
            in: experienceLevelsFilter
          }
        }
      },
      tags: {
        some: {
          name: {
            in: tagsFilter
          }
        }
      },
      benefits: {
        some: {
          name: {
            in: benefitsFilter
          }
        }
      }
    },
    take: jobsPerPage,
    skip: (page - 1) * jobsPerPage
  }),

  PrismaClient.job.count({
    where: {
      locations: {
        some: {
          name: {
            in: locationsFilter
          }
        }
      },
      Role: {
        is: {
          name: {
            in: rolesFilter
          }
        }
      },
      ExperienceLevel: {
        is: {
          name: {
            in: experienceLevelsFilter
          }
        }
      },
      tags: {
        some: {
          name: {
            in: tagsFilter
          }
        }
      },
      benefits: {
        some: {
          name: {
            in: benefitsFilter
          }
        }
      }
    }
  })])
  return { jobs, count }
})
