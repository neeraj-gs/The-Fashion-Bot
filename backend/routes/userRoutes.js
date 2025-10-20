import express from 'express'
import {
  updateAllDetails,
  getUserDetails
} from '../controllers/userController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// All user routes are protected
router.use(authMiddleware)

// Get user details
router.get('/details', getUserDetails)

// Update all details at once
router.put('/details', updateAllDetails)

export default router
