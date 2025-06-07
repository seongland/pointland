import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import { createGtag } from 'vue-gtag'
import App from './App.vue'
import store from './store'

const app = createApp(App)
app.use(store)
app.use(createVuetify())
app.use(createGtag({
  property: { id: 'G-G46T45L2RZ' },
}))

app.mixin({
  data: () => ({
    title: 'Pointland',
    meta: { version: undefined },
    spaceOpt: {
      id: 'pointland',
      layers: { point: [] },
      box: 'skybox',
      position: [10, 130, 50],
    },
  }),
})

app.mount('#app')
