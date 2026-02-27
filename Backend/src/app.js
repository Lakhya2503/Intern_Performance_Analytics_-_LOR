import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

const app = express()

const fileLimit = "10mb"

app.use(cors({
    origin : process.env.CORS,
    Credential : true,
    methods : ["GET", "POST", "PUT", "DELETE"]
}))

app.use(
  express.json({ limit : fileLimit })
)

app.use(
  express.urlencoded({extended : true, limit : fileLimit})
)

app.use(
  express.static('public')
)

app.use(cookieParser())


//defined router
import authRouter from './routes/auth.route.js'
import internRouter from './routes/intern.route.js'

app.use('/api/lor/v1/user' , authRouter)

app.use('/api/lor/v1/intern' , internRouter)


export default app
