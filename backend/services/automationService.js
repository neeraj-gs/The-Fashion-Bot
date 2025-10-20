import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

puppeteer.use(StealthPlugin())

// Helper function - simple sleep/wait
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Base automation class
class BaseAutomation {
  constructor(orderData, user) {
    this.orderData = orderData
    this.user = user
    this.browser = null
    this.page = null
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: false, // Set to true in production
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
      ]
    })
    this.page = await this.browser.newPage()
    await this.page.setViewport({ width: 1920, height: 1080 })
  }

  log(message) {
    console.log(`[LOG] ${message}`)
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close()
    }
  }
}

// ============================================================================
// TONES FASHION AUTOMATION (Shopify Store)
// ============================================================================
class TonesFashionAutomation extends BaseAutomation {
  async run() {
    try {
      await this.init()
      this.log('> Starting Tones Fashion Automation...')

      // Level 1: Navigate to Product
      await this.navigateToProduct()
      await sleep(2000)

      // Level 2: Select Size
      await this.selectSize()
      await sleep(1000)

      // Level 3: Add to Cart
      await this.addToCart()
      await sleep(2000)

      // Level 4: Proceed to Checkout
      await this.proceedToCheckout()
      await sleep(3000)

      // Level 5: Fill Shipping Details
      await this.fillShippingDetails()
      await sleep(2000)

      // Level 6: Fill Payment Details
      await this.fillPaymentDetails()
      await sleep(2000)

      // Level 7: Complete Checkout (COMMENTED OUT FOR SAFETY)
      // await this.completeCheckout()

      this.log(' Tones Fashion automation completed successfully!')
      this.log('�  CHECKOUT COMPLETION IS COMMENTED OUT FOR SAFETY')

      // Keep browser open to review
      await sleep(10000)

      return { success: true, message: 'Tones Fashion order automation completed' }
    } catch (error) {
      this.log(`L Error: ${error.message}`)
      throw error
    } finally {
      await this.cleanup()
    }
  }

  // Level 1: Navigate to Product
  async navigateToProduct() {
    this.log(`Navigating to product: ${this.orderData.productUrl}`)
    await this.page.goto(this.orderData.productUrl, { waitUntil: 'networkidle2' })

    // Verify product page loaded
    const isLoaded = await this.page.evaluate(() => {
      const addToCartBtn = document.querySelector('.single-add-to-cart-button') ||
                           document.querySelector('button[name="add"]') ||
                           document.querySelector('#AddToCart')
      return !!addToCartBtn
    })

    if (!isLoaded) {
      throw new Error('Failed to load product page')
    }

    this.log(' Product page loaded')
  }

  // Level 2: Select Size
  async selectSize() {
    if (!this.orderData.size) {
      this.log('�  No size specified, using default selection')
      return
    }

    this.log(`Selecting size: ${this.orderData.size}`)

    const success = await this.page.evaluate((size) => {
      // Find size radio buttons (Tones Fashion uses radio inputs)
      const sizeInputs = document.querySelectorAll('input[name="Size"]')

      for (const input of sizeInputs) {
        if (input.value.toUpperCase() === size.toUpperCase()) {
          input.checked = true
          input.click()

          // Trigger change event
          input.dispatchEvent(new Event('change', { bubbles: true }))

          return true
        }
      }
      return false
    }, this.orderData.size)

    if (success) {
      this.log(` Selected size: ${this.orderData.size}`)
    } else {
      this.log(`�  Could not find size: ${this.orderData.size}, using default`)
    }

    await sleep(500)
  }

  // Level 3: Add to Cart
  async addToCart() {
    this.log('Adding to cart...')

    const success = await this.page.evaluate(() => {
      // Multiple selector strategies for add to cart button
      const button = document.querySelector('.single-add-to-cart-button') ||
                     document.querySelector('button[name="add"]') ||
                     document.querySelector('#AddToCart') ||
                     document.querySelector('[data-testid="add-to-cart"]')

      if (button && !button.disabled) {
        button.click()
        return true
      }
      return false
    })

    if (!success) {
      throw new Error('Failed to add to cart')
    }

    this.log(' Added to cart')
    await sleep(2000)
  }

