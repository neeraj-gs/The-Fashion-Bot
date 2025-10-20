import express from 'express'
import { startAutomation } from '../controllers/automationController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// All automation routes are protected
router.use(authMiddleware)

// Start automation - simple endpoint
router.post('/start', startAutomation)

export default router
