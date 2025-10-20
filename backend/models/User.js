import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  // Basic User Details
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },

  // Shipping Details
  shippingAddress: {
    addressLine1: {
      type: String,
      trim: true
    },
    addressLine2: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true,
    }
  },

  // Payment Details (encrypted/tokenized in production)
  paymentDetails: {
    cardNumber: {
      type: String,
      trim: true
    },
    cardHolderName: {
      type: String,
      trim: true
    },
    expiryMonth: {
      type: String,
      trim: true
    },
    expiryYear: {
      type: String,
      trim: true
    },
    cvv: {
      type: String,
      trim: true
    },
    billingAddress: {
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'USA'
      }
    },
    sameAsShipping: {
      type: Boolean,
      default: true
    }
  },

  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Index for faster queries (unique for email)
userSchema.index({ email: 1 }, { unique: true })

const User = mongoose.model('User', userSchema)

export default User
