<template>
  <div>
    <page-title>
      Find the perfect Remote Developer Job for you
    </page-title>

    <!-- <page-description>
        <p class="mb-6">
          We'll help you find the best remote full stack developer jobs, junior developer jobs, remote programming jobs, remote front-end developer jobs, and more,  no matter where you are in the world.
        </p> <p>We offer an easy-to-use platform that allows you to filter job listings by location, experience level, and job role. Plus, with our customizable newsletter (coming soon), you'll be the first to know about new job opportunities that match your career goals.</p>
      </page-description> -->

    <div class="grid grid-cols-12">
      <main class=" col-span-12 md:col-start-4 md:col-end-10">
        <div class="mb-12">
          <h2 class="text-xl mb-4 font-bold">
            Filter Remote Dev Jobs
          </h2>
          <job-filters v-if="jobs" :default-values="defaultFilterValues" :jobs="jobs" @on-filter="updateJobFilters" />
        </div>

        <h2 class="text-xl mb-4 font-bold">
          All Remote Developer Jobs
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

        <n-pagination :page="page" class="mt-6 mb-6" :page-count="pageCount" @update-page="changePage">
          <!-- <template #prev>
            <NuxtLink :to="`/jobs/page/${page - 1}`">
              Prev
            </NuxtLink>
          </template>

          <template #next>
            <NuxtLink v-if="page < pageCount" :to="`/jobs/page/${page + 1}`">
              Next
            </NuxtLink>
          </template> -->
        </n-pagination>
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
  locations: (filters.value.locations as string)?.split(',') ?? [],
  tags: (filters.value.tags as string)?.split(',') ?? [],
  roles: (filters.value.roles as string)?.split(',') ?? [],
  experienceLevels: (filters.value.experienceLevels as string)?.split(',') ?? []
}))

const { data, pending, error } = await useFetch(() => `/api/jobs?page=${page.value}&limit=${jobsPerPage}&locations=${filters.value.locations}&tags=${filters.value.tags}&roles=${filters.value.roles}&experienceLevels=${filters.value.experienceLevels}`)

const pageCount = computed(() => Math.ceil((data.value?.count ?? 1) / jobsPerPage))
const jobs = computed(() => data.value?.jobs ?? [])

useServerSeoMeta({
  title: 'Remote Dev Jobs - Job Board to find software engineer, programming and full stack developer jobs',
  description: 'Remote Dev Jobs offers top-quality remote software engineering jobs, as well as junior developer and web developer roles. Explore our listings and find your perfect software engineer remote job today!.',
  ogTitle: 'Remote Dev Jobs - Job Board to find software engineer, programming and full stack developer jobs',
  ogDescription: 'Remote Dev Jobs offers top-quality remote software engineering jobs, as well as junior developer and web developer roles. Explore our listings and find your perfect software engineer remote job today!.'
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

      <style scoped>

      </style>
