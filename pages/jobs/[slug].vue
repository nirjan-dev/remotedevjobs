<template>
  <div v-if="job" class="grid grid-cols-12 py-6">
    <main class="col-span-12 md:col-start-4 md:col-end-10">
      <h1 class="text-2xl md:text-6xl">
        {{ job?.title }}
      </h1>
      <p class="my-4 text-lg">
        {{ job.company?.name }}
      </p>
      <div class="my-2">
        <div class="mb-4">
          <n-tag v-for="location in job.locations" :key="location.id" round class="mr-2" size="small">
            {{ location.name }}
          </n-tag>
          <n-tag v-if="job.Duration?.name" round size="small" class="mr-2">
            {{ job.Duration?.name }}
          </n-tag>
          <n-tag v-for="benefit in job.benefits" :key="benefit.id" class="mr-2" round size="small">
            {{ benefit.name }}
          </n-tag>
        </div>
        <n-tag v-if="job.salary" round size="small" type="success">
          {{ job.salary }}
        </n-tag>
      </div>
      <div>
        <p>Posted on {{ getFormattedDate(job.postedAt) }}</p>
      </div>
      <div class="my-4">
        <n-button-group>
          <n-button
            ref="noopener"
            target="_blank"
            :href="job.link"
            tag="a"
            type="success"
            size="large"
            class="text-gray-900"
            @click="useTrackEvent('apply_job', { job_title: job.title, job_link: job.link })"
          >
            Apply
          </n-button>
          <button-link
            type="info"
            secondary
            size="large"
          >
            <nuxt-link :to="`/jobs`">
              Back to All Jobs
            </nuxt-link>
          </button-link>
        </n-button-group>
      </div>
      <div v-if="job.description" class="max-w-2xl py-8 job-description" v-html="job.description" />
      <div class="my-4">
        <n-button-group>
          <n-button
            ref="noopener"
            target="_blank"
            :href="job.link"
            tag="a"
            type="success"
            size="large"
            class="text-gray-900"
            @click="useTrackEvent('apply_job', { job_title: job.title, job_link: job.link })"
          >
            Apply
          </n-button>
          <button-link
            type="info"
            secondary
            size="large"
          >
            <nuxt-link :to="`/jobs`">
              Back to All Jobs
            </nuxt-link>
          </button-link>
        </n-button-group>
      </div>
    </main>
    <aside class="col-span-12 mt-6 lg:mt-12 md:col-start-4 md:col-end-10">
      <template v-if="job.similarJobs && job.similarJobs.length > 0">
        <h2>Similar Jobs</h2>
        <ul>
          <li v-for="similarJob in job.similarJobs" :key="similarJob.id" class="mb-8">
            <job-list-item :job="similarJob" />
          </li>
        </ul>
        <button-link
          type="info"
          secondary
          size="large"
        >
          <nuxt-link :to="`/jobs`">
            View All Jobs
          </nuxt-link>
        </button-link>
      </template>

      <h2 class="mt-6 lg:mt-12">
        Resources to find remote jobs
      </h2>
      <ul v-if="posts" class="grid">
        <li v-for="post in posts" :key="post._id" class="col-span-12 mb-6 md:col-start-4 md:col-end-10">
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
    </aside>
  </div>

  <div v-else>
    <p>Sorry, No Job found</p>
  </div>
</template>

<script setup lang="ts">
import { Post } from '~/types/blog.types'

const { params } = useRoute()

const { data } = await useAsyncData('job-details-page', () => {
  return Promise.all([
    $fetch(
    `/api/jobs/${params.slug}`
    ),
    queryContent<Post>('/blog').find()
  ])
})

if (!data.value || !data.value[0] || (typeof data.value[0] !== 'object' || Array.isArray(data.value[0]))) {
  throw createError({ statusCode: 404, statusMessage: 'Job not found' })
}

const job = data.value[0]
const posts = data.value[1] ?? []

const title = `${job.title} Job at ${job.company?.name} | Remote Dev Jobs`
const description = `${job.company?.name} is hiring a ${job.title}. Apply to this remote role with Remote Dev Jobs`

useServerSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

useSchemaOrg([
  defineJobPosting({
    title: job.title,
    description: job.description,
    hiringOrganization: {
      name: job.company?.name ?? ''
    },
    datePosted: job.postedAt

  })
])

</script>

<style  scoped>
.job-description {
  @apply text-base leading-normal px-4;
}

.job-description ::v-deep(p) {
  @apply mb-4;
}

.job-description ::v-deep(ul) {
  @apply list-disc ;
}

.job-description  ::v-deep(h2), .job-description  ::v-deep(.h2) {
  @apply text-2xl font-bold;
}

.job-description ::v-deep(h3), .job-description  ::v-deep(.h3) {
  @apply text-xl font-bold;
}

.job-description ::v-deep(h4), .job-description  ::v-deep(.h4) {
  @apply text-lg font-bold;
}

.job-description ::v-deep(h5), .job-description  ::v-deep(.h5) {
  @apply text-base font-bold;
}
</style>
