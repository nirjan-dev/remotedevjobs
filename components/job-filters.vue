<template>
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

    <n-select
      v-model:value="selectedExperienceLevel"
      placeholder="Filter by experience level"
      class="mb-4"
      multiple
      filterable
      :options="experienceLevelOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  jobs: any[]
}>()

const emit = defineEmits(['on-filter'])

const selectedLocations = ref<string[]>([])
const selectedTag = ref<string[]>([])
const selectedRole = ref<string[]>([])
const selectedExperienceLevel = ref<string[]>([])

const locations = props.jobs.map(job => job.locations).flat().map(location => location.name).filter(name => name) ?? []

const uniqueLocations = [...new Set(locations)]

const locationOptions = uniqueLocations.map(location => ({
  label: location,
  value: location
}))

const tags = props.jobs?.map(job => job.tags).flat().map(tag => tag.name).filter(tag => tag) ?? []

const uniqueTags = [...new Set(tags)]

const tagOptions = uniqueTags.map(tag => ({
  label: tag,
  value: tag
}))

const roles = props.jobs?.map(job => job.Role.name).filter(role => role) ?? []
const uniqueRoles = [...new Set(roles)]
const roleOptions = uniqueRoles.map(role => ({
  label: role,
  value: role
}))

const experienceLevels = props.jobs?.map(job => job.ExperienceLevel.name).filter(experienceLevel => experienceLevel) ?? []

const uniqueExperienceLevels = [...new Set(experienceLevels)]

const experienceLevelOptions = uniqueExperienceLevels.map(experienceLevel => ({
  label: experienceLevel,
  value: experienceLevel
}))

const updateFilteredJobs = () => {
  // let filteredJobs = props.jobs

  // // Filter by location
  // if (selectedLocations.value.length > 0) {
  //   filteredJobs = filteredJobs?.filter((job) => {
  //     const jobLocations = job.locations.map(location => location.name)

  //     return selectedLocations.value.some(location => jobLocations.includes(location))
  //   }) ?? []
  // }

  // // Filter by tag
  // if (selectedTag.value.length > 0) {
  //   filteredJobs = filteredJobs?.filter((job) => {
  //     const jobTags = job.tags.map(tag => tag.name)

  //     return selectedTag.value.some(tag => jobTags.includes(tag))
  //   }) ?? []
  // }

  // // Filter by role
  // if (selectedRole.value.length > 0) {
  //   filteredJobs = filteredJobs?.filter((job) => {
  //     const jobRole = job.Role.name

  //     return selectedRole.value.includes(jobRole)
  //   }) ?? []
  // }

  // // Filter by experience level
  // if (selectedExperienceLevel.value.length > 0) {
  //   filteredJobs = filteredJobs?.filter((job) => {
  //     const jobExperienceLevel = job.ExperienceLevel.name

  //     return selectedExperienceLevel.value.includes(jobExperienceLevel)
  //   }) ?? []
  // }

  let filters = {}

  if (selectedLocations.value.length > 0) {
    filters = {
      ...filters,
      locations: selectedLocations.value.join(',')
    }
  }

  if (selectedTag.value.length > 0) {
    filters = {
      ...filters,
      tags: selectedTag.value.join(',')
    }
  }

  if (selectedRole.value.length > 0) {
    filters = {
      ...filters,
      roles: selectedRole.value.join(',')
    }
  }

  if (selectedExperienceLevel.value.length > 0) {
    filters = {
      ...filters,
      experienceLevels: selectedExperienceLevel.value.join(',')
    }
  }

  emit('on-filter', filters)

  return filters
}

watch([selectedLocations, selectedTag, selectedRole, selectedExperienceLevel], () => {
  updateFilteredJobs()
})

</script>

<style scoped>

</style>
