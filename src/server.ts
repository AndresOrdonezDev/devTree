import express from 'express'
import 'dotenv/config'
import routerAuth from './routes/routerAuth'
import { connectDB } from './config/db'
const app = express()
app.use(express.json())
//connection to db
connectDB()
//routing
app.use('/api/auth',routerAuth)

export default app