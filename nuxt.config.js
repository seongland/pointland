const colors = require('vuetify/es5/util/colors').default

module.exports = {
  // Root Directory
  srcDir: 'src/',

  // Meta
  mode: 'universal',

  // Vue Config
  vue: {
    config: {
      productionTip: false,
      devtools: true
    }
  },

  // Middleware Apis
  serverMiddleware: {
    '/api': '~/server/api/'
  },

  // Loading Bar
  loading: { color: '#fff' },

  // Plugins to load before mounting the App
  plugins: [
    {
      src: '~/plugins/',
      ssr: false
    }
  ],

  // Nuxt dev-modules
  buildModules: ['@nuxtjs/vuetify'],

  // Vuetify
  vuetify: {
    defaultAssets: {
      icons: 'mdiSvg'
    },
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // WebPack Build configuration
  build: {
    extend() {}
  },

  // Header
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  }
}
