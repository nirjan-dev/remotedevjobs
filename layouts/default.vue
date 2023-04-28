<template>
  <NConfigProvider :theme="darkTheme">
    <NGlobalStyle />
    <NuxtLoadingIndicator />
    <nav-bar />
    <div class="container px-3 py-6 mx-auto">
      <slot />
      <div class="fixed bottom-0 left-0 w-full px-6 py-4 text-white bg-gray-700 border-t-2 border-gray-900 shadow-2xl shadow-gray-600">
        <div class="flex flex-wrap items-center justify-center w-full gap-2 mx-auto">
          <p
            class="mr-2 text-base font-bold md:text-lg "
          >
            Get weekly job alerts in your inbox
          </p>
          <n-button type="warning" :round="true" @click="showModal = true">
            <span class="text-lg font-bold">Subscribe</span>
          </n-button>
        </div>
      </div>

      <footer class="text-center mb-36 md:mb-24">
        <p>Built with 💜 by <a class="text-blue-700 underline" href="https://nirjan.dev">nirjan.dev</a> </p>
      </footer>

      <n-modal v-model:show="showModal" class="max-w-xl" preset="card" size="medium">
        <template #header>
          <h2 class="text-2xl font-bold">
            Subscribe to the weekly job posts
          </h2>
        </template>

        <newsletter-signup form-id="5018608" />
      </n-modal>
    </div>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { darkTheme } from 'naive-ui'

const showModal = ref(false)

useHead({
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
    }
  ],
  meta: [
    {
      name: 'og:image',
      content: '/assets/images/og.jpg'
    }
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }
  ]
})
</script>

<style>
ul {
  @apply list-none pl-0;
}

a {
  @apply text-blue-700 underline;
}

*, *::before, *::after {
  @apply box-border;
}
</style>