  // Level 4: Proceed to Checkout
  async proceedToCheckout() {
    this.log('Proceeding to checkout...')

    // Wait for cart notification/drawer to appear
    await sleep(2000)

    // Shopify stores typically redirect to /checkout or have a checkout button
    const success = await this.page.evaluate(() => {
      // Find checkout button with multiple strategies
      const button = document.querySelector('button[name="checkout"]') ||
                     document.querySelector('.cart__checkout') ||
                     document.querySelector('a[href="/checkout"]') ||
                     document.querySelector('button[aria-label="Checkout"]') ||
                     Array.from(document.querySelectorAll('button, a')).find(el =>
                       el.textContent.toLowerCase().includes('checkout')
                     )

      if (button) {
        button.click()
        return true
      }

      // Fallback: Navigate directly to checkout
      window.location.href = '/checkout'
      return true
    })

    if (!success) {
      throw new Error('Failed to proceed to checkout')
    }

    this.log(' Proceeding to checkout')

    // Wait for checkout page to load
    await sleep(3000)
  }

  // Level 5: Fill Shipping Details
  async fillShippingDetails() {
    this.log('Filling shipping details...')

    const { user } = this
    const shipping = user.shippingAddress

    try {
      // Fill email
      await this.page.waitForSelector('input[name="email"], input[type="email"]', { timeout: 5000 })

      const detailsFilled = await this.page.evaluate((details) => {
        // Helper function to fill input fields with proper event dispatching
        const fillInput = (selector, value) => {
          const input = document.querySelector(selector)
          if (input) {
            input.value = value
            input.dispatchEvent(new Event('input', { bubbles: true }))
            input.dispatchEvent(new Event('change', { bubbles: true }))
            input.dispatchEvent(new Event('blur', { bubbles: true }))
            return true
          }
          return false
        }

        // Helper function to select dropdown option
        const selectOption = (selector, value) => {
          const select = document.querySelector(selector)
          if (select) {
            select.value = value
            select.dispatchEvent(new Event('change', { bubbles: true }))
            return true
          }
          return false
        }

        try {
          // Fill email
          fillInput('input[name="email"]', details.email) ||
          fillInput('input[type="email"]', details.email)

          // Fill first name
          fillInput('input[name="firstName"]', details.firstName) ||
          fillInput('input[id*="firstName"]', details.firstName)

          // Fill last name
          fillInput('input[name="lastName"]', details.lastName) ||
          fillInput('input[id*="lastName"]', details.lastName)

          // Fill address
          fillInput('input[name="address1"]', details.address) ||
          fillInput('input[id*="address1"]', details.address)

          // Fill apartment (optional)
          if (details.apartment) {
            fillInput('input[name="address2"]', details.apartment) ||
            fillInput('input[id*="address2"]', details.apartment)
          }

          // Fill city
          fillInput('input[name="city"]', details.city) ||
          fillInput('input[id*="city"]', details.city)

          // Fill ZIP code
          fillInput('input[name="postalCode"]', details.zipCode) ||
          fillInput('input[name="zip"]', details.zipCode) ||
          fillInput('input[id*="zip"]', details.zipCode)

          // Select country (if needed)
          selectOption('select[name="country"]', details.country || 'India') ||
          selectOption('select[id*="country"]', details.country || 'India')

          // Select state/province
          selectOption('select[name="zone"]', details.state) ||
          selectOption('select[name="province"]', details.state) ||
          selectOption('select[id*="province"]', details.state)

          // Fill phone
          fillInput('input[name="phone"]', details.phone) ||
          fillInput('input[type="tel"]', details.phone)

          return true
        } catch (error) {
          console.error('Error filling form:', error)
          return false
        }
      }, {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: shipping.addressLine1,
        apartment: shipping.addressLine2,
        city: shipping.city,
        state: shipping.state,
        zipCode: shipping.zipCode,
        country: shipping.country || 'India',
        phone: user.phone
      })

      if (!detailsFilled) {
        throw new Error('Failed to fill some shipping details')
      }

      this.log(' Shipping details filled')
      await sleep(2000)

      // Click "Continue to shipping" button
      const clicked = await this.page.evaluate(() => {
        const buttons = document.querySelectorAll('button[type="submit"]')
        for (const button of buttons) {
          const text = button.textContent || button.innerText || ''
          if (text.includes('Continue') || text.includes('shipping')) {
            button.click()
            return true
          }
        }

        // Fallback: click any submit button
        if (buttons.length > 0) {
          buttons[0].click()
          return true
        }
        return false
      })

      if (clicked) {
        this.log(' Clicked continue to shipping')
        await sleep(4000)

        // Click "Continue to payment" button if present
        const clicked2 = await this.page.evaluate(() => {
          const buttons = document.querySelectorAll('button[type="submit"]')
          for (const button of buttons) {
            const text = button.textContent || button.innerText || ''
            if (text.includes('Continue') || text.includes('payment')) {
              button.click()
              return true
            }
          }
          return false
        })

        if (clicked2) {
          this.log(' Clicked continue to payment')
          await sleep(3000)
        }
      }

    } catch (error) {
      this.log(`�  Error filling shipping details: ${error.message}`)
      throw error
    }
  }

