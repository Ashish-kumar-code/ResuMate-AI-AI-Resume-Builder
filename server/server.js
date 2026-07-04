import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js'
import userRouter from './routes/userRoutes.js'
import resumeRouter from './routes/resumeRoutes.js'
import aiRouter from './routes/aiRoutes.js'

const app = express()
const PORT = process.env.PORT || 3000

await connectDB()

app.use(express.json())
app.use(
  cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'].filter(Boolean),
    credentials: true,
  })
)

app.get('/', (req, res) => res.send('Server is live...'))
app.use('/api/users', userRouter)
app.use('/api/resumes', resumeRouter)
app.use('/api/ai', aiRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})