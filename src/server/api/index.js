import express from 'express'
import upload from './upload'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/upload', upload)

export default app
