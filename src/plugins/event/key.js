import Vue from 'vue'
import consola from 'consola'
import { ref as cloudRef } from '~/modules/cloud/init'
import { setFocus } from '~/modules/map/event'

export default ({ store: { commit, state, $router } }) => {
  Vue.mixin({
    methods: {
      keyUp(event) {
        /*
         * @summary - Special Callback
         */
        if ($router.currentRoute.name !== 'draw') return
        if (state.submit.show || state.edit.show || state.del.ing || state.loading) return
        switch (event.key) {
          case 'Delete':
            const selected = state.selected
            if (selected[0]?.id) {
              commit('setState', { props: ['del', 'id'], value: selected[0].id })
              commit('setState', { props: ['del', 'ing'], value: true })
            }
            return
          case 'Escape':
            if (state.selected.length > 0) this.resetSelected()
            else this.drawnFacilities()
            return
        }
      },

      keyEvent(event) {
        /*
         * @summary - Normal Key Callback
         */
        // Filter event
        window.ctrlKey = event.ctrlKey
        window.shiftKey = event.shiftKey
        if ($router.currentRoute.name !== 'draw') return
        if (event.ctrlKey && 'fF123,.mMsSaAiI'.indexOf(event.key) !== -1) event.preventDefault()
        if (state.submit.show || state.edit.show || state.del.ing || state.loading) return

        let seqIndex
        const ls = this.$store.state.ls
        const index = this.$store.state.ls.index

        if (event.ctrlKey)
          switch (event.key) {
            // change seq
            case ',':
              seqIndex = ls.currentSnap.marks.indexOf(ls.currentMark)
              if (seqIndex > 0) if (!state.depth.loading) this.setMark(ls.currentSnap.marks[seqIndex - 1])
              return
            case '.':
              seqIndex = ls.currentSnap.marks.indexOf(ls.currentMark)
              if (seqIndex < ls.currentSnap.marks.length - 1)
                if (!state.depth.loading) this.setMark(ls.currentSnap.marks[seqIndex + 1])
              return

            case 'a':
            case 'A':
              if (state.selected.length > 0) {
                cloudRef.cloud.transform.visible = !state.visible.transform
                cloudRef.cloud.transform.enabled = !state.visible.transform
              }
              commit('setState', { props: ['visible', 'transform'], value: !state.visible.transform })
              return

            case 'i':
            case 'I':
              if (state.selected.length === 1 && state.selected[0].indexes)
                if (state.selected[0].indexes.length > 1) commit('setState', { props: ['interpolating'], value: true })
              return

            // change tabs
            case '1':
              return commit('ls/setIndex', Number(event.key) - 1)
            case '2':
              return commit('ls/setIndex', Number(event.key) - 1)
            case '3':
              return commit('ls/setIndex', Number(event.key) - 1)

            // Toggle
            case 'm':
            case 'M':
              if (index === 0) return
              const mapWrapper = document.getElementById('global-map')?.parentElement
              if (!mapWrapper) return
              if (!mapWrapper.classList.contains('small-map')) return mapWrapper.classList.add('small-map')
              if (this.tabs[0].show) mapWrapper.setAttribute('style', 'z-index:-1 !important')
              else mapWrapper.setAttribute('style', 'z-index:5 !important')
              this.tabs[0].show = !this.tabs[0].show
              return

            // Focus Selected - Cloud Only
            case 'f':
            case 'F':
              if (!event.shiftKey)
                if (index === 2) {
                  if (state.selected.length === 0) return
                  const target = state.selected[state.selected.length - 1]
                  const props = target.properties
                  if (!cloudRef.cloud.offset) return
                  const controls = cloudRef.cloud.controls
                  const offset = cloudRef.cloud.offset
                  if (target.geometry.type === 'Point')
                    controls.target.set(props.x - offset[0], props.y - offset[1], props.z - offset[2])
                  else if (target.geometry.type === 'LineString') {
                    const xyz = target.properties.xyzs[target.index]
                    controls.target.set(xyz[0] - offset[0], xyz[1] - offset[1], xyz[2] - offset[2])
                  } else if (target.geometry.type === 'Polygon') {
                    const xyz = target.properties.xyzs[target.index][target.index2]
                    controls.target.set(xyz[0] - offset[0], xyz[1] - offset[1], xyz[2] - offset[2])
                  }
                }
                // hover
                else {
                  if (!cloudRef.cloud.currentHover) return
                  const hovered = cloudRef.cloud.currentHover.point
                  if (index === 2) {
                    if (!cloudRef.cloud.offset) return
                    const controls = cloudRef.cloud.controls
                    controls.target.set(hovered.x, hovered.y, hovered.z)
                  }
                }
              return
          }
        else
          switch (event.key) {
            // UI control
            case ' ':
              if (index === 2) {
                if (!cloudRef.cloud.offset) return
                const markObj = ls.currentMark
                const controls = cloudRef.cloud.controls
                const offset = cloudRef.cloud.offset
                const camera = cloudRef.cloud.camera
                camera.position.set(markObj.x - offset[0], markObj.y - offset[1], markObj.alt - offset[2] + 50)
                controls.target.set(markObj.x - offset[0], markObj.y - offset[1], markObj.alt - offset[2])
              }
              if (state.ls.currentMark) setFocus(state.ls.currentMark.lat, state.ls.currentMark.lon)
              return

            // Submit
            case 'Enter':
              if (state.selected.length > 0) {
                if (state.selected[0].id) {
                  const selected = state.selected
                  commit('setState', { props: ['edit', 'id'], value: selected[0].id })
                  commit('setState', { props: ['edit', 'ing'], value: true })
                  commit('setState', { props: ['edit', 'show'], value: true })
                  return
                } else {
                  if (!state.allowedLayers.includes(state.ls.targetLayer.object?.layer)) return
                  commit('setState', { props: ['submit', 'ing'], value: true })
                  commit('setState', { props: ['submit', 'show'], value: true })
                }
              }
              return
          }
        if (process.env.target === 'key') consola.info('Pressed', event.key)
      }
    }
  })
}
