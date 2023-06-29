<template>
  <div>
    <page-title>
      Find the perfect Remote Developer Job for you
    </page-title>

    <page-description>
      <p class="mb-6">
        We'll help you find the best remote full stack developer jobs, junior developer jobs, remote programming jobs, remote front-end developer jobs, and more,  no matter where you are in the world.
      </p> <p>We offer an easy-to-use platform that allows you to filter job listings by location, experience level, and job role. Plus, with our customizable newsletter (coming soon), you'll be the first to know about new job opportunities that match your career goals.</p>
    </page-description>

    <div class="grid grid-cols-12">
      <main class="col-span-12 md:col-start-4 md:col-end-10">
        <h2 class="flex flex-wrap justify-between mb-4 text-xl font-bold">
          Latest Remote Developer Jobs

          <nuxt-link to="/jobs" class="text-blue-500">
            View all {{ count }} jobs
          </nuxt-link>
        </h2>
        <p v-if="pending && !error">
          <job-skeleton :number="jobsPerPage" />
        </p>

        <ul v-if="!pending && !error">
          <li v-for="job in jobs" :key="job.id" class="mb-8">
            <job-list-item :job="job" />
          </li>
        </ul>

        <p v-if="error">
          Error loading job posts
        </p>

        <nuxt-link to="/jobs" class="inline-block mb-6 text-lg text-blue-500 underline">
          Browse and filter through all {{ count }} jobs
        </nuxt-link>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">

// import { NSelect, NCard, NButton, NTag, NButtonGroup } from 'naive-ui'
const route = useRoute()

const page = ref(Number(route.query.page) || 1)
const jobsPerPage = 4

const { data, pending, error } = await useFetch(() => `/api/jobs?page=${page.value}&limit=${jobsPerPage}`)
const jobs = data.value?.jobs ?? []
const count = data.value?.count ?? 1

useServerSeoMeta({
  title: 'Remote Dev Jobs - Find remote software engineer and programming jobs',
  description: 'Remote Dev Jobs offers quality remote software engineering jobs and web developer roles. Find your perfect software engineer remote job.',
  ogTitle: 'Remote Dev Jobs - Job Board to find software engineer, programming and full stack developer jobs',
  ogDescription: 'Remote Dev Jobs offers top-quality remote software engineering jobs, as well as junior developer and web developer roles. Explore our listings and find your perfect software engineer remote job today!.'
})

</script>

  <style scoped>

  </style>
