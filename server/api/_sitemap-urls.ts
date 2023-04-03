import { H3Event } from 'h3'

export default cachedEventHandler(async (event:H3Event) => {
  const PrismaClient = event.context.prisma

  const jobs = await PrismaClient.job.findMany({
    select: {
      slug: true,
      updatedAt: true
    }
  })

  return jobs.map(job => ({
    loc: `https://remotedevjobs.net/jobs/${job.slug}`,
    lastmod: job.updatedAt
  }))
}, {
  name: 'sitemap-dynamic-urls',
  maxAge: 60 * 10 // cache URLs for 10 minutes
})
