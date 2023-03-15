<template>
  <div>
    <h1 class="text-6xl font-black text-center py-6 mb-12">
      Remote Developer Jobs
    </h1>

    <div class="grid md:grid-cols-12 gap-12">
      <main class="md:col-span-8">
        <ul>
          <li v-for="job in jobs" :key="job.id" class="mb-8">
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
      <aside class="md:col-span-4">
        <div class="w-full h-64 bg-gray-400" />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">

const { data: jobs } = useFetch('/api/jobs')

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
