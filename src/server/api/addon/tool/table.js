import fs from 'fs'
import { DBFFile } from 'dbffile'
import { getRootByRound } from './round'

const merge = (target, source) => {
  for (let key of Object.keys(source))
    if (source[key] instanceof Object) Object.assign(source[key], merge(target[key], source[key]))
  Object.assign(target || {}, source)
  return target
}

export async function tablePath(round, snap, meta) {
  const root = getRootByRound(round)
  const ext = meta.ext
  const folderPath = `${root}\\${snap}\\${meta.folder}`
  const filePaths = await fs.promises.readdir(folderPath)
  for (const fileName of filePaths) {
    const fileExt = fileName.split('.').pop()
    if (ext === fileExt) return `${folderPath}\\${fileName}`
  }
}

export async function getTable(round, snap, metas) {
  let mergeObj = {}
  for (const meta of metas) {
    const tableObj = {}
    if (meta.ext === 'dbf') {
      const path = await tablePath(round, snap, meta)
      const records = await getDbfRecords(path)
      for (const record of records) {
        const recordObj = {}
        for (const key of Object.keys(meta.column)) recordObj[key] = record[meta.column[key]]
        tableObj[record[meta.key]] = recordObj
      }
    }
    mergeObj = merge(mergeObj, tableObj)
  }
  return Object.values(mergeObj)
}

export async function getDbfRecord(dbfPath, seq) {
  let records = await getDbfRecords(dbfPath)
  for (let record of records) {
    if (record.id_point == seq) return record
  }
}

export async function getDbfRecords(dbfPath) {
  const dbf = await DBFFile.open(dbfPath)
  return await dbf.readRecords(dbf.recordCount)
}
