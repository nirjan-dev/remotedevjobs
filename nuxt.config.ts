import { PrismaClient } from '@prisma/client'
import { setAbsoluteSqliteDatabaseUrlForPrisma } from './prisma/utils'

setAbsoluteSqliteDatabaseUrlForPrisma()

export default defineNuxtConfig({
  hooks: {
    async 'prerender:routes' (ctx) {
      const prisma = new PrismaClient()

      const jobs = await prisma.job.findMany({
        orderBy: {
          postedAt: 'desc'
        },
        select: {
          slug: true
        }
      })

      for (const job of jobs) {
        ctx.routes.add(`/jobs/${job.slug}`)
      }
    }
  },
  runtimeConfig: {
    version: '0.0.1',
    convertkit_api_key: ''
  },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-svgo', '@huntersofbook/naive-ui-nuxt', 'nuxt-gtag', 'nuxt-simple-sitemap', 'nuxt-schema-org', '@nuxt/content'],
  extends: ['@sidebase/core'],
  typescript: {
    shim: false
  },
  gtag: {
    id: 'G-QY0M8DZKCN'
  },
  sitemap: {
    siteUrl: 'https://remotedevjobs.net'
  },
  schemaOrg: {
    host: 'https://remotedevjobs.net'
  }

})
