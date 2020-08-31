const RecursiveDeleteMixin = (superclass) =>
  class extends superclass {
    removeMain(undeletedData, target, meta) {
      this.recurLifeChange(undeletedData, false)

      // 2. Update Parent bin, content
      const parent = {
        id: undeletedData.parent_id,
        table: undeletedData.parent_table
      }
      this.removeContent(parent, target, meta)

      undeletedData.alive = false
      undeletedData.save()
      return undeletedData
    }

    async removeContent(parent, child, meta) {
      /**
       * @summary - Update Parent - Remove child from content
       * @param child id
       * @since remove
       */
      const parentData = await this.getRecordValue(
        { id: parent.id },
        parent.table
      )
      if (parentData.bin === undefined) parentData.bin = []
      parentData.bin.push(child)
      const index = parentData.content.indexOf(child)
      parentData.content.splice(index, 1)
      const request = {
        content: parentData.content,
        bin: parentData.bin
      }
      meta.query = { id: parent.id }

      // by Calling parent service
      meta.inner = true
      this.app.service(parent.table).patch(parent.id, request, meta)
    }

    async recurLifeChange(parentDoc, life) {
      /**
       * @summary - Recursively revive Children
       * @since revive
       */
      if (this.isCol(parentDoc.type)) {
        // if collection - injection
        const collection = await super.getRecordValue(
          { id: parentDoc.collection_id },
          "collection"
        )
        // View Properties - type, id mixin
        this.injectCollection(parentDoc, collection)
      }

      if (!parentDoc.content) return []
      const promiseList = []
      if (!this.isCol(parentDoc.type) || parentDoc.main_view === parentDoc.id) {
        const blockModel = this.app.service("block").options.Model
        for (const child of parentDoc.content)
          promiseList.push(blockModel.findOne({ id: child }))

        // save child and recursive
        const childList = await Promise.all(promiseList)
        for (const child of childList) {
          // Not recursive when not main view
          child.alive = life
          child.save()
          this.recurLifeChange(child, life)
        }
      }
    }
  }

export default RecursiveDeleteMixin
