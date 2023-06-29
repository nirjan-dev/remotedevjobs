<template>
  <div>
    <page-title>
      Find Remote Developer Jobs where you can work from anywhere
    </page-title>

    <page-description>
      <p class="mb-6">
        Looking for remote jobs that allow you to work from anywhere in the world? Our job board offers a comprehensive list of worldwide remote jobs that cater to individuals looking for flexibility and work-life balance. From entry-level to senior positions, we have something for everyone.
      </p> <p>Our user-friendly interface and advanced search options make it easy to filter jobs based on your preferred experience level, location, technology stack, and more.</p>
    </page-description>

    <div class="grid grid-cols-12">
      <main class="col-span-12 md:col-start-4 md:col-end-10">
        <div class="mb-12">
          <h2 class="mb-4 text-xl font-bold">
            Filter Global Remote Jobs
          </h2>
          <job-filters v-if="jobs" disable-location-filter :default-values="defaultFilterValues" :jobs="jobs" @on-filter="updateJobFilters" />
        </div>

        <h2 class="mb-4 text-xl font-bold">
          All Global Developer Jobs
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

const { data, pending, error } = await useFetch(() => `/api/jobs?page=${page.value}&limit=${jobsPerPage}&locations=Worldwide&tags=${filters.value.tags}&roles=${filters.value.roles}&experienceLevels=${filters.value.experienceLevels}`)

const pageCount = computed(() => Math.ceil((data.value?.count ?? 1) / jobsPerPage))
const jobs = computed(() => data.value?.jobs ?? [])

useServerSeoMeta({
  title: 'Remote Developer Jobs Worldwide - Work from Anywhere in the world',
  description: 'Find remote jobs worldwide and work from anywhere in the globe. Browse opportunities of different experience levels, technology stacks, and job roles.',
  ogTitle: 'Worldwide Remote Jobs - Work from Anywhere | Remote Developer Jobs',
  ogDescription: 'Find remote jobs worldwide and work from anywhere with our comprehensive list of remote developer jobs. Browse opportunities of different experience levels, technology stacks, and job roles. Start your journey towards a more flexible and fulfilling work-life today!'
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
