import "dotenv/config"
import express from 'express'
import connectDB from './db/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'



const app = express()
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT 



// Routes
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", userRouter)



//DB connection
connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on PORT ${PORT}`)
    })
})
.catch((error) => {
    console.log("MongoDB connection error:", error)
})