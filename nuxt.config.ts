import colors from 'vuetify/es5/util/colors'
import dotenv from 'dotenv'

import type { NuxtConfig } from '@nuxt/types'

dotenv.config()
process.env.NODE_ENV === 'production' ? (process.env.dev = '') : (process.env.dev = '1')
process.env.title = 'Pointland'

const config: NuxtConfig = {
  ssr: false,
  srcDir: 'src/',
  vue: { config: { productionTip: false, devtools: Boolean(process.env.dev) } },
  target: 'static',
  env: { dev: process.env.dev, title: process.env.title },
  head: {
    titleTemplate: '%s - point-land',
    title: 'point-land',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  plugins: [
    { src: '~/plugins/init/', ssr: false },
    { src: '~/plugins/init/config', ssr: false },
  ],
  loading: { color: '#424242' },
  server: {
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
  },
  css: [],
  components: true,
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify'],
  modules: ['@nuxtjs/axios', '@nuxtjs/pwa', ['nuxt-vuex-localstorage', { localStorage: ['ls'] }]],
  axios: {},
  pwa: { manifest: { lang: 'en' } },
  vuetify: {
    defaultAssets: { icons: 'fa' },
    customVariables: ['~/assets/variables.scss'],
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
          success: colors.green.accent3,
        },
      },
    },
  },
  build: {
    devMiddleware: {
      headers: {
        'Cache-Control': 'no-store',
        Vary: '*',
      },
    },
    extractCSS: true,
    optimizeCSS: true,
    splitChunks: {
      commons: true,
      pages: true,
      layouts: true,
    },
    transpile: ['layerspace'],
  },
}

export default config
