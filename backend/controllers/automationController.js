import User from '../models/User.js'
import { getAutomationService } from '../services/automationService.js'

// Start Automation - Simple version
export const startAutomation = async (req, res) => {
  try {
    const {
      storeName,
      productUrl,
      size,
      color,
      quantity
    } = req.body

    // Validate required fields
    if (!storeName || !productUrl) {
      return res.status(400).json({
        success: false,
        message: 'Store name and product URL are required'
      })
    }

    // Get user details with all information needed for checkout
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Validate user has complete details
    if (!user.shippingAddress || !user.shippingAddress.addressLine1) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your shipping address before placing an order'
      })
    }

    if (!user.paymentDetails || !user.paymentDetails.cardNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please add payment details before placing an order'
      })
    }

    // Create order data object
    const orderData = {
      storeName: storeName.toUpperCase(),
      productUrl,
      size: size || '',
      color: color || '',
      quantity: quantity || 1
    }

    // Return immediately - automation will run in background
    res.status(202).json({
      success: true,
      message: 'Automation started successfully. The checkout process is running in the background.',
      data: {
        storeName: orderData.storeName,
        productUrl: orderData.productUrl
      }
    })

    // Process automation asynchronously
    processAutomation(orderData, user).catch(err => {
      console.error('Automation error:', err)
    })

  } catch (error) {
    console.error('Start automation error:', error)
    res.status(500).json({
      success: false,
      message: 'Error starting automation',
      error: error.message
    })
  }
}

// Background automation processor
async function processAutomation(orderData, user) {
  try {
    console.log(`\n=== Starting automation for ${orderData.storeName} ===`)
    console.log(`Product URL: ${orderData.productUrl}`)

    // Get the appropriate automation service based on store name
    const automationService = getAutomationService(orderData.storeName, orderData, user)

    // Run the automation
    const result = await automationService.run()

    console.log('=== Automation completed successfully ===')
    console.log(result)
  } catch (error) {
    console.error('=== Automation failed ===')
    console.error('Error:', error.message)
  }
}