  // Level 6: Fill Payment Details
  async fillPaymentDetails() {
    this.log('Filling payment details...')

    const payment = this.user.paymentDetails

    try {
      await sleep(3000)

      // Shopify payment fields are in iframes
      const frames = this.page.frames()

      let numberFilled = false
      let expiryFilled = false
      let cvvFilled = false
      let nameFilled = false

      // Find and fill card fields in iframes
      for (const frame of frames) {
        const frameUrl = frame.url()

        try {
          // Card number iframe
          if (frameUrl.includes('number') && !numberFilled) {
            await frame.waitForSelector('input[name="number"]', { timeout: 2000 })
            await frame.type('input[name="number"]', payment.cardNumber, { delay: 100 })
            this.log(' Filled card number')
            numberFilled = true
            await sleep(500)
          }

          // Expiry iframe (format: MM / YY)
          if (frameUrl.includes('expiry') && !expiryFilled) {
            await frame.waitForSelector('input[name="expiry"]', { timeout: 2000 })
            const expiryValue = `${payment.expiryMonth} / ${payment.expiryYear}`
            await frame.type('input[name="expiry"]', expiryValue, { delay: 100 })
            this.log(` Filled expiry: ${expiryValue}`)
            expiryFilled = true
            await sleep(500)
          }

          // CVV iframe
          if (frameUrl.includes('verification_value') && !cvvFilled) {
            await frame.waitForSelector('input[name="verification_value"]', { timeout: 2000 })
            await frame.type('input[name="verification_value"]', payment.cvv, { delay: 100 })
            this.log(' Filled CVV')
            cvvFilled = true
            await sleep(500)
          }

          // Name on card iframe
          if (frameUrl.includes('name') && !nameFilled) {
            await frame.waitForSelector('input[name="name"]', { timeout: 2000 })

            // Clear existing value first
            await frame.evaluate(() => {
              const input = document.querySelector('input[name="name"]')
              if (input) input.value = ''
            })

            await frame.type('input[name="name"]', payment.cardHolderName, { delay: 100 })
            this.log(' Filled name on card')
            nameFilled = true
            await sleep(500)
          }
        } catch (frameError) {
          // Continue to next frame if this one fails
          continue
        }
      }

      // Verify all fields were filled
      if (!numberFilled || !expiryFilled || !cvvFilled || !nameFilled) {
        this.log('�  Some card fields may not have been filled:')
        this.log(`  Number: ${numberFilled ? '' : 'L'}`)
        this.log(`  Expiry: ${expiryFilled ? '' : 'L'}`)
        this.log(`  CVV: ${cvvFilled ? '' : 'L'}`)
        this.log(`  Name: ${nameFilled ? '' : 'L'}`)
      } else {
        this.log(' All payment details filled')
      }

    } catch (error) {
      this.log(`�  Error filling payment details: ${error.message}`)
      throw error
    }
  }

  // Level 7: Complete Checkout (COMMENTED OUT FOR SAFETY)
  async completeCheckout() {
    this.log('Completing checkout...')

    await sleep(2000)

    const success = await this.page.evaluate(() => {
      const buttons = document.querySelectorAll('button[type="submit"]')
      for (const button of buttons) {
        const text = button.textContent || button.innerText || ''
        if (text.includes('Pay now') || text.includes('Complete order')) {
          button.click()
          return true
        }
      }
      return false
    })

    if (!success) {
      throw new Error('Failed to complete checkout')
    }

    this.log(' Order placed!')
    await sleep(5000)
  }
}

