import { GeneralError } from "@feathersjs/errors"

const BlockRevisionMixin = (superclass) =>
  class extends superclass {
    async revive(id, meta) {
      /**
       * @summary - Revive Bin function
       */

      if (id === undefined) throw new GeneralError(new Error("Please Give ID!"))

      // 1. Get Block Data and check Exception
      const target = id
      const targetDoc = await super.getRecordValue({ id: target })
      if (targetDoc.alive) throw new GeneralError(new Error(`${id} alive`))
      if (targetDoc.origin) throw new GeneralError(new Error(`${id} : history`))
      const parentId = targetDoc.parent_id
      const parentTable = targetDoc.parent_table
      const parentBlock = await this.getDoc(parentId, parentTable)
      if (!parentBlock.alive)
        throw new GeneralError(new Error(`${parentId} Dead`))
      const unpatched = await this.Model.findOne({ id: target })

      // 3. remove in parent's bin, and revive in parent's content
      const index = parentBlock.bin.indexOf(target)
      if (index !== -1) parentBlock.bin.splice(index, 1)
      parentBlock.content.push(id)
      meta.inner = true
      this.app.service(parentTable).patch(parentId, parentBlock, meta)

      // 4 recursive revive children too (if target has children)
      this.recurLifeChange(targetDoc, true)
      unpatched.alive = true
      unpatched.save()
      return unpatched
    }

    async timeShift(id, meta) {
      /**
       * @summary - Revive History function
       */

      meta.inner = true
      if (id === undefined) throw new GeneralError(new Error("Please Give ID!"))

      // 1. Get Block Data and check Exception
      const history = id
      const historyRecord = await super.getRecordValue({ id: history })
      const originId = historyRecord.origin
      const originDoc = await super.getRecordValue({ id: originId })
      if (historyRecord.alive)
        throw new GeneralError(new Error("Alive Block can't revive"))
      if (!historyRecord.origin)
        throw new GeneralError(new Error("This Block doesn't have origin"))

      // 2. patch by history data to origin
      let response
      // change only content when collection
      if (historyRecord.collection_id) {
        const historyDoc = await super.getDoc(
          historyRecord.collection_id,
          "collection"
        )
        response = await this.app
          .service("collection")
          .patch(originDoc.collection_id, { content: historyDoc.content }, meta)
      } else response = await this.patch(originId, historyRecord, meta)

      // 3. recursively 기존content들 makes alive false
      await this.recurLifeChange(originDoc, false)
      await this.recurLifeChange(response, true)
      return response
    }

    async forgetHistory(id, meta) {
      /**
       * @summary - Permanantly remove History Blocks
       */

      meta.inner = true
      if (id === undefined) throw new GeneralError(new Error("Please Give ID!"))

      // 1. get origin
      const target = id
      const targetDoc = await super.getDoc(target)
      if (targetDoc.alive) throw new GeneralError(new Error(`${id} is Alive`))
      if (!targetDoc.origin)
        throw new GeneralError(new Error(`${id} is not History`))
      let originId = targetDoc.origin
      let originDoc = await super.getDoc(originId)
      if (originDoc.collection_id) {
        originId = originDoc.collection_id
        originDoc = await super.getDoc(originId, "collection")
      }

      // 2. remove in history
      const index = originDoc.history.indexOf(target)
      if (index !== -1) originDoc.history.splice(index, 1)
      originDoc.save()

      // 3. target block도 remove
      meta.permanent = true
      if (targetDoc.collection_id)
        this.app.service("collection").remove(targetDoc.collection_id, meta)
      return await super.remove(target, meta)
    }

    async emptyBin(id, meta) {
      /**
       * @summary - Permanantly remove Deleted Blocks
       */

      meta.inner = true
      if (id === undefined) throw new GeneralError(new Error("Please Give ID!"))

      // 1. Get Block Data and check Exception
      const target = id
      const targetDoc = await super.getDoc(target)
      if (targetDoc.alive) throw new GeneralError(new Error(`${id} is Alive`))
      if (targetDoc.origin)
        throw new GeneralError(new Error(`${id} is not in Bin`))
      // Collection exception
      const isMainView = await this.emptyBinCollection(targetDoc)

      // parent handling
      await this.removeRelative(targetDoc, meta)

      // 4. target block도 remove
      meta.permanent = true
      meta.query = {}
      const deleted = await super.remove(target, meta)
      if (isMainView)
        this.app.service("collection").remove(targetDoc.collection_id, meta)
      meta.permanent = false
      return deleted
    }

    async emptyBinCollection(targetDoc) {
      /**
       * @summary - emptybin collection view handler
       */
      let isMainView
      if (targetDoc.collection_id) {
        const collection = await super.getDoc(
          targetDoc.collection_id,
          "collection"
        )
        if (collection.main_view === targetDoc.id) {
          isMainView = true
          targetDoc.content = collection.content
          targetDoc.bin = collection.bin
          targetDoc.history = collection.history
          targetDoc.sub_views = collection.sub_views
        } else {
          const index = collection.sub_views.indexOf(targetDoc.id)
          if (index !== -1) collection.sub_views.splice(index, 1)
          collection.save()
        }
      }
      return isMainView
    }

    async removeRelative(targetDoc, meta) {
      /**
       * @summary - Remove all relative blocks
       */
      const parentId = targetDoc.parent_id
      const parentTable = targetDoc.parent_table
      const parentBlock = await this.getDoc(parentId, parentTable)
      if (!parentBlock.alive)
        throw new GeneralError(new Error(`${parentId} Dead`))
      let doc
      // await since main_view - origin should be alive
      const promiseList = []
      if (targetDoc.bin)
        for (doc of targetDoc.bin) promiseList.push(this.emptyBin(doc, meta))
      if (targetDoc.history)
        for (doc of targetDoc.history)
          promiseList.push(this.forgetHistory(doc, meta))
      // 2. remove all contents of target
      if (targetDoc.sub_views)
        promiseList.push(this.deleteList(targetDoc.sub_views, meta))
      if (targetDoc.content)
        promiseList.push(this.deleteList(targetDoc.content, meta))
      await Promise.all(promiseList)
      // 3. remove in parent's bin
      const index = parentBlock.bin.indexOf(targetDoc.id)
      if (index !== -1) parentBlock.bin.splice(index, 1)
      parentBlock.save()
    }

    async deleteList(list, meta) {
      /**
       * @summary - recursive call in empty bin function
       */
      for (const id of list) {
        await this.remove(id, meta)
        await this.emptyBin(id, meta)
      }
    }
  }

export default BlockRevisionMixin
