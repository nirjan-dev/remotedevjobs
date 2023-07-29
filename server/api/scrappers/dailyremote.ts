import { defineEventHandler } from "h3"
import * as cheerio from 'cheerio';

export default defineEventHandler(async (event) => {

  const listPage = await fetch(`https://dailyremote.com/remote-software-development-jobs?location=worldwide&page=1&employmentType=full-time`)

  const listPageData = await listPage.text()


  const $ = cheerio.load(listPageData)

  const jobs = $('.listing-container article')

  const recentJobs = jobs.slice(0, 16)


  const jobWithDetails = await Promise.all(recentJobs.map(async (index, element) => {

    const link = $(element).find('a').attr('href')

    const fullLink = `https://dailyremote.com${link}`
    const jobPage = await fetch(fullLink)

    const jobPageData = await jobPage.text()

    const $$ = cheerio.load(jobPageData)

    const jobDetails = $$('.detailed-job')

    const jobTitle = jobDetails.find('h1').text()
    const companyName = jobDetails.find('.company-name a').text().trim()
    const companyLogo = `https://dailyremote.com${jobDetails.find('.company-info-block img').attr('src')}`
    const location = 'Worldwide'
    const description = jobDetails.find('.detailed-job-body').html()?.trim()
    const salary = jobDetails.find('.job-info .meta-holder:nth-of-type(3)').text().trim()


    const job = {
      jobTitle,
      companyName,
      companyLogo,
      location,
      description,
      applyLink: fullLink,
      salary
    }

    return job

  }))

  return {
    jobs:jobWithDetails
  }
})
