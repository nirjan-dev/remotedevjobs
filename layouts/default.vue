<template>
  <NConfigProvider :theme="darkTheme">
    <NGlobalStyle />
    <NuxtLoadingIndicator />
    <nav-bar />
    <div class="container px-3 py-6 mx-auto">
      <slot />
      <div class="fixed bottom-0 left-0 w-full px-6 text-white bg-gray-700 border-t-2 border-gray-900 shadow-2xl shadow-gray-600">
        <div class="flex flex-wrap items-center justify-center w-full pb-3 mx-auto md:pb-0">
          <p
            class="mr-2 text-base font-bold md:text-lg "
          >
            Get more job posts directly in your inbox
          </p>
          <n-button type="error" :round="true" @click="openModal">
            <span class="text-lg font-bold">Subscribe Now</span>
          </n-button>
        </div>
      </div>

      <footer class="text-center mb-36 md:mb-24">
        <p>Built with 💜 by <a class="text-blue-700 underline" href="https://nirjan.dev">nirjan.dev</a> </p>
      </footer>

      <n-modal v-model:show="showModal" class="max-w-xl" preset="card" size="medium">
        <template #header>
          <h2 class="text-xl font-bold">
            Save time, find you next remote role faster
          </h2>
        </template>
        <p>Subscribe to get remote dev job posts from multiple sites directly to your inbox</p>

        <p>Unsubscribe anytime, No Spam, ever.</p>

        <newsletter-signup form-id="5018608" />
      </n-modal>
    </div>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { darkTheme } from 'naive-ui'

const showModal = ref(false)
const route = useRoute()

const openModal = () => {
  showModal.value = true
  useTrackEvent('open_subscribe_modal')
}
useHead({
  htmlAttrs: {
    lang: 'en'
  },
  script: [
    {
      src: 'https://rum.cronitor.io/script.js',
      async: true
    },
    {
      innerHTML: `
      window.cronitor = window.cronitor || function() { (window.cronitor.q = window.cronitor.q || []).push(arguments); };
    cronitor('config', { clientKey: '05cfec8593f01c3ef4affac4ad6e7ee9' });
    `
    },
    {
      innerHTML: `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "gezr3qvknq");`
    },
    {
      src: 'https://w.appzi.io/w.js?token=dfagO',
      async: true

    }
  ],
  meta: [
    {
      name: 'og:image',
      content: 'https://remotedevjobs.net/assets/images/og.jpg'
    },
    {
      name: 'og:image:width',
      content: '1200'
    },
    {
      name: 'og:image:height',
      content: '630'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:image',
      content: 'https://remotedevjobs.net/assets/images/og.jpg'
    }

  ],
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    },
    {
      rel: 'canonical',
      href: `https://remotedevjobs.net${route.path}`
    }
  ]
})

useSchemaOrg([
  defineWebSite({
    name: 'Remote Dev Jobs'
  }),
  defineWebPage({
    image: '/assets/images/og.jpg'
  })
])
</script>

<style>
ul {
  @apply list-none pl-0;
}

a {
  @apply text-green-400 no-underline;
}

*, *::before, *::after {
  @apply box-border;
}
</style>
