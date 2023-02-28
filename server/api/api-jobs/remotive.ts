import { Company } from '@prisma/client'
import { jobWithLinkedData, RemotiveJob } from '~~/server/api/api-jobs/JobsFromAPIs.type'

export default defineEventHandler(async () => {
  const data = await (await fetch('https://remotive.io/api/remote-jobs?category=software-dev&limit=1'))

  const responseData: {jobs: RemotiveJob[]} = await data.json()

  const jobsWithLinkedData = getJobsWithLinkedDataFromRemotiveJob(responseData.jobs)
  return jobsWithLinkedData
})

const getJobsWithLinkedDataFromRemotiveJob = (jobs: RemotiveJob[]) => {
  // const jobsWithLinkedData: jobWithLinkedData[] = jobs.map(job => {
  //   // create all the linked data
  //   const company: Company = {
  //     name: job.company_name,

  //   // return the job with all the linked data

  // })

  return jobs
}
