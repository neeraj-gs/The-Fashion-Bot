import bcrypt from 'bcrypt'
import User from '../models/User.js'
import { generateToken } from '../middleware/auth.js'

// Signup Controller
export const signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      })
    }

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      phone
    })

    await user.save()

    // Generate JWT token
    const token = generateToken(user._id)

    // Return user data without password
    const userResponse = user.toObject()
    delete userResponse.password

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: userResponse,
        token
      }
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    })
  }
}

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      })
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive'
      })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Generate JWT token
    const token = generateToken(user._id)

    // Return user data without password
    const userResponse = user.toObject()
    delete userResponse.password

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    })
  }
}

// Get Current User
export const getCurrentUser = async (req, res) => {
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
    console.error('Get user error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message
    })
  }
}
