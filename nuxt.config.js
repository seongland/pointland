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

  module: ['nuxt-socket-io', '@nuxtjs/axios'],
  buildModules: ['@nuxtjs/vuetify'],
  io: {
    server: {
      ioSvc: 'src/server/io'
    },
    sockets: [
      {
        name: 'vhcl',
        url: '/',
        nsp: '/'
      }
    ]
  },
  // Vuetify
  vuetify: {
    defaultAssets: {
      icons: 'fa'
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
    maxChunkSize: 300000,
    transpile: [
      'three'
    ],
    extend() { }
  },

  // Header
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    script: [
      {
        src:
          'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=ajrugsv5ub'
      }
    ],
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
