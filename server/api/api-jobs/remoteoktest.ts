import { logger } from '~/utils/logger'
import { RemoteOkJob } from '~~/server/api/api-jobs/JobsFromAPIs.type'

export default defineEventHandler(async () => {
  let data
  try {
    data = await (await fetch('https://remoteok.com/api?api=1'))
    logger.log('Fetched remoteok jobs', data.statusText)
    data.headers.forEach((value, key) => {
      logger.log(key, value)
    })
    const responseData: RemoteOkJob[] = await data.json()

    return responseData
  } catch (error:any) {
    logger.log(error.message, 'Error fetching remoteok jobs', data?.statusText)
    data?.headers.forEach((value, key) => {
      logger.log(key, value)
    })
    return {
      error: error.message
    }
  }
})
