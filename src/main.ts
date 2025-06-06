import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import Vuetify from 'vuetify'
import VueGtag from 'vue-gtag'
import App from './App.vue'
import store from './store'

import 'vuetify/dist/vuetify.min.css'

Vue.use(VueCompositionAPI)
Vue.use(Vuetify)
Vue.use(VueGtag, {
  config: { id: 'G-G46T45L2RZ' },
})

Vue.mixin({
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

const vuetify = new Vuetify()

new Vue({
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
