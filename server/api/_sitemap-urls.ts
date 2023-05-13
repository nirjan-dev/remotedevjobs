import { H3Event } from 'h3'
import { Post } from '~/types/blog.types'
import { serverQueryContent } from '#content/server'

export default cachedEventHandler(async (event:H3Event) => {
  const PrismaClient = event.context.prisma

  const jobs = await PrismaClient.job.findMany({
    select: {
      slug: true,
      updatedAt: true
    }
  })

  const jobRoutes = jobs.map(job => ({
    loc: `https://remotedevjobs.net/jobs/${job.slug}`,
    lastmod: job.updatedAt
  }))

  const posts = await serverQueryContent<Post>(event).find()
  const postRoutes = posts.map(post => ({
    loc: `https://remotedevjobs.net/${post._path}`,
    lastmod: new Date(post.dateModified ?? post.datePublished).toISOString()
  }))

  return [...jobRoutes, ...postRoutes]
}, {
  name: 'sitemap-dynamic-urls',
  maxAge: 60 * 10 // cache URLs for 10 minutes
})
