const SpaceCreateMixin = (superclass) =>
  class extends superclass {
    async createMain(request, meta) {
      const newSpace = await super.createMain(request, meta)
      return newSpace
    }

    async validateCreate(request, meta) {
      /**
       * @summary - Validate do not need Collection
       */
    }
  }

export default SpaceCreateMixin
