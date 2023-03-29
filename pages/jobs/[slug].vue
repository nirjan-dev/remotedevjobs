<template>
  <div v-if="job" class="py-6">
    <h1 class="text-6xl">
      {{ job?.title }}
    </h1>

    <p class="text-lg my-4">
      {{ job.company.name }}
    </p>

    <div class="my-2">
      <div class="mb-4">
        <n-tag v-for="location in job.locations" :key="location.id" round class="mr-2" size="small">
          {{ location.name }}
        </n-tag>
        <n-tag v-if="job.Duration.name" round size="small" class="mr-2">
          {{ job.Duration.name }}
        </n-tag>
        <n-tag v-for="benefit in job.benefits" :key="benefit.id" round size="small">
          {{ benefit.name }}
        </n-tag>
      </div>

      <n-tag v-if="job.salary" round size="small" type="success">
        {{ job.salary }}
      </n-tag>
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
        >
          Apply
        </n-button>

        <button-link
          type="info"
          secondary
          size="large"
        >
          <nuxt-link :to="`/`">
            Back to All Jobs
          </nuxt-link>
        </button-link>
      </n-button-group>
    </div>

    <div v-if="job.description" class="job-description py-8 max-w-2xl" v-html="job.description" />

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
        >
          Apply
        </n-button>

        <button-link
          type="info"
          secondary
          size="large"
        >
          <nuxt-link :to="`/`">
            Back to All Jobs
          </nuxt-link>
        </button-link>
      </n-button-group>
    </div>
  </div>

  <div v-else>
    <p>Sorry, No Job found</p>
  </div>
</template>

<script setup lang="ts">
const { params } = useRoute()
const { data: job } = await useFetch(
  `/api/jobs/${params.slug}`
)

</script>

<style  scoped>
.job-description {
  @apply text-base leading-normal;
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
