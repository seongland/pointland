import Vue from 'vue'
import { initCloud } from '~/modules/cloud/init'
import VueGtag from 'vue-gtag'

export default () => {
  Vue.use(VueGtag, {
    config: { id: 'G-G46T45L2RZ' }
  })
  Vue.mixin({ methods: { initCloud: option => initCloud(option) } })
}
