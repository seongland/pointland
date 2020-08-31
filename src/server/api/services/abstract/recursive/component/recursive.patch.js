const RecursivePatchMixin = (superclass) =>
  class extends superclass {
    async patchMain(hid, filteredData, unpatched, target, meta) {
      meta.query = {}
      meta.inner = true

      // 1. Update Origin
      if (!filteredData.history) filteredData.history = []
      filteredData.history.push(hid)
      filteredData.version = ++unpatched.version
      meta.query = { id: target }

      // 2. Update Parent when parent_input
      if (
        filteredData.parent_id &&
        unpatched.parent_id !== filteredData.parent_id
      )
        this.changeParent(
          target,
          { id: unpatched.parent_id, table: unpatched.parent_table },
          { id: filteredData.parent_id, table: filteredData.parent_table },
          meta
        )
      return await super.patch(target, filteredData, meta)
    }

    async changeParent(child, prev, next, meta) {
      /**
       * @summary - Change parent when patch
       * @since patch
       */

      // 1. Remove from Previous Parent
      const prevData = await this.getRecordValue({ id: prev.id }, prev.table)

      const index = prevData.content.indexOf(child)
      prevData.content.splice(index, 1)
      const request = { content: prevData.content }
      meta.query = { id: prev.id }
      meta.inner = true
      this.app.service(prev.table).patch(prev.id, request, meta)

      // 2. Add to Next Parent
      this.addContent({ id: next.id, table: next.table }, { id: child }, meta)
    }

    async addContent(parent, childData, meta) {
      /**
       * @summary - Update Parent - Append child to content
       * @param {object} - insert index, child id
       * @since create
       */
      const parentData = await this.getRecordValue(
        { id: parent.id },
        parent.table
      )
      if (!parentData.content) parentData.content = []
      if (childData.index)
        parentData.content.splice(childData.index, 0, childData.id)
      else parentData.content.push(childData.id)
      const request = { content: parentData.content }

      meta.query = { id: parent.id }
      meta.inner = true
      this.app.service(parent.table).patch(parent.id, request, meta)
    }

    patchFilter(data) {
      /**
       * @summary - Do Create Block, filter input data
       */
      delete data.id
      delete data.origin
      delete data.alive
      delete data.created_at
      delete data.created_by_table
      delete data.created_by
      delete data.edited_at
      delete data.edited_by
      delete data.edited_by_table
    }

    innerFilter(data) {
      delete data.history
      delete data.bin
      delete data.version
      delete data.content
    }

    validatePatch(unpatched, request) {
      // Input Filter
      if (!unpatched.alive) return `You can't change Dead Block ${unpatched.id}`

      // Check change
      let change, key
      for (key in request)
        if (JSON.stringify(request[key]) !== JSON.stringify(unpatched[key])) {
          change = true
          break
        }
      if (!change) return "Nothing Changed"
    }

    changeIndex(unpatched, request) {
      /**
       * @summary - change content index
       */

      // Check Intersection
      let intersection
      if (unpatched.content && request.content)
        intersection = unpatched.filter((e) =>
          request.some((descent) => descent.id === e.id)
        )
      else if (unpatched.content || request.content)
        return "Cannot add/delete content"

      if (request.content.length !== intersection.length)
        return "Only can change content index"
    }

    deadFilter(data, target) {
      /**
       * @summary - Dead Block do not need bin, history - remove Revision/View data
       */
      delete data.bin
      delete data.history
      delete data.query

      if (!data.origin) data.origin = target
      data.alive = false
      this.collectionFilter(data)
    }

    collectionFilter(data) {
      if (this.isCol(data.type)) {
        delete data.scheme
        delete data.main_view
        delete data.content
      }
    }
  }
export default RecursivePatchMixin
