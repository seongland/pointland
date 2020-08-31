import { GeneralError } from "@feathersjs/errors"

const defaultAPIMixin = (superclass) =>
  class extends superclass {
    async getRecordValues(query) {
      /**
       * @summary - return data derived by request query
       * @since - mixin/getRecordValues
       */
      const results = []
      const res = await this.Model.find({ query })
      for (const block of res) {
        delete block._id
        results.push({
          role: "reader",
          value: block
        })
      }
      results.total = res.length
      return results
    }

    async getRecordValue({ id, query }, table) {
      /**
       * @summary - return pure document data
       * @since - mixin/getRecordValue
       */
      if (id === undefined) throw new GeneralError(new Error("Please Give ID!"))

      // Find
      let result
      if (table) {
        const service = this.app.service(table)
        if (!service)
          throw new GeneralError(new Error(`No such Table ${table}`))
        result = await service.find({ query: { id, ...query } })
      } else result = await super.find({ query: { id, ...query } })

      // handle result
      if (!result[0])
        throw new GeneralError(new Error(`${id} in ${table} Not Found!`))
      delete result[0]._id
      return result[0]
    }

    async getDoc(id, table) {
      let doc
      if (!table) doc = await this.Model.findOne({ id }).lean()
      else doc = await this.app.service(table).options.Model.findOne({ id })
      if (!doc) throw new GeneralError(new Error(`No doc ${id} in ${table}`))
      return doc
    }
  }

export default defaultAPIMixin
