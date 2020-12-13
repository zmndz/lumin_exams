import userAuth from "./middleware/userAuth";

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'سیستم امتحانات متمرکز لومین',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '@/assets/scss/style.scss'

  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '@/plugins/interceptor', mode: 'client' },
    { src: '@/plugins/vue-jalali-moment' },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/toast',
  ],

  loading: {
    name: 'chasing-dots',
    color: '#FDBC11',
    background: 'white',
    height: '2px'
  },

  router: {
    middleware: "userAuth"
  },

  toast: {
    position: 'bottom-right',
    duration: 4000,
    keepOnHover: true,
    register: [ // Register custom toasts
      {
        name: 'my-error',
        message: 'Oops...Something went wrong',
        options: {
          type: 'error'
        }
      }
    ]
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: process.env.VUE_APP_BASE_URL || 'https://csnaapp.ir/api/v1'
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  },
  ssr: false,

  server: {
    port: 3000, // default: 3000
    host: '0.0.0.0' // default: localhost
  }

}
