<template>
  <n-card :bordered="false">
    <template #header>
      <h2 class="text-2xl font-black">
        {{ job.title }}
      </h2>
    </template>

    <span class="text-lg font-bold">{{ job.company.name }}</span>

    <template
      #header-extra
    >
      <span class="text-xs">{{ getFormattedDate(job.postedAt) }}</span>
    </template>

    <div class="my-2 opacity-70">
      <n-tag v-for="location in job.locations.slice(0,5)" :key="location.id" round class="mb-1 mr-2" size="small">
        {{ location.name }}
      </n-tag>

      <n-tooltip v-if="job.locations.length > 5" placement="bottom" trigger="click">
        <template #trigger>
          <n-tag round class="mb-1 mr-2 cursor-pointer" size="small">
            +{{ job.locations.length - 5 }} locations
          </n-tag>
        </template>

        <div class="flex flex-wrap max-w-xs">
          <n-tag v-for="location in job.locations.slice(5)" :key="location.id" round class="mb-1 mr-2" size="small">
            {{ location.name }}
          </n-tag>
        </div>
      </n-tooltip>

      <n-tag v-if="job.Duration.name" round size="small" class="mb-1 mr-2">
        {{ job.Duration.name }}
      </n-tag>

      <n-tag v-for="benefit in job.benefits" :key="benefit.id" class="mb-1 mr-2" round size="small">
        {{ benefit.name }}
      </n-tag>
    </div>

    <n-tag v-if="job.salary" round size="small" :bordered="false" type="success">
      <template #icon>
        <n-icon :component="AttachMoneyFilled" />
      </template>
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
</template>

<script setup lang="ts">
import { AttachMoneyFilled } from '@vicons/material'
defineProps<{
  job: {
    title: string
    slug: string
    link: string
    postedAt: string
    salary: string
    company: {
      id: string
      name: string
    }
    locations: {
      id: string
      name: string
    }[]
    benefits: {
      id: string
      name: string
    }[]
    Duration: {
      id: string
      name: string
    }
  }
}>()

const getFormattedDate = (dateString: string) => {
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
