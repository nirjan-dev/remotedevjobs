<template>
  <div>
    <h1 class="text-6xl font-black text-center py-6 mb-12">
      Remote Developer Jobs
    </h1>

    <!-- <div class="grid  md:gap-12 gap-4 grid-cols-12">
      <main class="md:col-span-8 col-span-12">
        <div>
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

        <ul>
          <li v-for="job in filteredJobs" :key="job.id" class="mb-8">
            <n-card>
              <template #header>
                <h2 class="text-2xl font-bold">
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
                    type="success"
                    target="_blank"
                    :href="job.link"
                    size="large"
                  >
                    Apply
                  </n-button>
                  <n-button type="info" secondary size="large" @click="$event => useRouter().push(`/jobs/${job.slug}`)">
                    View Details
                  </n-button>
                </n-button-group>
              </template>
            </n-card>
          </li>
        </ul>
      </main>
      <aside class="md:col-span-4 col-span-12">
        <div class="w-full h-64 bg-gray-400" />
      </aside>
    </div> -->

    <div class="grid grid-cols-12">
      <main class=" col-span-12 md:col-start-4 md:col-end-10">
        <div>
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

        <ul>
          <li v-for="job in filteredJobs" :key="job.id" class="mb-8">
            <n-card>
              <template #header>
                <h2 class="text-2xl font-bold">
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
                    type="success"
                    target="_blank"
                    :href="job.link"
                    size="large"
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

import { NSelect } from 'naive-ui'

const { data: jobs } = await useFetch('/api/jobs')
const selectedLocations = ref<string[]>([])
const selectedTag = ref<string[]>([])
const selectedRole = ref<string[]>([])

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
