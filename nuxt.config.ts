import { setAbsoluteSqliteDatabaseUrlForPrisma } from './prisma/utils'

setAbsoluteSqliteDatabaseUrlForPrisma()

export default defineNuxtConfig({
  runtimeConfig: {
    version: '0.0.1'
  },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-svgo', '@huntersofbook/naive-ui-nuxt', 'nuxt-gtag'],
  extends: ['@sidebase/core'],
  typescript: {
    shim: false
  },
  naiveUI: { themeOverrides: { common: { primaryColor: '#ff0000', primaryColorHover: '#8b0000' } } },
  routeRules: {
    '/*': {
      swr: true
    },
    '/': {
      swr: true
    }
  },
  gtag: {
    id: 'G-QY0M8DZKCN'
  }
})
