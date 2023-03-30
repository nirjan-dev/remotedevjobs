<template>
  <div>
    <h1 class="text-5xl font-black text-center py-6 mb-8">
      Remote Dev Jobs
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
          <n-select
            v-model:value="selectedLocations"
            multiple
            :options="locationOptions"
            placeholder="Filter by location"
            class="mb-4"
            filterable
          />

          <n-select
            v-model:value="selectedTag"
            placeholder="Filter by tag"
            class="mb-4"
            multiple
            filterable

            :options="tagOptions"
          />

          <n-select
            v-model:value="selectedRole"
            placeholder="Filter by role"
            class="mb-4"
            multiple
            filterable

            :options="roleOptions"
          />
        </div>

        <h2 class="text-xl mb-4 font-bold">
          Latest Remote Developer Jobs
        </h2>
        <ul>
          <li v-for="job in filteredJobs" :key="job.id" class="mb-8">
            <n-card>
              <template #header>
                <h2 class="text-2xl font-black">
                  {{ job.title }}
                </h2>
              </template>

              <span class="text-lg">{{ job.company.name }}</span>

              <template
                #header-extra
              >
                <span>{{ getFormattedDate(job.postedAt) }}</span>
              </template>

              <div class="my-2">
                <n-tag v-for="location in job.locations" :key="location.id" round class="mr-2 mb-1" size="small">
                  {{ location.name }}
                </n-tag>

                <n-tag v-if="job.Duration.name" round size="small" class="mr-2 mb-1">
                  {{ job.Duration.name }}
                </n-tag>

                <n-tag v-for="benefit in job.benefits" :key="benefit.id" class="mr-2 mb-1" round size="small">
                  {{ benefit.name }}
                </n-tag>
              </div>

              <n-tag v-if="job.salary" round size="small" type="success">
                <n-ellipsis style="max-width: 190px">
                  {{ job.salary }}
                </n-ellipsis>
              </n-tag>

              <template #action>
                <n-button-group>
                  <n-button
                    ref="noopener"
                    tag="a"
                    type="primary"
                    target="_blank"
                    :href="job.link"
                    size="large"
                    class="text-gray-900"
                  >
                    Apply
                  </n-button>
                  <button-link
                    type="info"
                    secondary
                    size="large"
                  >
                    <nuxt-link :to="`/jobs/${job.slug}`">
                      View Details
                    </nuxt-link>
                  </button-link>
                </n-button-group>
              </template>
            </n-card>
          </li>
        </ul>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">

// import { NSelect, NCard, NButton, NTag, NButtonGroup } from 'naive-ui'

const { data: jobs } = await useFetch('/api/jobs')
const selectedLocations = ref<string[]>([])
const selectedTag = ref<string[]>([])
const selectedRole = ref<string[]>([])

useServerSeoMeta({
  title: 'Remote Dev Jobs - Job Board to find software engineer, programming and full stack developer jobs',
  description: 'Remote Dev Jobs offers top-quality remote software engineering jobs, as well as junior developer and web developer roles. Explore our listings and find your perfect software engineer remote job today!.',
  ogTitle: 'Remote Dev Jobs - Job Board to find software engineer, programming and full stack developer jobs',
  ogDescription: 'Remote Dev Jobs offers top-quality remote software engineering jobs, as well as junior developer and web developer roles. Explore our listings and find your perfect software engineer remote job today!.'
})

const filteredJobs = computed(() => {
  let filteredJobs = jobs.value

  // Filter by location
  if (selectedLocations.value.length > 0) {
    filteredJobs = filteredJobs?.filter((job) => {
      const jobLocations = job.locations.map(location => location.name)

      return selectedLocations.value.some(location => jobLocations.includes(location))
    }) ?? []
  }

  // Filter by tag
  if (selectedTag.value.length > 0) {
    filteredJobs = filteredJobs?.filter((job) => {
      const jobTags = job.tags.map(tag => tag.name)

      return selectedTag.value.some(tag => jobTags.includes(tag))
    }) ?? []
  }

  // Filter by role
  if (selectedRole.value.length > 0) {
    filteredJobs = filteredJobs?.filter((job) => {
      const jobRole = job.Role.name

      return selectedRole.value.includes(jobRole)
    }) ?? []
  }

  return filteredJobs
})

const locations = jobs.value?.map(job => job.locations).flat().map(location => location.name).filter(name => name) ?? []

const uniqueLocations = [...new Set(locations)]

const locationOptions = uniqueLocations.map(location => ({
  label: location,
  value: location
}))

const tags = jobs.value?.map(job => job.tags).flat().map(tag => tag.name).filter(tag => tag) ?? []

const uniqueTags = [...new Set(tags)]

const tagOptions = uniqueTags.map(tag => ({
  label: tag,
  value: tag
}))

const roles = jobs.value?.map(job => job.Role.name).filter(role => role) ?? []
const uniqueRoles = [...new Set(roles)]
const roleOptions = uniqueRoles.map(role => ({
  label: role,
  value: role
}))

const getFormattedDate = (dateString: Date) => {
  const date = new Date(dateString)

  const formattedDate = date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  })

  return formattedDate
}

</script>

  <style scoped>

  </style>
