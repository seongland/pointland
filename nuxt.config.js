const colors = require('vuetify/es5/util/colors').default
const package = require('./package.json')
const dotenv = require('dotenv')
const fs = require('fs')
const path = require('path')

dotenv.config()

process.env.NODE_ENV === 'production' ? (process.env.dev = '') : (process.env.dev = 1)
process.env.version = package.version
process.env.twr = process.env.TWR

module.exports = {
  // Root Directory
  srcDir: 'src/',

  // Meta
  ssr: false,
  // Vue Config
  vue: {
    config: {
      productionTip: false,
      devtools: true
    }
  },
  env: {
    dev: process.env.dev,
    version: process.env.version,
    twr: process.env.twr
  },

  // Middleware Apis
  serverMiddleware: {
    '/api': '~/server/api/app'
  },

  // Loading Bar
  loading: { color: '#424242' },

  // Plugins to load before mounting the App
  plugins: [
    {
      src: '~/plugins/init',
      ssr: false
    },
    {
      src: '~/plugins/config',
      ssr: false
    },
    {
      src: '~/plugins/event',
      ssr: false
    },
    {
      src: '~/plugins/draw',
      ssr: false
    }
  ],
  // Nuxt dev-modules

  modules: ['@nuxtjs/axios', ['nuxt-vuex-localstorage', { localStorage: ['ls'] }]],
  buildModules: ['@nuxtjs/vuetify'],

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
  // server: {
  //   https: {
  //     key: fs.readFileSync(path.resolve(__dirname, 'src/assets/ssl', 'server.key')),
  //     cert: fs.readFileSync(path.resolve(__dirname, 'src/assets/ssl', 'server.crt'))
  //   }
  // },
  io: {
    server: {
      ioSvc: 'src/server/io'
    },
    sockets: [
      {
        name: 'ping',
        url: '/'
      }
    ]
  },
  // WebPack Build configuration
  build: {
    maxChunkSize: 300000,
    transpile: ['three'],
    extend() {}
  },

  // Header
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    script: [
      {
        src: 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=ajrugsv5ub'
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
