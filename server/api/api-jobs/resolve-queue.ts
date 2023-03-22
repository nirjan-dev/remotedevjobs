import { H3Event } from 'h3'
import { createJobFromAPIJob } from '~~/server/api/api-jobs/apiJobsService'
import { JobFromAPIs } from '~~/server/api/api-jobs/JobsFromAPIs.type'
import { logger } from '~~/utils/logger'

export default defineEventHandler(async (event: H3Event) => {
  const PrismaClient = event.context.prisma

  const queueItem = await PrismaClient.jobQueue.findFirst({
    orderBy: {
      createdAt: 'asc'
    }
  })

  if (!queueItem || !queueItem.jobDetails) {
    logger.info('No jobs in queue')
    return {}
  }

  const job = (queueItem.jobDetails as unknown) as JobFromAPIs

  let newJob

  try {
    newJob = await createJobFromAPIJob(job, PrismaClient)

    await PrismaClient.jobQueue.delete({
      where: {
        id: queueItem.id
      }
    })

    logger.info('Created job from queue item', { jobTitle: job.title, jobLink: job.link })
  } catch (error:any) {
    logger.error(error, 'Error creating job from queue item', { jobTitle: job.title, jobLink: job.link })
  }

  return {
    newJob
  }
})
