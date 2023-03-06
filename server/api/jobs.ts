import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const PrismaClient = event.context.prisma

  // send all jobs
  const jobs = await PrismaClient.job.findMany({
    include: {
      company: true,
      locations: true,
      Duration: true,
      ExperienceLevel: true,
      Role: true,
      tech: true,
      benefits: true
    },
    orderBy: {
      postedAt: 'desc'
    }
  })

  return jobs
})
