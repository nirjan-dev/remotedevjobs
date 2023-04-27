
import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const PrismaClient = event.context.prisma

  const [locations, experienceLevels, roles, tags] = await Promise.all([
    PrismaClient.location.findMany({
      select: {
        name: true
      }
    }),

    PrismaClient.experienceLevel.findMany({
      select: {
        name: true
      }
    }),

    PrismaClient.role.findMany({
      select: {
        name: true
      }
    }),

    PrismaClient.tag.findMany({
      select: {
        name: true
      }
    })

  ])
  const locationOptions = locations.map((location) => {
    return {
      label: location.name,
      value: location.name
    }
  })

  const experienceLevelOptions = experienceLevels.map((experienceLevel) => {
    return {
      label: experienceLevel.name,
      value: experienceLevel.name
    }
  })

  const roleOptions = roles.map((role) => {
    return {
      label: role.name,
      value: role.name
    }
  })

  const tagOptions = tags.map((tag) => {
    return {
      label: tag.name,
      value: tag.name
    }
  })

  return {
    locationOptions,
    experienceLevelOptions,
    roleOptions,
    tagOptions
  }
})
