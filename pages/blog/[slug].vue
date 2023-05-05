<template>
  <main class="max-w-3xl mx-auto text-lg blog-post">
    <ContentDoc v-slot="{doc}">
      <h1 class="leading-tight md:text-5xl">
        {{ doc.title }}
      </h1>

      <p />

      <img class="max-w-full" :src="doc.image" alt="">

      <p class="flex items-center">
        Written By: <a class="ml-1 mr-2" href="https://nirjan.dev">Nirjan Khadka</a> <n-tag round :bordered="false">
          {{ doc.date }}
        </n-tag>
      </p>

      <ContentRenderer :value="doc" />
    </ContentDoc>
  </main>
</template>

<script setup lang="ts">

</script>

<style>
.blog-post h2 a, .blog-post h3 a {
  color: inherit;
}
</style>
