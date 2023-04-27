
import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const PrismaClient = event.context.prisma

  const roles = await PrismaClient.role.findMany({
    select: {
      name: true
    }
  })
  return roles
})
