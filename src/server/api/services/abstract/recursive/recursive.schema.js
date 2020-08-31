/**
 * @summary - Recursive Class Schema to use at another real model
 */

import mongoose from "mongoose"
import defaultSchema from "../default/default.schema"
import formatSchema from "./innerSchema/format"
import permissionSchema from "./innerSchema/permission"

export default (app) => {
  const recursiveSchemaMixin = {
    // Main Data
    created_by: { type: String, default: undefined },
    created_by_table: { type: String, default: undefined },
    format: { type: formatSchema, default: undefined },
    properties: { type: Map, of: mongoose.Schema.Types.Mixed },
    permissions: { type: [permissionSchema], default: undefined },

    // Recursive Data
    content: { type: [String], default: undefined },
    bin: { type: [String], default: undefined },
    parent_id: { type: String, default: undefined },
    parent_table: { type: String, default: undefined }
  }
  const recursiveSchema = defaultSchema(app).add(recursiveSchemaMixin)
  return recursiveSchema
}
