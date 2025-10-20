import express from 'express'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
puppeteer.use(StealthPlugin())
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

// Import routes
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import automationRoutes from './routes/automationRoutes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err)
  })

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Fashion Bot API is running',
    version: '1.0.0'
  })
})

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/automation', automationRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
  console.log(`Health check: http://localhost:${port}/health`)
  console.log(`API Base URL: http://localhost:${port}/api`)
})