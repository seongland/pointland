import fs from 'fs'
import { DBFFile } from 'dbffile'
import { getRootByRound } from './round'

export async function tablePath(round, snap, meta) {
  const root = getRootByRound(round)
  const ext = meta.ext
  const folderPath = `${root}/${snap}/${meta.folder}`
  const filePaths = await fs.promises.readdir(folderPath)
  for (const fileName of filePaths) {
    const fileExt = fileName.split('.').pop()
    if (ext === fileExt) return `${folderPath}/${fileName}`
  }
}

export async function getTable(round, snap, meta) {
  const path = await tablePath(round, snap, meta)
  const records = await getDbfRecords(path)
  const table = records.map(record => {
    const tableElement = {}
    for (const key of Object.keys(meta.column)) tableElement[key] = record[meta.column[key]]
    return tableElement
  })
  let filtered = table
  if (meta.filter) filtered = table.filter(record => record[meta.filter])
  return filtered
}

export async function getDbfRecord(dbfPath, seq) {
  let records = await getDbfRecords(dbfPath)
  for (let record of records) {
    if (record.id_point == seq) return record
  }
}

export async function getDbfRecords(dbfPath) {
  console.log(dbfPath)
  const dbf = await DBFFile.open(dbfPath)
  return await dbf.readRecords(dbf.recordCount)
}
