import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const PrismaClient = event.context.prisma
  const query = getQuery(event)

  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const jobsPerPage = limit

  console.log('page', page, 'limit', limit, 'jobsPerPage', jobsPerPage)

  // send all jobs
  const jobs = await PrismaClient.job.findMany({
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
    take: jobsPerPage,
    skip: (page - 1) * jobsPerPage
  })

  return jobs
})
