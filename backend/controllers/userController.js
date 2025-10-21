import User from '../models/User.js'
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

    // Mark user as onboarded when they update their details
    updateData.onBoarded = true

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
