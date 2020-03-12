<template>
  <div>
    <h2>Map</h2>
    <ul>
      <li v-for="(article, index) in articles" :key="index">
        <span>{{ article }}</span>
      </li>
    </ul>
    <h2>Comments <small>(nested under articles)</small></h2>
    <ul>
      <li v-for="(comment, index) in comments" :key="index">
        <span>{{ comment }}</span>
      </li>
    </ul>
    <NuxtLink to="/">
      Home
    </NuxtLink>
  </div>
</template>

<script>
import Map from 'ol/Map'
import View from 'ol/View'
import { mapGetters } from 'vuex'
import { Image as ImageLayer, Tile as TileLayer } from 'ol/layer'
import ImageWMS from 'ol/source/ImageWMS'
import TileWMS from 'ol/source/TileWMS'

const START_ZOOM = 12
const DRAW_LAYER_ID = 12
const START_POINT = [126.972, 37.5293]

export default {
  computed: mapGetters({
    articles: 'articles/get',
    comments: 'articles/comments/get'
  }),
  mounted() {
    this.map()
  },
  methods: {
    init() {},

    makePvrLayer() {
      /**
       * @summary - Get Marker Image Layer
       */
      let pvrLayer = new Tile({
        source: new TileWMS({
          url: `${GEOSERVER}${WORKSPACE}/wms`,
          params: { LAYERS: PVR_LAYER },
          ratio: 1,
          serverType: 'geoserver'
        })
      })
      pvrLayer.setZIndex(ZINDEX_PVR)
      return pvrLayer
    }
  },
  data: function() {
    return {}
  }
}
</script>

<style></style>
