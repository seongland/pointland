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
        let cached = this.checkCached(areaName)
        if (cached) continue
        consola.info('Checking', areaName)
        let lasCache = await this.getLasCache(areaName)
        if (!lasCache) {
          const changed = await this.termCacheLas(snapObj, areaName)
          if (changed === true) return consola.success('Snap Changed')
        }
      }
      consola.success(`${snapObj.name} all cached in local`)
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
        const areaName = lasList[index]
        if (this.lasList.includes(areaName)) continue

        // Load Local Cache Las
        let lasCache = await this.getLasCache(areaName)
        if (lasCache) this.loadLas(areaName, true, lasCache, markObj.round, markObj.snap)
        // Load Server
        else {
          const changed = await this.termLoadLas(markObj, areaName, true, undefined)
          if (changed === true) return consola.success('Mark Changed')
        }
        loadCount++
      }
      if (loadCount === 0) commit('setLoading', false)
    },

    async termLoadLas(markObj, areaName, draw, lasCache) {
      const round = markObj.round
      const snap = markObj.snap
      const mark = markObj.name
      this.loadLas(areaName, draw, lasCache, markObj.round, markObj.snap)
      await new Promise(resolve => setTimeout(() => resolve(), SVR_INTERVAL))
      return this.currentChanged(round, snap, mark)
    },

    async termCacheLas(snapObj, areaName) {
      consola.info('Caching', areaName)
      const round = snapObj.round
      const snap = snapObj.name
      await this.loadLas(areaName, false, false, snapObj.round, snapObj.name)
      await new Promise(resolve => setTimeout(() => resolve(), CACHE_INTERVAL))
      return this.currentChanged(round, snap)
    },

    async loadLas(areaName, draw, lasCache, round, snap) {
      const commit = this.$store.commit
      const fileExt = areaName.split('.').pop()
      if (fileExt !== 'las') return

      // If Cached
      if (lasCache) {
        consola.info('Use Cache', areaName, lasCache)
        return draw ? this.drawLasCloud(lasCache.data, areaName) : null
      }

      // Check Server Cache
      const root = this.getLasAPIRoot(areaName, round, snap)
      const check = await this.$axios(`${root}`)

      // Get Server Las Json
      let lasJson
      if (check.data.cached) lasJson = await this.serverCached(root, areaName)
      else lasJson = check.data

      // After job
      this.setLasCache(areaName, lasJson)
      if (!draw) return commit('setLoading', false)
      this.drawLasCloud(lasJson, areaName)
    },

    async serverCached(root, area) {
      // Make Cancel token
      const commit = this.$store.commit
      const dataList = ['x', 'y', 'z', 'c', 'i']
      let srcs = []
      let promises = []
      for (const target of dataList) this.addAPI(target, promises, srcs, root)
      this.apiList.push(srcs)
      const [x, y, z, c, i] = await Promise.all(promises)
      const lasJson = { x: x.data, y: y.data, z: z.data, center: c.data, intensity: i.data }
      const complete = this.checkLasJson(lasJson, area)
      if (complete) return lasJson
      else {
        consola.info('Recache Server', area)
        await this.$axios.delete(`${root}`)
        return await this.serverCached(root, area)
      }
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
        consola.success('Drawed', areaName)
      })
    },

    currentChanged(round, snap, mark) {
      const ls = this.$store.state.ls
      if (round !== undefined && ls.currentRound.name !== round) return true
      if (snap !== undefined && ls.currentSnap.name !== snap) return true
      if (mark !== undefined && ls.currentMark.name !== mark) return true
      return false
    },

    setLasCache(area, data) {
      const commit = this.$store.commit
      let transaction = this.lasCaches.transaction(['LasJson'], 'readwrite')
      let objectStore = transaction.objectStore('LasJson')
      let request = objectStore.add({ name: area, data })
      commit('setState', { props: ['ls', 'cacheMap', area], value: true })
      consola.info('Cached', area)
    },

    getLasAPIRoot(areaName, round, snap) {
      return `/api/pointcloud/${round}/${snap}/${areaName}`
    },

    async getLasCache(area) {
      const commit = this.$store.commit
      let transaction = this.lasCaches.transaction(['LasJson'], 'readonly')
      let objectStore = transaction.objectStore('LasJson')
      let index = objectStore.index('name')
      console.time(`get ${area}`)

      return await new Promise(
        resolve =>
          (index.get(area).onsuccess = event => {
            console.timeEnd(`get ${area}`)
            let result = event.target.result
            if (result) {
              const complete = this.checkLasJson(result.data, area, result.id)
              if (!complete) result = false
            }
            if (result) commit('setState', { props: ['ls', 'cacheMap', area], value: true })
            resolve(result)
          })
      )
    },

    removeCache(area, id) {
      const commit = this.$store.commit
      commit('setState', { props: ['ls', 'cacheMap', area], value: false })
      let transaction = this.lasCaches.transaction(['LasJson'], 'readwrite')
      let objectStore = transaction.objectStore('LasJson')
      objectStore.delete(id)
    },

    checkCached(area) {
      return this.$store.state.ls.cacheMap[area]
    },

    checkLasJson(lasJson, area, id) {
      for (const key in lasJson)
        if (!(lasJson[key] instanceof Array)) {
          if (id) this.removeCache(area, id)
          consola.error('Bad LasJson', area, lasJson)
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
      transaction.onerror = ev => console.error(ev.target.error.message)
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
