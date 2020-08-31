/**
 * @summary - Recursive Create Mixin
 */

const RecursiveCreateMixin = (superclass) =>
  class extends superclass {
    async createMain(request, meta) {
      /**
       * @summary - Main Create & Return Data
       */
      request.created_by_table = "user"
      request.created_by = meta.user.id

      if (meta.isHistory) this.deadFilter(request)
      const newDoc = await super.create(request, meta)
      return newDoc
    }

    async validateCreate(request, meta) {
      /**
       * @summary - Validate Create Request
       */
      // Parent Table Required
      if (!request.parent_id || !request.parent_table)
        return "Specify parent_id & parent_table"

      if (!meta.inner && request.id) return "you can't set id"

      // Cannot Edit Dead Parent
      if (request.parent_table === "space") return
      const parentBlock = await this.getRecordValue(
        { id: request.parent_id },
        request.parent_table
      )
      if (!parentBlock.alive) return `There is Dead Parent ${request.parent_id}`
    }

    createFilter(data) {
      this.collectionFilter(data)
      delete data._id
      delete data.origin
      delete data.alive
      delete data.created_at
      delete data.created_by_table
      delete data.created_by
      delete data.edited_at
      delete data.edtied_by
      delete data.edited_by_table
      delete data.bin
      delete data.history
      delete data.content
    }

    historyFilter(data) {
      this.collectionFilter(data)
      delete data._id
      delete data.created_at
      delete data.created_by_table
      delete data.created_by
      delete data.edited_at
      delete data.edtied_by
      delete data.edited_by_table
      delete data.bin
      delete data.history
    }
  }

export default RecursiveCreateMixin
