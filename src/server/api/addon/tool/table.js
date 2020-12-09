import fs from 'fs'
import { DBFFile } from 'dbffile'
import { getRoundWithRoot } from './round'
import csv from 'neat-csv'
import consola from 'consola'

export async function tablePath(round, snap, meta) {
  const roundObj = await getRoundWithRoot(round)
  const root = roundObj.root
  const ext = meta.ext
  const folderPath = `${root}/${snap}/${meta.folder}`
  const filePaths = await fs.promises.readdir(folderPath)
  for (const fileName of filePaths) {
    const fileExt = fileName.split('.').pop()
    if (ext === fileExt) return `${folderPath}/${fileName}`
  }
}

export async function getTable(round, snap, meta) {
  let records
  const path = await tablePath(round, snap, meta)
  if (process.env.target === 'move') consola.info('Path : ', path)
  if (meta.ext === 'dbf') records = await getDbfRecords(path)
  else if (meta.ext === 'csv') records = await getCsvRecords(path)

  const table = records.map(record => {
    const tableElement = {}
    for (const key of Object.keys(meta.column)) {
      const columnName = meta.column[key].name
      const num = meta.column[key].num

      tableElement['round'] = round
      tableElement['snap'] = snap

      if (num) tableElement[key] = Number(record[columnName])
      else tableElement[key] = record[columnName]
    }
    return tableElement
  })
  let filtered = table
  if (meta.filter) filtered = table.filter(record => record[meta.filter])
  return filtered
}

async function getCsvRecords(csvPath) {
  const csvString = await fs.promises.readFile(csvPath)
  return await csv(csvString)
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
