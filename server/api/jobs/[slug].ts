import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const slug = event.context.params.slug

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

  return job
})
