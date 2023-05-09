import { setAbsoluteSqliteDatabaseUrlForPrisma } from './prisma/utils'

setAbsoluteSqliteDatabaseUrlForPrisma()

export default defineNuxtConfig({
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
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  },
  schemaOrg: {
    host: 'https://remotedevjobs.net'
  }

})
