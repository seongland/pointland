const CollectionCreateMixin = (superclass) =>
  class extends superclass {
    async createMain(request, meta) {
      const newCollection = await super.createMain(request, meta)
      return newCollection
    }

    async validateCreate(request, meta) {
      /**
       * @summary - Validate do not need Collection
       */
    }
  }

export default CollectionCreateMixin
