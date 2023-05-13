// @ts-ignore
import colors from 'vuetify/es5/util/colors'
import dotenv from 'dotenv'

import type { NuxtConfig } from '@nuxt/types'

dotenv.config()
process.env.title = 'Pointland'

const config: NuxtConfig = {
  srcDir: 'src/',
  ssr: false,
  vue: { config: { productionTip: false, devtools: process.env.NODE_ENV === 'production' } },
  target: 'static',
  sitemap: {
    hostname: 'https://point.seongland.com',
  },
  env: { title: process.env.title },
  head: {
    title: process.env.title,
    script: [
      {
        src: 'https://static.cloudflareinsights.com/beacon.min.js',
        defer: true,
        ['data-cf-beacon']: '{"token": "8f27ea7e450344a5a9340d4cc3b3f1dd"}',
      },
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      {
        hid: 'keywords',
        name: 'keywords',
        content: 'seongland, pointland, 3d, seonglae, metaverse, webtaverse, pointcloud, threejs, potree',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/icon.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: 'apple-touch-icon.png' },
    ],
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
  components: true,
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify', '@nuxtjs/composition-api/module'],
  modules: ['@nuxtjs/axios', '@nuxtjs/pwa', ['nuxt-vuex-localstorage', { localStorage: ['ls'] }], '@nuxtjs/sitemap'],

  // pwa
  pwa: {
    manifest: {
      name: 'Pointland',
      background_color: '#202229',
      icons: [
        {
          "src": "/android-chrome-36x36.png",
          "sizes": "36x36",
          "type": "image/png",
          purpose: 'any'
        },
        {
          "src": "/android-chrome-48x48.png",
          "sizes": "48x48",
          "type": "image/png",
          purpose: 'any'
        },
        {
          "src": "/android-chrome-72x72.png",
          "sizes": "72x72",
          "type": "image/png",
          purpose: 'any'
        },
        {
          "src": "/android-chrome-96x96.png",
          "sizes": "96x96",
          "type": "image/png",
          purpose: 'any'
        },
        {
          "src": "/android-chrome-144x144.png",
          "sizes": "144x144",
          "type": "image/png",
          purpose: 'any'
        },
        {
          "src": "/android-chrome-192x192.png",
          "sizes": "192x192",
          "type": "image/png",
          purpose: 'any'
        },
        {
          "src": "/android-chrome-256x256.png",
          "sizes": "256x256",
          "type": "image/png",
          purpose: 'any'
        },
        {
          "src": "/android-chrome-384x384.png",
          "sizes": "384x384",
          "type": "image/png",
          purpose: 'any'
        },
        {
          "src": "/android-chrome-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          purpose: 'any'
        },
        {
          "src": "/apple-touch-icon-1024x1024.png",
          "sizes": "512x512",
          "type": "image/png",
          purpose: 'maskable'
        },
        {
          "src": "/apple-touch-icon-180x180.png",
          "sizes": "180x180",
          "type": "image/png",
          purpose: 'maskable'
        },
      ],
      lang: 'en', autoRegister: false, display: 'fullscreen', orientation: 'landscape'
    },
    meta: {
      theme_color: '#202229'
    }
  },

  // Theme
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
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build
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
