const collectionTypes = ["table", "gallary", "map", "calander"]
const collectionTables = ["collection", "collections"]

const defaultUsageMixin = (superclass) =>
  class extends superclass {
    isCol(type) {
      return collectionTypes.includes(type)
    }

    isNodeOf(parentTable) {
      return collectionTables.includes(parentTable)
    }
  }

export default defaultUsageMixin
