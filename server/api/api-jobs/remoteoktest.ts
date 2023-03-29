/* eslint-disable no-console */
import { RemoteOkJob } from '~~/server/api/api-jobs/JobsFromAPIs.type'

export default defineEventHandler(async () => {
  let data
  try {
    data = await fetch('https://remoteok.com/api?api=1', {
      credentials: 'include',
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:108.0) Gecko/20100101 Firefox/108.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache'
      },
      method: 'GET',
      mode: 'cors'
    })
    console.log('Fetched remoteok jobs', data)

    return {
      data
    }
  } catch (error:any) {
    console.log(error.message, 'Error fetching remoteok jobs', data?.statusText, data, error)

    return {
      error: error.message
    }
  }
})
