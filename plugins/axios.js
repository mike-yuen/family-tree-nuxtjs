const BASE_API_URL = process.env.VUE_APP_BASE_API_URL
let TOKEN = null
if (process.browser) {
  TOKEN = localStorage.getItem('authFamilyTree')
}

export default function({ $axios, redirect }, inject) {
  // Create a custom axios instance
  const fTAxios = $axios.create({
    baseURL: BASE_API_URL,
    headers: {
      Authorization: `Bearer ${TOKEN}`
    }
  })
  fTAxios.onRequest((config) => {
    console.log('Making request to ' + config.url)
  })
  fTAxios.onError((error) => {
    return error.response
  })
  inject('fTAxios', fTAxios)
}
