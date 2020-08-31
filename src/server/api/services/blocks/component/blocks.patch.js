const BlockPatchMixin = (superclass) =>
  class extends superclass {
    async validatePatch(unpatched, request, inner) {
      const dftFilter = super.validatePatch(unpatched, request, inner)
      if (dftFilter) return dftFilter

      if (request.type === "space_view") return

      // Block Only - Parent Filter
      if (request.parent_id || request.parent_table) {
        if (!(request.parent_id && request.parent_table))
          return "parent_id & parent_table should be same time"
        const parentDoc = await this.getRecordValue(
          { id: request.parent_id },
          request.parent_table
        )
        if (!parentDoc.alive) return `Parent ${request.parent_id} is Dead`
        const parentList = []
        const descentList = []

        // Get list promise
        const gplPromise = this.getParentList(
          request.parent_id,
          request.parent_table,
          parentList
        )
        const gdlPromise = this.getDescentList(request.id, descentList)

        await Promise.all([gdlPromise, gplPromise])

        // Check make loop
        const intersection = parentList.filter((e) =>
          descentList.some((descent) => descent.id === e.id)
        )
        if (intersection.length !== 0)
          return `You cannot move to Descent ${request.parent_id}`
      }
    }

    patchFilter(data) {
      /**
       * @summary - Do Create Block, filter input data
       */
      this.collectionFilter(data)
      super.patchFilter(data)
    }
  }

export default BlockPatchMixin
