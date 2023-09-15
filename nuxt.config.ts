export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiUrl: process.env.VUE_APP_BASE_API_URL!,
    },
  },
  // mode: 'universal',
  // /*
  //  ** Customize the progress-bar color
  //  */
  // loading: { color: '#fff' },
  // /*
  //  ** Global CSS
  //  */
  // css: ['~assets/css/main.scss'],
  // plugins: [
  //   { src: '~/plugins/vee-validation.js', ssr: false },
  //   { src: '~/plugins/datepicker', ssr: false },
  //   '~/plugins/vue-moment.js',
  // ],
  // modules: [
  //   '@nuxtjs/dotenv',
  //   '@nuxtjs/eslint-module',
  //   'bootstrap-vue/nuxt',
  // ],
  // bootstrapVue: {
  //   icons: true, // Install the IconsPlugin
  // },
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
