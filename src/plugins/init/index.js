import Vue from 'vue'
import { initCloud } from '~/modules/cloud/init'

export default () => {
  Vue.mixin({ methods: { initCloud: option => initCloud(option) } })
}
