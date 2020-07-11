const BASE_API_URL = process.env.VUE_APP_BASE_API_URL

export default function({ $axios, redirect }, inject) {
  // Create a custom axios instance
  const fTAxios = $axios.create({
    baseURL: BASE_API_URL
  })
  fTAxios.onRequest((config) => {
    console.log('Making request to ' + config.url)
  })
  fTAxios.onError((error) => {
    return error.response
  })
  inject('fTAxios', fTAxios)
}
