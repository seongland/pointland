import BlockPresentMixin from "./blocks.api/blocks.present"
import BlockRevisionMixin from "./blocks.api/blocks.revision"

const BlockAPIMixin = (superclass) =>
  class extends BlockRevisionMixin(BlockPresentMixin(superclass)) {
    async roleCheck(target, table, user) {
      if (table === "collection") {
        const collection = await super.getRecordValue({ id: target }, table)
        target = collection.main_view
        table = "block"
      }
      const parentList = []
      await this.getParentList(target, table, parentList)
      const role = this.getPermission(parentList, user)
      return role
    }

    async getRecordValue({ id, query }, table) {
      /**
       * @summary - return pure document data
       * @since - mixin/getRecordValue
       */
      const record = await super.getRecordValue({ id, query }, table)

      // Collection View Exception
      if (this.isCol(record.type)) {
        const collection = await super.getRecordValue(
          { id: record.collection_id, query },
          "collection"
        )
        // View Properties - type, id mixin
        this.injectCollection(record, collection)
        return record
      }

      // Collection Exception - getParentList
      if (table === "collection") {
        record.id = record.main_view
        const mainView = await super.getRecordValue(
          { id: record.main_view, query },
          "block"
        )
        this.injectCollection(mainView, record)
        return mainView
      }
      return record
    }

    injectCollection(view, collection) {
      view.scheme = collection.scheme
      view.main_view = collection.main_view
      view.content = collection.content
      view.bin = collection.bin
    }

    async multiCreate(body, meta) {
      /**
       * @since - POST REST API CALL
       * @summary - Create Blocks of Requests
       * @return - data: [new, parent] per request
       */
    }

    async multiDelete(body, meta) {
      /**
       * @since - POST REST API CALL
       * @summary - Delete Blocks of Requests
       * @return - data: [new, parent] per request
       */
    }
  }

export default BlockAPIMixin
