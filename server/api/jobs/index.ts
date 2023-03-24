import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const PrismaClient = event.context.prisma

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
      }
    }
  })

  return jobs
})
