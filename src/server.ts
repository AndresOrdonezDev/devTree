import express from 'express'
import 'dotenv/config'
import cors, { CorsOptions } from 'cors'
import routerAuth from './routes/routerAuth'
import { connectDB } from './config/db'
import { corOptions } from './config/cors'
const app = express()
//config cors
app.use(cors(corOptions))
app.use(cors())
app.use(express.json())
//connection to db
connectDB()
//routing
app.use('/api/auth',routerAuth)

export default app