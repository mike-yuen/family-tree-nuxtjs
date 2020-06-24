import Vue from 'vue'
import axios from 'axios'

const BASE_API_URL = process.env.VUE_APP_BASE_API_URL
const fTAxios = axios.create({
  baseURL: BASE_API_URL
})

fTAxios.interceptors.request.use(
  function(response) {
    // let apiToken = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : null
    // if (apiToken) {
    //     config.headers.Authorization = 'Bearer ' + apiToken
    // }
    return response
  },
  function(error) {
    return Promise.reject(error)
  }
)

fTAxios.interceptors.response.use(
  function(response) {
    return response
  },
  function(error) {
    return Promise.reject(error)
  }
)

Vue.use(fTAxios)
