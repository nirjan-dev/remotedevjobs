import { logger } from '~/utils/logger'
import { RemoteOkJob } from '~~/server/api/api-jobs/JobsFromAPIs.type'

export default defineEventHandler(async () => {
  let data
  try {
    data = await (await fetch('https://remoteok.com/api?api=1'))
    logger.info('Fetched remoteok jobs', data.headers, data.statusText)
    const responseData: RemoteOkJob[] = await data.json()

    return responseData
  } catch (error:any) {
    logger.error(error.message, 'Error fetching remoteok jobs', data?.headers, data?.statusText)
    return {
      error: error.message
    }
  }
})
