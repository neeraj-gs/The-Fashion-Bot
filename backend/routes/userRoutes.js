import express from 'express'
import {
  updateProfile,
  updateShippingAddress,
  updatePaymentDetails,
  updateAllDetails,
  getUserDetails
} from '../controllers/userController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// All user routes are protected
router.use(authMiddleware)

// Get user details
router.get('/details', getUserDetails)

// Update specific sections
router.put('/profile', updateProfile)
router.put('/shipping', updateShippingAddress)
router.put('/payment', updatePaymentDetails)

// Update all details at once
router.put('/details', updateAllDetails)

export default router
