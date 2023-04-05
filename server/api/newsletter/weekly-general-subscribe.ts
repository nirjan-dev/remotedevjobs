import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const API_KEY = useRuntimeConfig().convertkit_api_key
  const BASE_URL = 'https://api.convertkit.com/v3'

  const body = await readBody(event)

  const url = [BASE_URL, 'forms', body.formId, 'subscribe'].join('/')

  const requestBody = JSON.stringify({
    api_key: API_KEY,
    email: body.email,
    first_name: body.firstName
  })

  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8'
  })

  return fetch(url, {
    method: 'POST',
    headers,
    body: requestBody
  })
})
