/* * @summary - vue point cloud componen */

<template>
  <div>
    <div id="las" />
  </div>
</template>

<script>
import { xyto84 } from '~/server/api/addon/tool/coor'
import { ref } from '~/plugins/cloud/init'
import { v4 as uuid } from 'uuid'
import consola from 'consola'

const SVR_INTERVAL = 1000
const CACHE_INTERVAL = 5000

const localCache = new Map()

export default {
  data: () => ({ localCache, lasList: [], apiList: [], loading: false }),

  computed: {
    currentMark() {
      return this.$store.state.ls.currentMark
    },
    currentSnap() {
      return this.$store.state.ls.currentSnap
    }
  },

  watch: {
    async currentMark(markObj) {
      // Cancel before
      for (const api of this.apiList) for (const src of api) src.cancel()
      this.apiList = []

      // Make Load list
      const commit = this.$store.commit
      if (!markObj?.lasList) return
      const lasList = markObj.lasList.split(':')
      const mainIndex = lasList.indexOf(markObj.mainArea)
      let loadList = [mainIndex, mainIndex - 1, mainIndex + 1, mainIndex + 2, mainIndex - 2]

      // Make remove List
      const removeList = []
      for (const las of this.lasList) if (!lasList.includes(las)) removeList.push(las)

      // Update Las
      this.removeLases(removeList)
      this.loadLases(markObj, loadList, lasList)
    },

    async currentSnap(snapObj) {
      for (const areaObj of snapObj.areas) {
        const areaName = areaObj.name
        let lasCache = await this.getLasCache(areaName)
        if (!lasCache) await this.termCacheLas(snapObj, areaName)
      }
    }
  },

  methods: {
    removeLases(removeList) {
      for (const las of removeList) {
        if (process.env.dev) consola.info('Remove Area', las)
        for (const i in ref.cloud.points)
          if (ref.cloud.points[i].name === las) {
            ref.cloud.scene.remove(ref.cloud.points[i])
            ref.cloud.points.splice(i, 1)
            break
          }
        this.lasList.splice(this.lasList.indexOf(las), 1)
      }
    },

    async loadLases(markObj, loadList, lasList) {
      let loadCount = 0
      for (const index of loadList) {
        // Filter
        if (!lasList[index]) continue
        const areaName = lasList[index]
        if (this.lasList.includes(areaName)) continue

        // Load Local Cache Las
        let lasCache = await this.getLasCache(areaName)
        if (lasCache) this.loadLas(areaName, true, lasCache)
        // Load Server
        else this.termLoadLas(markObj, areaName, true, undefined)
        loadCount++
      }
      if (loadCount === 0) commit('setLoading', false)
    },

    async termLoadLas(markObj, areaName, draw, lasCache) {
      const round = markObj.round
      const snap = markObj.snap
      const mark = markObj.name
      this.loadLas(areaName, draw, lasCache)
      await new Promise(resolve => setTimeout(() => resolve(), SVR_INTERVAL))
      if (this.currentChanged(round, snap, mark)) return
    },

    async termCacheLas(snapObj, areaName) {
      consola.info('Caching', areaName)
      const round = snapObj.round
      const snap = snapObj.name
      await this.loadLas(areaName)
      await new Promise(resolve => setTimeout(() => resolve(), CACHE_INTERVAL))
      if (this.currentChanged(round, snap)) return
    },

    async loadLas(areaName, draw, lasCache) {
      const commit = this.$store.commit
      const fileExt = areaName.split('.').pop()
      if (fileExt !== 'las') return

      // If Cached
      if (lasCache) return draw ? this.drawLasCloud(lasCache.data, areaName) : null

      // Check Server Cache
      const root = this.getLasAPIRoot(areaName)
      const check = await this.$axios(`${root}`)

      // Get Server Las Json
      let lasJson
      if (check.data.cached) lasJson = await this.serverCached(root)
      else lasJson = check.data

      // After job
      this.setLasCache(areaName, lasJson)
      if (!draw) return commit('setLoading', false)

      consola.info('Cached', areaName)
      this.drawLasCloud(lasJson, areaName)
    },

    async serverCached(root) {
      // Make Cancel token
      const commit = this.$store.commit
      const dataList = ['x', 'y', 'z', 'c', 'i']
      let srcs = []
      let promises = []
      for (const target of dataList) this.addAPI(target, promises, srcs, root)
      this.apiList.push(srcs)
      const [x, y, z, c, i] = await Promise.all(promises)
      const lasJson = { x: x.data, y: y.data, z: z.data, center: c.data, intensity: i.data }
      return lasJson
    },

    addAPI(target, promises, srcs, root) {
      const src = this.$axios.CancelToken.source()
      promises.push(this.$axios(`${root}/${target}`, { cancelToken: src.token }))
      srcs.push(src)
    },

    drawLasCloud(lasJson, areaName) {
      const commit = this.$store.commit
      commit('setLoading', true)
      setTimeout(() => {
        this.drawLas(lasJson, areaName)
        commit('setLoading', false)
        this.lasList.push(areaName)
      })
    },

    currentChanged(round, snap, mark) {
      const ls = this.$store.state.ls
      if (round && ls.currentRound.name !== round) return true
      if (snap && ls.currentSnap.name !== snap) return true
      if (mark && ls.currentMark.name !== mark) return true
      return false
    },

    setLasCache(area, data) {
      let transaction = this.lasCaches.transaction(['LasJson'], 'readwrite')
      let objectStore = transaction.objectStore('LasJson')
      let request = objectStore.add({ name: area, data })
      localCache[area] = { name: area, data }
    },

    getLasAPIRoot(areaName) {
      const ls = this.$store.state.ls
      const currentRound = ls.currentRound.name
      const currentSnap = ls.currentSnap.name
      return `/api/pointcloud/${currentRound}/${currentSnap}/${areaName}`
    },

    async getLasCache(area) {
      if (localCache[area]) return localCache[area]
      let transaction = this.lasCaches.transaction(['LasJson'], 'readonly')
      let objectStore = transaction.objectStore('LasJson')
      let index = objectStore.index('name')

      return await new Promise(
        resolve =>
          (index.get(area).onsuccess = event => {
            resolve(event.target.result)
            localCache[area] = event.target.result
          })
      )
    }
  },

  mounted() {
    this.$root.cloud = this.initCloud(this.cloudOpt)

    let dbconnect = window.indexedDB.open('cache', 1)
    dbconnect.onsuccess = ev => {
      this.lasCaches = ev.target.result
      const transaction = this.lasCaches.transaction('LasJson', 'readwrite')
      transaction.onerror = ev => console.error(ev.target.error.message)
    }

    dbconnect.onupgradeneeded = ev => {
      console.log('Upgrade DB')
      this.lasCaches = ev.target.result
      const store = this.lasCaches.createObjectStore('LasJson', { keyPath: 'id', autoIncrement: true })
      store.createIndex('name', 'name', { unique: true })
      store.createIndex('data', 'data', { unique: false })
    }
  }
}
</script>

<style>
#las {
  height: 100%;
}
</style>
