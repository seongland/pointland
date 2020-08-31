const BlockCreateMixin = (superclass) =>
  class extends superclass {
    async createMain(request, meta) {
      /**
       * @summary - Main Create & Return Data
       */
      let index
      if (request.index) index = request.index
      delete request.index

      const newBlock = await super.createMain(request, meta)

      // Add to Parent Content
      if (!meta.isHistory && request.parent_table !== "space")
        this.addContent(
          { id: request.parent_id, table: request.parent_table },
          { id: newBlock.id, index },
          meta
        )
      return newBlock
    }

    async validateCreate(request, meta) {
      /**
       * @summary - Validate Create Request
       */
      // Filter Input Data
      const validateRecursive = await super.validateCreate(request, meta)

      if (this.isNodeOf(request.parent_table) && request.type !== "page")
        return "collection node should be page"
      if (validateRecursive) return validateRecursive

      if (
        ![
          "table",
          "gallary",
          "map",
          "calander",
          "image",
          "text",
          "page"
        ].includes(request.type)
      )
        return `No such Type ${request.type}`
      if (!request.type) return "Specify Type"
      if (request.collection_id)
        await this.getDoc(request.collection_id, "collection")
    }

    async setCollectionId(request, meta, body) {
      /**
       * @summary - make collection view
       */
      if (!request.collection_id) {
        meta.inner = true
        const service = this.app.service("collection")
        const collection = await service.create(body, meta)
        body.collection_id = collection.id
        return collection
      }
    }

    async setCollectionView(id, body, request, collection) {
      /**
       * @summary - set collection view id to block
       */

      // find because view has no new collection
      collection = await this.getDoc(body.collection_id, "collection")

      // Set collection view
      if (collection.main_view) {
        collection = await this.getDoc(request.collection_id, "collection")
        if (!collection.sub_views) collection.sub_views = []
        collection.sub_views.push(id)
        collection.save()
      } else {
        collection.main_view = id
        collection.save()
      }
    }

    async setSpaceId(request, meta, body) {
      /**
       * @summary - make space view
       */
      if (!request.space_id) {
        meta.inner = true
        const service = this.app.service("space")
        const space = await service.create(body, meta)
        body.space_id = space.id
        return space
      }
    }

    async setSpaceView(id, body, request, space) {
      /**
       * @summary - set space view id to block
       */

      // find because view has no new space
      space = await this.getDoc(body.space_id, "space")

      // Set space view
      if (space.main_view) {
        space = await this.getDoc(request.space_id, "space")
        if (!space.sub_views) space.sub_views = []
        space.sub_views.push(id)
        space.save()
      } else {
        space.main_view = id
        space.save()
      }
    }
  }

export default BlockCreateMixin
