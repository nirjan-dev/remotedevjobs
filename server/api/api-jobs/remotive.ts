export default defineEventHandler(async () => {
  const data = await (await fetch('https://remotive.io/api/remote-jobs?category=software-dev&limit=10'))

  const responseData = await data.json()

  return responseData.jobs
})
