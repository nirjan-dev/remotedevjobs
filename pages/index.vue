<template>
  <div>
    <h1 class="text-4xl font-black text-center py-6 mb-8">
      Find the perfect Remote Developer Job for you
    </h1>

    <div class="max-w-2xl mx-auto mb-12 text-base">
      <p class="mb-6">
        We'll help you find the best remote full stack developer jobs, junior developer jobs, remote programming jobs, remote front-end developer jobs, and more,  no matter where you are in the world.
      </p> <p>We offer an easy-to-use platform that allows you to filter job listings by location, experience level, and job role. Plus, with our customizable newsletter (coming soon), you'll be the first to know about new job opportunities that match your career goals.</p>
    </div>

    <div class="grid grid-cols-12">
      <main class=" col-span-12 md:col-start-4 md:col-end-10">
        <div class="mb-12">
          <h2 class="text-xl mb-4 font-bold">
            Filter Remote Dev Jobs
          </h2>
          <job-filters v-if="jobs" :jobs="jobs" @on-filter="updateFilteredJobs" />
        </div>

        <h2 class="text-xl mb-4 font-bold">
          Latest Remote Developer Jobs
        </h2>
        <ul>
          <li v-for="job in filteredJobs" :key="job.id" class="mb-8">
            <job-list-item :job="job" />
          </li>
        </ul>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">

// import { NSelect, NCard, NButton, NTag, NButtonGroup } from 'naive-ui'

const { data: jobs } = await useFetch('/api/jobs')
const filteredJobs = ref(jobs.value)

useServerSeoMeta({
  title: 'Remote Dev Jobs - Job Board to find software engineer, programming and full stack developer jobs',
  description: 'Remote Dev Jobs offers top-quality remote software engineering jobs, as well as junior developer and web developer roles. Explore our listings and find your perfect software engineer remote job today!.',
  ogTitle: 'Remote Dev Jobs - Job Board to find software engineer, programming and full stack developer jobs',
  ogDescription: 'Remote Dev Jobs offers top-quality remote software engineering jobs, as well as junior developer and web developer roles. Explore our listings and find your perfect software engineer remote job today!.'
})

const updateFilteredJobs = (newFilteredJobs: any[]) => {
  filteredJobs.value = newFilteredJobs
}

</script>

  <style scoped>

  </style>
