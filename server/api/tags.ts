import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const PrismaClient = event.context.prisma

  const tags = await PrismaClient.tag.findMany({
    select: {
      name: true
    }
  })
  return tags
})
