import { GeneralError } from "@feathersjs/errors"

const PARENT_PROPS = [
  "id",
  "parent_id",
  "parent_table",
  "permissions",
  "main_view",
  "properties.title"
]

const NODE_PROPS = ["properties", "id"]

const BlockPresentMixin = (superclass) =>
  class extends superclass {
    /**
     * @summary - Block Class Mixin for Present API for Front View
     */

    permitedParent(parentList, userId) {
      /**
       * @summary - get Accessible parent list - find first permission from root
       */
      parentList.reverse()
      for (const index in parentList)
        if (parentList[index].permissions)
          for (const permission of parentList[index].permissions)
            if (permission.id === userId) parentList.splice(0, index)
    }

    getPermission(parentList, userId) {
      /**
       * @summary - get highest role from reverse root
       */
      for (const index in parentList)
        if (parentList[index].permissions)
          for (const permission of parentList[index].permissions)
            if (permission.id === userId) return permission.role
      return "editor"
    }

    async loadPageChunk(block, root) {
      /**
       * @summary - Recursively Get Child List
       */
      if (block.id !== root && block.type === "page") return block

      // Get Content data
      let promiseList = []
      if (block.content) {
        // 1. async call blocks
        let params
        for (const index in block.content) {
          params = { id: block.content[index] }
          if (this.isCol(block.type)) params.query = { $select: NODE_PROPS }
          promiseList.push(this.getRecordValue(params, "block"))
        }
        const children = await Promise.all(promiseList)

        // 2. Filter properties
        block.content = children
        for (const index in children) this.presentFilter(block.content[index])

        // Check Loop
        const parentList = []
        promiseList = []
        for (const index in block.content) {
          if (parentList.includes(block.id)) continue
          promiseList.push(this.loadPageChunk(block.content[index], root))
        }
        await Promise.all(promiseList)
      }
    }

    async getParentList(parent, parentTable, parentList) {
      /**
       * @summary - Recursively Get Parent List - include given id document
       */
      if (parentTable === "space") return
      for (const parent of parentList)
        if (parent === parent.id)
          throw new GeneralError(new Error(`Loop Found : ${parentList}`))

      // Can't know self table
      const blockDoc = await this.getRecordValue(
        { id: parent, query: { $select: PARENT_PROPS } },
        parentTable
      )
      this.presentFilter(blockDoc)
      parentList.push(blockDoc)
      if (blockDoc.parent_id)
        await this.getParentList(
          blockDoc.parent_id,
          blockDoc.parent_table,
          parentList
        )
    }

    async getDescentList(id, descentList) {
      /**
       * @summary - Recursively Get Descent List - include given id document
       */
      for (const descent of descentList) if (id === descent.id) return
      const blockDoc = await this.getRecordValue({ id })
      this.presentFilter(blockDoc)
      descentList.push(blockDoc)
      if (blockDoc.content)
        for (const child of blockDoc.content)
          await this.getDescentList(child, descentList)
      return descentList
    }

    presentFilter(data) {
      /**
       * @summary - For Client, reduce data size
       */
      delete data._id
      delete data.created_at
      delete data.edited_at
      delete data.created_by_table
      delete data.created_by
      delete data.edited_by
      delete data.edited_by_table
    }
  }

export default BlockPresentMixin
