import { setAbsoluteSqliteDatabaseUrlForPrisma } from './prisma/utils'

setAbsoluteSqliteDatabaseUrlForPrisma()

export default defineNuxtConfig({
  runtimeConfig: {
    version: '0.0.1'
  },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-svgo', '@huntersofbook/naive-ui-nuxt', 'nuxt-gtag', 'nuxt-simple-sitemap'],
  extends: ['@sidebase/core'],
  typescript: {
    shim: false
  },
  routeRules: {
    '/*': {
      swr: true
    },
    '/': {
      prerender: true
    }
  },
  gtag: {
    id: 'G-QY0M8DZKCN'
  },
  sitemap: {
    siteUrl: 'https://remotedevjobs.net'
  }

})
