import Parser from 'rss-parser'

export default defineEventHandler(async () => {
  const link = 'https://jobspresso.co/?feed=job_feed&job_types=developer&search_location=&job_categories=&search_keywords=&HTLD=1'

  // const link = 'https://weworkremotely.com/categories/remote-programming-jobs.rss'

  const feed = await new Parser().parseURL(link)

  return {
    feed
  }
})
