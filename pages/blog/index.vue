<template>
  <main class="min-h-screen">
    <page-title>
      Guides and tips for your remote job search
    </page-title>

    <page-description>
      <p class="mb-6">
        Read our blog to learn more about remote developer jobs and how to find your next remote job faster.
      </p>
    </page-description>

    <ul v-if="posts" class="grid grid-cols-12">
      <li v-for="post in posts" :key="post._id" class="col-span-12 md:col-start-4 md:col-end-10">
        <nuxt-link :to="`${post._path}`" class="no-underline">
          <n-card :bordered="false">
            <template #cover>
              <img class="object-cover max-h-60" :src="post.image">
            </template>
            <h2>{{ post.title }}</h2>
            <n-tag round :bordered="false">
              {{ post.date }}
            </n-tag>
          </n-card>
        </nuxt-link>
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import type { MarkdownParsedContent } from '@nuxt/content/dist/runtime/types'

interface Post extends MarkdownParsedContent {
  image: string
  date: string
}
const { data: posts } = await useAsyncData('posts', () => queryContent<Post>('/blog').find())

</script>

<style scoped>

</style>
