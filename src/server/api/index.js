import express from 'express'
import upload from './upload'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json({
  limit: "100mb"
}))
app.use(express.urlencoded({
  limit: "100mb"
}))
app.use('/upload', upload)

export default app
