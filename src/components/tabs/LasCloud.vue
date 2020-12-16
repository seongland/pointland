/* * @summary - vue point cloud componen */

<template>
  <div>
    <div id="las" />
  </div>
</template>

<script>
import { xyto84 } from '~/server/api/addon/tool/coor'
import { ref } from '~/modules/cloud/init'
import { v4 as uuid } from 'uuid'
import consola from 'consola'

const SVR_INTERVAL = 1000
const CACHE_INTERVAL = 2000

export default {
  data: () => ({ lasList: [], apiList: [], loading: false }),

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
      const commit = this.$store.commit
      commit('setLoading', false)
    }
  },

  methods: {
    removeLases(removeList) {
      for (const las of removeList) {
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
      const commit = this.$store.commit
      let loadCount = 0
      for (const index of loadList) {
        // Filter
        if (!lasList[index]) continue
        const zoneName = lasList[index]
        if (this.lasList.includes(zoneName)) continue

        // Load Local Cache Las
        let lasCache = await this.getLasCache(zoneName)
        if (lasCache) this.loadLas(zoneName, true, lasCache, markObj.round, markObj.snap)
        // Load Server
        else {
          const changed = await this.termLoadLas(markObj, zoneName, true, undefined)
          if (changed === true) {
            if (process.env.target === 'cloud') consola.success('Mark Changed')
            return
          }
        }
        loadCount++
      }
      if (loadCount === 0) commit('setLoading', false)
    },

    async termLoadLas(markObj, zoneName, draw, lasCache) {
      const round = markObj.round
      const snap = markObj.snap
      const mark = markObj.name
      this.loadLas(zoneName, draw, lasCache, markObj.round, markObj.snap)
      await new Promise(resolve => setTimeout(() => resolve(), SVR_INTERVAL))
      return this.currentChanged(round, snap, mark)
    },

    async termCacheLas(snapObj, zoneName) {
      if (process.env.target === 'cloud') consola.info('Caching', zoneName)
      const round = snapObj.round
      const snap = snapObj.name
      await this.loadLas(zoneName, false, false, snapObj.round, snapObj.name)
      await new Promise(resolve => setTimeout(() => resolve(), CACHE_INTERVAL))
      return this.currentChanged(round, snap)
    },

    async loadLas(zoneName, draw, lasCache, round, snap) {
      const commit = this.$store.commit
      const fileExt = zoneName.split('.').pop()
      if (fileExt !== 'las') return

      // If Cached
      if (lasCache) {
        if (process.env.target === 'cloud') consola.info('Use Cache', zoneName, lasCache)
        return draw ? this.drawLasCloud(lasCache.data, zoneName) : null
      }

      // Check Server Cache
      const root = this.getLasAPIRoot(zoneName, round, snap)
      const check = await this.$axios(`${root}`)

      // Get Server Las Json
      let lasJson
      if (check.data.cached) lasJson = await this.serverCached(root, zoneName)
      else lasJson = check.data

      // After job
      this.setLasCache(zoneName, lasJson)
      if (!draw) return commit('setLoading', false)
      this.drawLasCloud(lasJson, zoneName)
    },

    async serverCached(root, zone) {
      // Make Cancel token
      const commit = this.$store.commit
      const dataList = ['x', 'y', 'z', 'c', 'i']
      let srcs = []
      let promises = []
      for (const target of dataList) this.addAPI(target, promises, srcs, root)
      this.apiList.push(srcs)
      const [x, y, z, c, i] = await Promise.all(promises)
      const lasJson = { x: x.data, y: y.data, z: z.data, center: c.data, intensity: i.data }
      const complete = this.checkLasJson(lasJson, zone)
      if (complete) return lasJson
      else {
        if (process.env.target === 'cloud') consola.info('Recache Server', zone)
        await this.$axios.delete(`${root}`)
        return await this.serverCached(root, zone)
      }
    },

    addAPI(target, promises, srcs, root) {
      const src = this.$axios.CancelToken.source()
      promises.push(this.$axios(`${root}/${target}`, { cancelToken: src.token }))
      srcs.push(src)
    },

    drawLasCloud(lasJson, zoneName) {
      const commit = this.$store.commit
      commit('setLoading', true)
      setTimeout(() => {
        this.drawLas(lasJson, zoneName)
        commit('setLoading', false)
        this.lasList.push(zoneName)
        if (process.env.target === 'draw') consola.success('Drawed', zoneName)
      })
    },

    currentChanged(round, snap, mark) {
      const ls = this.$store.state.ls
      if (round !== undefined && ls.currentRound.name !== round) return true
      if (snap !== undefined && ls.currentSnap.name !== snap) return true
      if (mark !== undefined && ls.currentMark.name !== mark) return true
      return false
    },

    setLasCache(zone, data) {
      const commit = this.$store.commit
      let transaction = this.lasCaches.transaction(['LasJson'], 'readwrite')
      let objectStore = transaction.objectStore('LasJson')
      let request = objectStore.add({ name: zone, data })
      commit('setState', { props: ['ls', 'cacheMap', zone], value: true })
      if (process.env.target === 'cloud') consola.info('Cached', zone)
    },

    getLasAPIRoot(zoneName, round, snap) {
      return `/api/pointcloud/${round}/${snap}/${zoneName}`
    },

    async getLasCache(zone) {
      const commit = this.$store.commit
      let transaction = this.lasCaches.transaction(['LasJson'], 'readonly')
      let objectStore = transaction.objectStore('LasJson')
      let index = objectStore.index('name')
      if (process.env.target === 'cloud') console.time(`get ${zone}`)

      return await new Promise(
        resolve =>
          (index.get(zone).onsuccess = event => {
            if (process.env.target === 'cloud') console.timeEnd(`get ${zone}`)
            let result = event.target.result
            if (result) {
              const complete = this.checkLasJson(result.data, zone, result.id)
              if (!complete) result = false
            }
            if (result) commit('setState', { props: ['ls', 'cacheMap', zone], value: true })
            resolve(result)
          })
      )
    },

    removeCache(zone, id) {
      const commit = this.$store.commit
      commit('setState', { props: ['ls', 'cacheMap', zone], value: false })
      let transaction = this.lasCaches.transaction(['LasJson'], 'readwrite')
      let objectStore = transaction.objectStore('LasJson')
      objectStore.delete(id)
    },

    checkCached(zone) {
      return this.$store.state.ls.cacheMap[zone]
    },

    checkLasJson(lasJson, zone, id) {
      for (const key in lasJson)
        if (!(lasJson[key] instanceof Array)) {
          if (id) this.removeCache(zone, id)
          consola.error('Bad LasJson', zone, lasJson)
          return false
        }
      return true
    }
  },

  mounted() {
    this.$root.cloud = this.initCloud(this.cloudOpt)

    let dbconnect = window.indexedDB.open('cache', 1)
    dbconnect.onsuccess = ev => {
      this.lasCaches = ev.target.result
      const transaction = this.lasCaches.transaction('LasJson', 'readwrite')
      transaction.onerror = ev => consola.error(ev.target.error.message)
    }
    dbconnect.onupgradeneeded = ev => {
      this.lasCaches = ev.target.result
      const bigStore = this.lasCaches.createObjectStore('LasJson', { keyPath: 'name' })
      bigStore.createIndex('name', 'name', { unique: true })
      bigStore.createIndex('data', 'data', { unique: false })
    }
  }
}
</script>

<style>
#las {
  height: 100%;
}
</style>
