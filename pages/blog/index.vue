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
              <img :height="post.image.height" :width="post.image.width" class="object-cover max-h-60" :src="post.image.src" :alt="post.image.alt">
            </template>
            <h2>{{ post.title }}</h2>
            <n-tag round :bordered="false">
              {{ getFormattedDate(post.dateModified ?? post.datePublished) }}
            </n-tag>
          </n-card>
        </nuxt-link>
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { Post } from '~/types/blog.types'

const { data: posts } = await useAsyncData('posts', () => queryContent<Post>('/blog').find())

const title = 'Remote Dev Jobs Blog - Guides & tips for your remote job search'
const description = "Our blog offers expert advice and practical tips on how to get a remote dev job. From building a strong portfolio to mastering job interviews, we'll help you land your dream job and thrive in a remote work environment. Start your journey towards a fulfilling remote dev career today"
useServerSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

</script>

<style scoped>

</style>
