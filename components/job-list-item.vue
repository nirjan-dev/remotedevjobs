<template>
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
</template>

<script setup lang="ts">

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
