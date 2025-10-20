import User from '../models/User.js'

// Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body

    const updateData = {}
    if (firstName) updateData.firstName = firstName
    if (lastName) updateData.lastName = lastName
    if (phone) updateData.phone = phone

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    })
  }
}

// Update Shipping Address
export const updateShippingAddress = async (req, res) => {
  try {
    const { addressLine1, addressLine2, city, state, zipCode, country } = req.body

    const shippingAddress = {
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country: country || 'USA'
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { shippingAddress } },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Shipping address updated successfully',
      data: { user }
    })
  } catch (error) {
    console.error('Update shipping address error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating shipping address',
      error: error.message
    })
  }
}

// Update Payment Details
export const updatePaymentDetails = async (req, res) => {
  try {
    const {
      cardNumber,
      cardHolderName,
      expiryMonth,
      expiryYear,
      cvv,
      billingAddress,
      sameAsShipping
    } = req.body

    // Note: In production, you should encrypt sensitive payment data
    // or use a payment gateway like Stripe to tokenize cards
    const paymentDetails = {
      cardNumber,
      cardHolderName,
      expiryMonth,
      expiryYear,
      cvv,
      sameAsShipping: sameAsShipping !== undefined ? sameAsShipping : true
    }

    if (billingAddress && !sameAsShipping) {
      paymentDetails.billingAddress = billingAddress
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { paymentDetails } },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Payment details updated successfully',
      data: { user }
    })
  } catch (error) {
    console.error('Update payment details error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating payment details',
      error: error.message
    })
  }
}

// Update All User Details (Combined)
export const updateAllDetails = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      shippingAddress,
      paymentDetails
    } = req.body

    const updateData = {}

    if (firstName) updateData.firstName = firstName
    if (lastName) updateData.lastName = lastName
    if (phone) updateData.phone = phone
    if (shippingAddress) updateData.shippingAddress = shippingAddress
    if (paymentDetails) updateData.paymentDetails = paymentDetails

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'User details updated successfully',
      data: { user }
    })
  } catch (error) {
    console.error('Update all details error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating user details',
      error: error.message
    })
  }
}

// Get User Details
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      data: { user }
    })
  } catch (error) {
    console.error('Get user details error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching user details',
      error: error.message
    })
  }
}
