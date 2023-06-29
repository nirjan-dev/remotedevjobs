<template>
  <div>
    <page-title>
      Find Remote Developer Jobs with a 4 day work week
    </page-title>

    <page-description>
      <p class="mb-6">
        Looking for 4-day work week jobs? Our job board offers a comprehensive list of companies across various industries, including tech, that offer flexibility to maintain a healthy work-life relationship. Browse our selection of 4-day work week tech jobs that cater to your interests and preferences.
      </p> <p>Our user-friendly interface and advanced search options make it easy to filter jobs based on your preferred location, experience level, and more. Start your journey towards a healthier work-life balance today by exploring our list of 4-day work week jobs!</p>
    </page-description>

    <div class="grid grid-cols-12">
      <main class="col-span-12 md:col-start-4 md:col-end-10">
        <div class="mb-12">
          <h2 class="mb-4 text-xl font-bold">
            Filter 4 day work week Jobs
          </h2>
          <job-filters v-if="jobs" :default-values="defaultFilterValues" :jobs="jobs" @on-filter="updateJobFilters" />
        </div>

        <h2 class="mb-4 text-xl font-bold">
          All 4 day work week Jobs
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

        <p v-if="!error && !pending && jobs.length === 0">
          No Jobs Found
        </p>

        <n-pagination :page="page" class="mt-6 mb-6" :page-count="pageCount" @update-page="changePage" />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">

const route = useRoute()
const router = useRouter()

const page = ref(Number(route.query.page) || 1)
const jobsPerPage = 50

const filters = computed(() => route.query || {})
const defaultFilterValues = computed(() => ({
  tags: (filters.value.tags as string)?.split(',') ?? [],
  roles: (filters.value.roles as string)?.split(',') ?? [],
  experienceLevels: (filters.value.experienceLevels as string)?.split(',') ?? []
}))

const { data, pending, error } = await useFetch(() => `/api/jobs?page=${page.value}&limit=${jobsPerPage}&locations=${filters.value.locations}&tags=${filters.value.tags}&roles=${filters.value.roles}&experienceLevels=${filters.value.experienceLevels}&benefits=4 day work week`)

const pageCount = computed(() => Math.ceil((data.value?.count ?? 1) / jobsPerPage))
const jobs = computed(() => data.value?.jobs ?? [])

useServerSeoMeta({
  title: '4 Day Work Week Jobs for Software Engineers | Remote Tech Jobs',
  description: 'Find 4-day work week jobs and companies offering flexibility for a healthy work-life balance. Discover the perfect job for you.',
  ogTitle: 'Worldwide Remote Jobs - Work from Anywhere | Remote Developer Jobs',
  ogDescription: 'Discover 4-day work week jobs and companies offering flexibility for a healthy work-life balance. Browse our list of 4-day work week tech jobs across various industries, and find the perfect fit for you. Start your journey towards a healthier work-life balance today!'
})

const updateJobFilters = async (updatedFilters: {
      locations? : string
      tags? : string
      roles? : string
      experienceLevels? : string
    }) => {
  // add filters to query
  await router.push({
    query: {
      ...updatedFilters
    }
  })
}

const changePage = async (newPage: number) => {
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0)
  }

  page.value = newPage
  await router.push({ query: { ...filters.value, page: newPage } })
}

</script>

  <style scoped></style>
