<template>
  <div>
    <page-title>
      Browse and Filter through all our remote developer job posts
    </page-title>

    <page-description>
      <p class="mb-6">
        Explore hundreds of recent job posts across various industries and experience levels on our job board. Filter by location, tag, role, and experience level to find only the types of jobs you want.
      </p> <p>Stay up-to-date with the latest job openings by subscribing to our newsletter and receiving weekly job alerts straight to your inbox. Start your journey towards your dream job today!</p>
    </page-description>

    <div class="grid grid-cols-12">
      <main class="col-span-12 md:col-start-4 md:col-end-10">
        <div class="mb-12">
          <h2 class="mb-4 text-xl font-bold">
            Filter Remote Dev Jobs
          </h2>
          <job-filters v-if="jobs" :default-values="defaultFilterValues" :jobs="jobs" @on-filter="updateJobFilters" />
        </div>

        <h2 class="mb-4 text-xl font-bold">
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
  title: 'Remote Dev Jobs - Job Board to find tech jobs, programming and full stack developer jobs',
  description: 'Explore top-quality remote software engineering jobs, as well as junior developer and web developer roles. Explore our listings and find your perfect software engineer remote job today!.',
  ogTitle: 'Remote Dev Jobs - Job Board to find software engineer, programming and full stack developer jobs',
  ogDescription: 'Remote Dev Jobs offers top-quality remote software engineering jobs, as well as junior developer and web developer roles. Explore our listings and find your perfect software engineer remote job today!.'
})

useSchemaOrg([
  ...jobs.value.map((job) => {
    return defineJobPosting({
      // baseSalary: job.salary,
      // datePosted: job.postedAt,
      // jobLocation: job.locations.map(location => location.name).join(', '),
      // title: job.title,
      // directApply: job.link,
      // employmentType: job.type,
      // hiringOrganization: job.company.name
      title: job.title,
      datePosted: job.postedAt,
      hiringOrganization: {
        name: job.company.name,
        url: undefined
      }
    })
  })
])

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