// ============================================================================
// STANLEY 1913 AUTOMATION (Working Reference Implementation)
// ============================================================================
class StanleyAutomation extends BaseAutomation {
  async run() {
    try {
      await this.init()
      this.log('🤖 Starting Stanley 1913 Automation...')

      // Level 1: Navigate to Product
      const navigated = await this.navigateToProduct()
      if (!navigated) throw new Error('Failed at Level 1: Navigation')
      await sleep(2000)

      // Level 2: Add to Cart
      const addedToCart = await this.addToCart()
      if (!addedToCart) throw new Error('Failed at Level 2: Add to Cart')
      await sleep(2000)

      // Level 3: Proceed to Checkout
      const proceededToCheckout = await this.proceedToCheckout()
      if (!proceededToCheckout) throw new Error('Failed at Level 3: Checkout Navigation')
      await sleep(3000)

      // Level 4: Fill Shipping Details
      const detailsFilled = await this.fillShippingDetails()
      if (!detailsFilled) this.log('⚠️ Warning: Some shipping details may be incomplete')
      await sleep(2000)

      // Level 5: Fill Payment Details
      const paymentFilled = await this.fillPaymentDetails()
      if (!paymentFilled) this.log('⚠️ Warning: Payment details may be incomplete')
      await sleep(2000)

      // Level 6: Complete Checkout (COMMENTED OUT FOR SAFETY)
      // const orderCompleted = await this.completeCheckout()
      // if (!orderCompleted) throw new Error('Failed at Level 6: Order Completion')

      this.log('✅ All automation steps completed successfully!')
      this.log('⚠️  CHECKOUT COMPLETION IS COMMENTED OUT FOR SAFETY')
      this.log('⚠️  Uncomment Level 6 in code to actually place the order')

      // Keep browser open to review
      await sleep(10000)

      return { success: true, message: 'Stanley order automation completed' }
    } catch (error) {
      this.log(`❌ Automation failed: ${error.message}`)
      throw error
    } finally {
      await this.cleanup()
    }
  }

  // Level 1: Navigate to Product URL
  async navigateToProduct() {
    this.log(`Navigating to product: ${this.orderData.productUrl}`)
    await this.page.goto(this.orderData.productUrl)

    // Verify add to cart button exists using evaluate with fallback strategy
    const isLoaded = await this.page.evaluate(() => {
      const button = document.querySelector('[data-testid="buy-buttons-add-to-cart"]') ||
                     document.querySelector('[data-add-to-cart]') ||
                     document.querySelector('button[name="add"]')
      return !!button
    })

    if (isLoaded) {
      this.log('✅ Product page loaded')
    }

    return isLoaded
  }

  // Level 2: Add to Cart
  async addToCart() {
    await sleep(1000)

    this.log('Adding to cart...')

    const success = await this.page.evaluate(() => {
      const button = document.querySelector('[data-testid="buy-buttons-add-to-cart"]') ||
                     document.querySelector('[data-add-to-cart]') ||
                     document.querySelector('button[name="add"]')

      if (button && !button.disabled) {
        button.click()
        return true
      }
      return false
    })

    if (success) {
      this.log('✅ Added to cart')
    }

    return success
  }

  // Level 3: Proceed to Checkout
  async proceedToCheckout() {
    await sleep(2000)

    this.log('Proceeding to checkout...')

    const success = await this.page.evaluate(() => {
      // Find checkout button with multiple strategies
      const button = document.querySelector('button[name="checkout"]') ||
                     document.querySelector('.cart__checkout') ||
                     document.querySelector('button[aria-label="Checkout"]')

      if (button) {
        // Option 1: Use onclick if available (Stanley uses this)
        if (button.onclick) {
          button.onclick()
          return true
        }
        // Option 2: Direct navigation
        if (button.hasAttribute('onclick')) {
          window.location.href = '/checkout'
          return true
        }
        // Option 3: Regular click
        button.click()
        return true
      }
      return false
    })

    await sleep(2000)

    if (success) {
      this.log('✅ Proceeding to checkout')
    }

    return success
  }

