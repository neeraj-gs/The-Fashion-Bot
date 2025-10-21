import { atom, selector } from 'recoil'
import Cookies from 'js-cookie'

export interface User {
  _id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  shippingAddress?: {
    addressLine1?: string
    addressLine2?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  paymentDetails?: {
    cardNumber?: string
    cardHolderName?: string
    expiryMonth?: string
    expiryYear?: string
    cvv?: string
    billingAddress?: {
      addressLine1?: string
      addressLine2?: string
      city?: string
      state?: string
      zipCode?: string
      country?: string
    }
    sameAsShipping?: boolean
  }
  onBoarded: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const userState = atom<User | null>({
  key: 'userState',
  default: null,
})

export const tokenState = atom<string | null>({
  key: 'tokenState',
  default: Cookies.get('token') || null,
})

export const isAuthenticatedState = selector({
  key: 'isAuthenticatedState',
  get: ({ get }) => {
    const user = get(userState)
    const token = get(tokenState)
    return !!user && !!token
  },
})

export const isOnboardedState = selector({
  key: 'isOnboardedState',
  get: ({ get }) => {
    const user = get(userState)
    if (!user) return false

    // Check onBoarded flag from backend
    return user.onBoarded === true
  },
})
