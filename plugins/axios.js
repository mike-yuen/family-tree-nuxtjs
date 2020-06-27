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
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/400')
    }
  })
  inject('fTAxios', fTAxios)
}