  // Level 4: Fill Shipping/Billing Details
  async fillShippingDetails() {
    await sleep(2000)

    this.log('Filling shipping details...')

    const { user } = this
    const shipping = user.shippingAddress

    const success = await this.page.evaluate((details) => {
      // Helper function to fill input fields
      const fillInput = (selector, value) => {
        const input = document.querySelector(selector)
        if (input) {
          input.value = value
          input.dispatchEvent(new Event('input', { bubbles: true }))
          input.dispatchEvent(new Event('change', { bubbles: true }))
          return true
        }
        return false
      }

      // Helper function to select dropdown option
      const selectOption = (selector, value) => {
        const select = document.querySelector(selector)
        if (select) {
          select.value = value
          select.dispatchEvent(new Event('change', { bubbles: true }))
          return true
        }
        return false
      }

      try {
        // Fill email
        fillInput('input[name="email"]', details.email)

        // Fill first name
        fillInput('input[name="firstName"]', details.firstName)

        // Fill last name
        fillInput('input[name="lastName"]', details.lastName)

        // Fill address
        fillInput('input[name="address1"]', details.address)

        // Fill apartment (optional)
        if (details.apartment) {
          fillInput('input[name="address2"]', details.apartment)
        }

        // Fill city
        fillInput('input[name="city"]', details.city)

        // Select state
        selectOption('select[name="zone"]', details.state)

        // Fill ZIP code
        fillInput('input[name="postalCode"]', details.zipCode)

        // Fill phone
        fillInput('input[name="phone"]', details.phone)

        return true
      } catch (error) {
        console.error('Error filling form:', error)
        return false
      }
    }, {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      address: shipping.addressLine1,
      apartment: shipping.addressLine2 || '',
      city: shipping.city,
      state: shipping.state,
      zipCode: shipping.zipCode,
      phone: user.phone
    })

    await sleep(1000)

    // Click "Continue to shipping" button
    const clicked1 = await this.page.evaluate(() => {
      const buttons = document.querySelectorAll('button[type="submit"]')
      for (const button of buttons) {
        if (button.textContent.includes('Continue to shipping')) {
          button.click()
          return true
        }
      }
      return false
    })

    if (clicked1) {
      this.log('✅ Clicked "Continue to shipping"')
      await sleep(4000)

      // Click "Continue to payment" button
      const clicked2 = await this.page.evaluate(() => {
        const buttons = document.querySelectorAll('button[type="submit"]')
        for (const button of buttons) {
          const text = button.textContent || button.innerText || ''
          if (text.includes('Continue to payment')) {
            button.click()
            return true
          }
        }
        return false
      })

      if (clicked2) {
        this.log('✅ Clicked "Continue to payment"')
        await sleep(3000)
      } else {
        this.log('❌ Could not find "Continue to payment" button')
      }
    } else {
      this.log('❌ Could not find "Continue to shipping" button')
    }

    return success && clicked1
  }

  // Level 5: Fill Payment/Card Details
  async fillPaymentDetails() {
    await sleep(3000)

    this.log('Filling payment details...')

    const payment = this.user.paymentDetails

    try {
      const frames = this.page.frames()

      let numberFilled = false
      let expiryFilled = false
      let cvvFilled = false
      let nameFilled = false

      // Find and fill card fields in iframes (only once each)
      for (const frame of frames) {
        const frameUrl = frame.url()

        try {
          // Card number iframe
          if (frameUrl.includes('number') && !numberFilled) {
            await frame.type('input[name="number"]', payment.cardNumber, { delay: 100 })
            this.log('✅ Filled card number')
            numberFilled = true
            await sleep(500)
          }

          // Expiry iframe (format: MM / YY with spaces and slash)
          if (frameUrl.includes('expiry') && !expiryFilled) {
            const expiryValue = `${payment.expiryMonth} / ${payment.expiryYear}`
            await frame.type('input[name="expiry"]', expiryValue, { delay: 100 })
            this.log(`✅ Filled expiry: ${expiryValue}`)
            expiryFilled = true
            await sleep(500)
          }

          // CVV iframe
          if (frameUrl.includes('verification_value') && !cvvFilled) {
            await frame.type('input[name="verification_value"]', payment.cvv, { delay: 100 })
            this.log('✅ Filled CVV')
            cvvFilled = true
            await sleep(500)
          }

          // Name on card iframe
          if (frameUrl.includes('name') && !nameFilled) {
            // Clear existing value first (it's prefilled)
            await frame.evaluate(() => {
              const input = document.querySelector('input[name="name"]')
              if (input) {
                input.value = ''
              }
            })

            await frame.type('input[name="name"]', payment.cardHolderName, { delay: 100 })
            this.log('✅ Filled name on card')
            nameFilled = true
            await sleep(500)
          }
        } catch (frameError) {
          // Continue to next frame if this one fails
          continue
        }
      }

      // Verify all fields were filled
      if (!numberFilled || !expiryFilled || !cvvFilled || !nameFilled) {
        this.log('⚠️ Some card fields may not have been filled')
        this.log(`  Number: ${numberFilled ? '✅' : '❌'}`)
        this.log(`  Expiry: ${expiryFilled ? '✅' : '❌'}`)
        this.log(`  CVV: ${cvvFilled ? '✅' : '❌'}`)
        this.log(`  Name: ${nameFilled ? '✅' : '❌'}`)
      }

      return true
    } catch (error) {
      this.log(`❌ Error filling card details: ${error.message}`)
      return false
    }
  }

