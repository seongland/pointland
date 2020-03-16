import Vue from 'vue'

Vue.mixin({
  methods: {
    async mapPano() {
      this.stMap = this.olInit()
      this.stPano = this.stPanoInit(this.stMap)
      this.stMap.pano = this.stPano
      return this.stMap
    }
  }
})
