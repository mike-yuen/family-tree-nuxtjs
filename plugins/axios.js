const BASE_API_URL = process.env.VUE_APP_BASE_API_URL

export default function({ $axios, redirect }, inject) {
  // Create a custom axios instance
  const fTAxios = $axios.create({
    baseURL: BASE_API_URL
  })
  fTAxios.interceptors.request.use((config) => {
    let TOKEN = null
    if (process.browser) {
      TOKEN = localStorage.getItem('authFamilyTree')
    }
    if (TOKEN) {
      config.headers.Authorization = 'Bearer ' + TOKEN
    }
    return config
  })
  fTAxios.onError((error) => {
    return error.response
  })
  inject('fTAxios', fTAxios)
}