  // Level 6: Complete Checkout (COMMENTED OUT FOR SAFETY)
  async completeCheckout() {
    await sleep(2000)

    this.log('Completing checkout...')

    const success = await this.page.evaluate(() => {
      const button = document.querySelector('button[type="submit"]')
      if (button && button.textContent.includes('Pay now')) {
        button.click()
        return true
      }
      return false
    })

    await sleep(2000)

    if (success) {
      this.log('✅ Order placed!')
    }

    return success
  }
}

// ============================================================================
// OTHER STORE AUTOMATIONS (Templates)
// ============================================================================

// Nike Automation
class NikeAutomation extends BaseAutomation {
  async run() {
    try {
      await this.init()
      this.log('Starting Nike automation')
      await this.page.goto(this.orderData.productUrl, { waitUntil: 'networkidle2' })

      this.log('Nike automation - implement specific logic here')
      this.log('Use TonesFashion as reference and adapt selectors for Nike')

      await sleep(5000)
      return { success: true, message: 'Nike automation template' }
    } catch (error) {
      this.log(`Error: ${error.message}`)
      throw error
    } finally {
      await this.cleanup()
    }
  }
}

// Adidas Automation
class AdidasAutomation extends BaseAutomation {
  async run() {
    try {
      await this.init()
      this.log('Starting Adidas automation')
      await this.page.goto(this.orderData.productUrl, { waitUntil: 'networkidle2' })

      this.log('Adidas automation - implement specific logic here')

      await sleep(5000)
      return { success: true, message: 'Adidas automation template' }
    } catch (error) {
      this.log(`Error: ${error.message}`)
      throw error
    } finally {
      await this.cleanup()
    }
  }
}

// Amazon Automation
class AmazonAutomation extends BaseAutomation {
  async run() {
    try {
      await this.init()
      this.log('Starting Amazon automation')
      await this.page.goto(this.orderData.productUrl, { waitUntil: 'networkidle2' })

      this.log('Amazon automation - implement specific logic here')

      await sleep(5000)
      return { success: true, message: 'Amazon automation template' }
    } catch (error) {
      this.log(`Error: ${error.message}`)
      throw error
    } finally {
      await this.cleanup()
    }
  }
}

// Generic Store Automation
class GenericStoreAutomation extends BaseAutomation {
  async run() {
    try {
      await this.init()
      this.log('Starting generic store automation')
      await this.page.goto(this.orderData.productUrl, { waitUntil: 'networkidle2' })

      this.log('Generic store automation - implement specific logic for your store')

      await sleep(5000)
      return { success: true, message: 'Generic automation template' }
    } catch (error) {
      this.log(`Error: ${error.message}`)
      throw error
    } finally {
      await this.cleanup()
    }
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

export const getAutomationService = (storeName, orderData, user) => {
  switch (storeName.toUpperCase()) {
    case 'STANLEY':
    case 'STANLEY1913':
      return new StanleyAutomation(orderData, user)
    case 'TONESFASHION':
    case 'TONES':
      return new TonesFashionAutomation(orderData, user)
    case 'NIKE':
      return new NikeAutomation(orderData, user)
    case 'ADIDAS':
      return new AdidasAutomation(orderData, user)
    case 'AMAZON':
      return new AmazonAutomation(orderData, user)
    default:
      return new GenericStoreAutomation(orderData, user)
  }
}

export default {
  getAutomationService
}
