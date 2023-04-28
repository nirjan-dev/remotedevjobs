<template>
  <div>
    <n-select
      v-if="!props.disableLocationFilter"
      v-model:value="selectedLocations"
      multiple
      :options="locationOptions"
      placeholder="Filter by location"
      class="mb-4"
      filterable
      :loading="locationOptionsLoading"
    />

    <n-select
      v-model:value="selectedTag"
      placeholder="Filter by tag"
      class="mb-4"
      multiple
      filterable
      :options="tagOptions"
      :loading="tagOptionsLoading"
    />

    <n-select
      v-model:value="selectedRole"
      placeholder="Filter by role"
      class="mb-4"
      multiple
      filterable
      :options="roleOptions"
      :loading="roleOptionsLoading"
    />

    <n-select
      v-model:value="selectedExperienceLevel"
      placeholder="Filter by experience level"
      class="mb-4"
      multiple
      filterable
      :options="experienceLevelOptions"
      :loading="experienceLevelOptionsLoading"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const emit = defineEmits(['on-filter'])
const props = defineProps<{
  defaultValues: {
    locations?: string[],
    tags?: string[],
    roles?: string[],
    experienceLevels?: string[]
  },
  disableLocationFilter?: boolean,
}>()
const selectedLocations = ref<string[]>(props.defaultValues?.locations ?? [])
const selectedTag = ref<string[]>(props.defaultValues?.tags ?? [])
const selectedRole = ref<string[]>(props.defaultValues?.roles ?? [])
const selectedExperienceLevel = ref<string[]>(props.defaultValues?.experienceLevels ?? [])

const { data: locations, pending: locationOptionsLoading } = useLazyFetch(() => '/api/locations')
const locationOptions = computed(() => {
  return locations.value?.map(location => ({
    label: location.name,
    value: location.name
  })) ?? []
})

const { data: tags, pending: tagOptionsLoading } = useLazyFetch(() => '/api/tags')
const tagOptions = computed(() => {
  return tags.value?.map(tag => ({
    label: tag.name,
    value: tag.name
  })) ?? []
})

const { data: roles, pending: roleOptionsLoading } = useLazyFetch(() => '/api/roles')
const roleOptions = computed(() => {
  return roles.value?.map(role => ({
    label: role.name,
    value: role.name
  })) ?? []
})

const { data: experienceLevels, pending: experienceLevelOptionsLoading } = useLazyFetch(() => '/api/experience-levels')
const experienceLevelOptions = computed(() => {
  return experienceLevels.value?.map(experienceLevel => ({
    label: experienceLevel.name,
    value: experienceLevel.name
  })) ?? []
})

const updateFilteredJobs = () => {
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
