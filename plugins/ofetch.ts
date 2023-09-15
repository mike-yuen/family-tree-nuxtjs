import { ofetch } from 'ofetch'

export default defineNuxtPlugin((_nuxtApp) => {
  const config = useRuntimeConfig()

  globalThis.$fetch = ofetch.create({
    baseURL: config.public.apiUrl as string,
    onRequest({ options }) {
      let token = process.browser
        ? localStorage.getItem('authFamilyTree')
        : null

      if (token) {
        options.headers = { Authorization: `Bearer ${token}` }
      } else {
        console.log('Not authenticated')
      }
    },
    onRequestError({ error }) {
      console.error(error)
    },
  })
})
