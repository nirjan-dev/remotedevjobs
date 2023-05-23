<template>
  <main class="max-w-3xl mx-auto text-lg blog-post">
    <ContentDoc v-slot="{doc}">
      <h1 class="leading-tight md:text-5xl">
        {{ doc.title }}
      </h1>

      <img :height="doc.image.height" :width="doc.image.width" class="object-cover max-w-full max-h-72" :src="doc.image.src">

      <p class="flex items-center">
        Written By: <a class="ml-1 mr-2" href="https://nirjan.dev">Nirjan Khadka</a> on&nbsp;
        <span>
          {{ getFormattedDate(doc.dateModified ?? doc.datePublished) }}
        </span>
      </p>

      <ContentRenderer :value="doc" />
    </ContentDoc>
  </main>
</template>

<script setup lang="ts">
import { Post } from '~/types/blog.types'

const route = useRoute()
const { data: post } = await useAsyncData('post', queryContent<Post>(`/blog/${route.params.slug}`).findOne)

const datePublished = new Date(post.value?.datePublished ?? '').toISOString()
const dateModified = post.value?.dateModified ? new Date(post.value?.dateModified ?? '').toISOString() : null

useSchemaOrg([
  defineArticle({
    image: post.value?.image?.src,
    datePublished,
    ...(dateModified && { dateModified }),
    author: {
      name: 'Nirjan Khadka',
      url: 'https://nirjan.dev'
    },
    inLanguage: 'en-US'

  })
])
</script>

<style>
.blog-post h2 a, .blog-post h3 a {
  color: inherit;
}
</style>
