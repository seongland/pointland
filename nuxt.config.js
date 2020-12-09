const colors = require('vuetify/es5/util/colors').default
const package = require('./package.json')
const dotenv = require('dotenv')

dotenv.config()
process.env.NODE_ENV === 'production' ? (process.env.dev = '') : (process.env.dev = 1)
process.env.version = package.version
process.env.twr = process.env.TWR
process.env.title = '3D Mapping'
if (process.env.dev) process.env.target = 'cloud'

module.exports = {
  srcDir: 'src/',
  ssr: false,
  vue: { config: { productionTip: false, devtools: true } },
  env: {
    dev: process.env.dev,
    version: process.env.version,
    twr: process.env.twr,
    title: process.env.title,
    target: process.env.target
  },
  serverMiddleware: { '/api': '~/server/api/app' },

  // Loading Bar
  loading: { color: '#424242' },

  // Plugins to load before mounting the App
  plugins: [
    { src: '~/plugins/init/', ssr: false },
    { src: '~/plugins/init/config', ssr: false },
    { src: '~/plugins/draw/base', ssr: false },
    { src: '~/plugins/draw/facility', ssr: false },
    { src: '~/plugins/draw/image', ssr: false },
    { src: '~/plugins/event/base', ssr: false },
    { src: '~/plugins/event/facility', ssr: false },
    { src: '~/plugins/event/key', ssr: false }
  ],
  modules: ['@nuxtjs/axios', ['nuxt-vuex-localstorage', { localStorage: ['ls'] }]],
  buildModules: ['@nuxtjs/vuetify'],

  // Vuetify
  vuetify: {
    defaultAssets: { icons: 'fa' },
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
    transpile: ['three'],
    extend() {}
  },

  // Header
  head: {
    title: process.env.title,
    script: [{ src: 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=ajrugsv5ub' }],
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
