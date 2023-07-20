import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const slug = event.context.params?.slug ?? ''

  const PrismaClient = event.context.prisma

  // send job by slug

  const job = await PrismaClient.job.findUnique({
    where: {
      slug
    },
    include: {
      company: true,
      locations: true,
      Duration: true,
      ExperienceLevel: true,
      Role: true,
      tags: true,
      benefits: true
    }
  })

  if (!job) {
    return null
  }

  const similarJobs = await PrismaClient.job.findMany({
    where: {
      NOT: {
        id: job.id
      },
      OR: [
        {
          roleId: job.Role.id
        },
        {
          AND: [
            {
              locations: {
                some: {
                  id: {
                    in: job.locations.map(location => location.id)
                  }
                }
              }
            },
            {
              tags: {
                some: {
                  id: {
                    in: job.tags.map(tag => tag.id)
                  }
                }
              }
            },

            {
              benefits: {
                some: {
                  id: {
                    in: job.benefits.map(benefit => benefit.id)
                  }
                }
              }
            }
          ]
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

  return {
    ...job,
    similarJobs
  }
})
