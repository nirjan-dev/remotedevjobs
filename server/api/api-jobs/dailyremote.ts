export default defineEventHandler(async () => {
  const jobs = (await $fetch('/api/scrappers/dailyremote')).jobs

  const jobsFromAPI = responseData.records.map(job => getAAPIJobFromDailyRemoteJob(job))

  return {
    success: true,
    jobs
  }
})

function getAAPIJobFromDailyRemoteJob (job:{
  jobTitle: string
  companyName: string
  companyLogo: string
  location: string
  description: string
  applyLink: string
  salary: string
}) {
  return job
}
