export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiUrl: process.env.VUE_APP_BASE_API_URL!,
    },
  },
  // mode: 'universal',
  // /*
  //  ** Headers of the page
  //  */
  // head: {
  //   title: process.env.npm_package_name || '',
  //   meta: [
  //     { charset: 'utf-8' },
  //     { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  //     {
  //       hid: 'description',
  //       name: 'description',
  //       content: process.env.npm_package_description || '',
  //     },
  //   ],
  //   link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  // },
  // /*
  //  ** Customize the progress-bar color
  //  */
  // loading: { color: '#fff' },
  // /*
  //  ** Global CSS
  //  */
  // css: ['~assets/css/main.scss'],
  // plugins: [
  //   { src: '~/plugins/axios.js' },
  //   { src: '~/plugins/vee-validation.js', ssr: false },
  //   { src: '~/plugins/datepicker', ssr: false },
  //   '~/plugins/vue-moment.js',
  // ],
  // modules: [
  //   '@nuxtjs/axios',
  //   '@nuxtjs/dotenv',
  //   '@nuxtjs/eslint-module',
  //   'bootstrap-vue/nuxt',
  // ],
  // bootstrapVue: {
  //   icons: true, // Install the IconsPlugin
  // },
  // axios: {},
  // /*
  //  ** Build configuration
  //  */
  // build: {
  //   postcss: {
  //     plugins: {
  //       autoprefixer: require('autoprefixer'),
  //     },
  //   },
  // },
})
