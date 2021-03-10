const package = require('./package.json')
const dotenv = require('dotenv')

dotenv.config()
process.env.NODE_ENV === 'production' ? (process.env.dev = '') : (process.env.dev = 1)
process.env.version = package.version
process.env.twr = process.env.TWR
process.env.title = 'Pointland'

// ['cloud', 'image', 'move', 'facility']
if (process.env.dev) process.env.target = 'move'

module.exports = {
  srcDir: 'src/',
  ssr: true,
  vue: { config: { productionTip: false, devtools: true } },
  env: {
    dev: process.env.dev,
    version: process.env.version,
    twr: process.env.twr,
    title: process.env.title,
    target: process.env.target
  },
  server: {
    port: process.env.PORT || 8080,
    host: '0.0.0.0'
  },
  serverMiddleware: { '/api': '~/server/api/app' },

  // Loading Bar
  loading: { color: '#424242' },

  // Plugins to load before mounting the App
  plugins: [
    { src: '~/plugins/init/', ssr: false },
    { src: '~/plugins/init/config', ssr: false }
  ],
  modules: ['@nuxtjs/axios', ['nuxt-vuex-localstorage', { localStorage: ['ls'] }]],
  buildModules: ['@nuxtjs/vuetify'],

  // Vuetify
  vuetify: { defaultAssets: { icons: 'fa' }, theme: { dark: true } },

  // WebPack Build configuration
  build: {
    maxChunkSize: 300000,
    transpile: ['three'],
    extend() { }
  },

  // Header
  head: {
    title: process.env.title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      { hid: 'og:image', property: 'og:image', content: '/sky.jpg' },
      {
        hid: 'og:image',
        name: 'og:image',
        content: `https://point.seongland.com/pointland.png`
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  }
}
