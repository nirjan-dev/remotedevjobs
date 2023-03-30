<template>
  <div>
    <NuxtLoadingIndicator />
    <div class="container px-3 py-6 mx-auto">
      <slot />
      <footer class="text-center">
        <p>Built with 💜 by <a class="text-blue-700 underline" href="https://nirjan.dev">nirjan.dev</a> </p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  ]
})
</script>

<style scoped>

</style>
