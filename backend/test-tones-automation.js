// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

puppeteer.use(StealthPlugin())

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  productURL: 'https://www.tonesfashion.com/products/karma-jet-black-shirt?variant=49601271103681',
  userDetails: {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main Street',
    apartment: 'Apt 4B',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    phone: '9876543210'
  },
  cardDetails: {
    cardNumber: '4242424242424242',
    cardName: 'John Doe',
    expiryMonth: '12',
    expiryYear: '25',
    cvv: '123'
  },
  size: 'L', // S, M, L, XL, XXL
  headless: false,
  timeout: 30000
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// ============================================================================
// LEVEL 1: NAVIGATE TO PRODUCT URL
// ============================================================================

async function navigateToProduct(page, productURL) {
  // Navigate to product page
  await page.goto(productURL, { waitUntil: 'networkidle2' })

  // Verify add to cart button exists
  const isLoaded = await page.evaluate(() => {
    const button = document.querySelector('.single-add-to-cart-button') ||
                   document.querySelector('button[name="add"]') ||
                   document.querySelector('#AddToCart')
    return !!button
  })

  return isLoaded
}

// ============================================================================
// LEVEL 2: SELECT SIZE
// ============================================================================

async function selectSize(page, size) {
  if (!size) {
    console.log('⚠️  No size specified, using default selection')
    return true
  }

  console.log(`Selecting size: ${size}`)

  const success = await page.evaluate((selectedSize) => {
    // Find size radio buttons (Tones Fashion uses radio inputs)
    const sizeInputs = document.querySelectorAll('input[name="Size"]')

    for (const input of sizeInputs) {
      if (input.value.toUpperCase() === selectedSize.toUpperCase()) {
        input.checked = true
        input.click()

        // Trigger change event
        input.dispatchEvent(new Event('change', { bubbles: true }))

        return true
      }
    }
    return false
  }, size)

  if (success) {
    console.log(`✅ Selected size: ${size}`)
  } else {
    console.log(`⚠️ Could not find size: ${size}, using default`)
  }

  return success
}

// ============================================================================
// LEVEL 3: ADD TO CART
// ============================================================================

async function addToCart(page) {
  await sleep(1000)

  console.log('Adding to cart...')

  const success = await page.evaluate(() => {
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

  if (success) {
    console.log('✅ Added to cart')
  }

  return success
}

// ============================================================================
// LEVEL 4: PROCEED TO CHECKOUT
// ============================================================================

async function proceedToCheckout(page) {
  // Wait for cart drawer to appear
  await sleep(2000)

  console.log('Proceeding to checkout...')

  // Shopify stores typically redirect to /checkout or have a checkout button
  const success = await page.evaluate(() => {
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

  // Wait for navigation to checkout
  await sleep(2000)

  if (success) {
    console.log('✅ Proceeding to checkout')
  }

  return success
}

// ============================================================================
// LEVEL 5: FILL SHIPPING/BILLING DETAILS
// ============================================================================

async function fillShippingDetails(page, userDetails) {
  // Wait for checkout page to load
  await sleep(2000)

  console.log('Filling shipping details...')

  // Fill shipping details form using evaluate
  const success = await page.evaluate((details) => {
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
      selectOption('select[name="country"]', 'India') ||
      selectOption('select[id*="country"]', 'India')

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
  }, userDetails)

  // Wait for form to process
  await sleep(1000)

  // Click "Continue to shipping" button
  const clicked1 = await page.evaluate(() => {
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

  if (!clicked1) {
    console.log('❌ Could not find "Continue to shipping" button')
    return false
  }

  console.log('✅ Clicked "Continue to shipping"')

  // Wait for shipping method page to load
  await sleep(4000)

  // Click "Continue to payment" button
  const clicked2 = await page.evaluate(() => {
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

  if (!clicked2) {
    console.log('❌ Could not find "Continue to payment" button')
    return false
  }

  console.log('✅ Clicked "Continue to payment"')

  // Wait for payment page to load
  await sleep(3000)

  return success && clicked1 && clicked2
}

// ============================================================================
// LEVEL 6: FILL PAYMENT/CARD DETAILS
// ============================================================================

async function fillPaymentDetails(page, cardDetails) {
  // Wait for payment page to load
  await sleep(3000)

  console.log('Filling payment details...')

  // Card fields are in iframes - we need to access them differently
  const frames = page.frames()

  try {
    let numberFilled = false
    let expiryFilled = false
    let cvvFilled = false
    let nameFilled = false

    // Find and fill card fields in iframes (only once each)
    for (const frame of frames) {
      const frameUrl = frame.url()

      // Card number iframe
      if (frameUrl.includes('number') && !numberFilled) {
        await frame.type('input[name="number"]', cardDetails.cardNumber, { delay: 100 })
        console.log('✅ Filled card number')
        numberFilled = true
        await sleep(500)
      }

      // Expiry iframe (format: MM / YY with spaces and slash)
      if (frameUrl.includes('expiry') && !expiryFilled) {
        const expiryValue = `${cardDetails.expiryMonth} / ${cardDetails.expiryYear}`
        await frame.type('input[name="expiry"]', expiryValue, { delay: 100 })
        console.log(`✅ Filled expiry: ${expiryValue}`)
        expiryFilled = true
        await sleep(500)
      }

      // CVV iframe
      if (frameUrl.includes('verification_value') && !cvvFilled) {
        await frame.type('input[name="verification_value"]', cardDetails.cvv, { delay: 100 })
        console.log('✅ Filled CVV')
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

        // Now type the new value
        await frame.type('input[name="name"]', cardDetails.cardName, { delay: 100 })
        console.log('✅ Filled name on card')
        nameFilled = true
        await sleep(500)
      }
    }

    // Verify all fields were filled
    if (!numberFilled || !expiryFilled || !cvvFilled || !nameFilled) {
      console.log('⚠️ Some card fields may not have been filled')
      console.log(`  Number: ${numberFilled ? '✅' : '❌'}`)
      console.log(`  Expiry: ${expiryFilled ? '✅' : '❌'}`)
      console.log(`  CVV: ${cvvFilled ? '✅' : '❌'}`)
      console.log(`  Name: ${nameFilled ? '✅' : '❌'}`)
    }

    return true
  } catch (error) {
    console.error('❌ Error filling card details:', error)
    return false
  }
}

// ============================================================================
// LEVEL 7: COMPLETE CHECKOUT (INITIATES RAZORPAY REDIRECT)
// ============================================================================

async function completeCheckout(page) {
  // Wait for card validation
  await sleep(2000)

  console.log('Completing checkout...')

  // Click "Pay now" button
  const success = await page.evaluate(() => {
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

  // Wait for Razorpay redirect
  await sleep(3000)

  if (success) {
    console.log('✅ Checkout initiated - waiting for Razorpay redirect...')
  }

  return success
}

// ============================================================================
// LEVEL 8: HANDLE RAZORPAY PAYMENT
// ============================================================================

async function handleRazorpayPayment(page, cardDetails) {
  console.log('\n🔄 Handling Razorpay payment...')

  // Wait for Razorpay hosted checkout page to load
  console.log('Waiting for Razorpay page to load...')

  try {
    await page.waitForNavigation({
      waitUntil: 'networkidle2',
      timeout: 15000
    }).catch(() => console.log('Navigation settled'))
  } catch (e) {
    // Navigation may have already completed
  }

  await sleep(3000)

  // Verify we're on Razorpay hosted checkout
  const currentURL = page.url()
  console.log(`Current URL: ${currentURL}`)

  if (!currentURL.includes('razorpay.com')) {
    console.log('⚠️ Not on Razorpay page yet, waiting...')
    await sleep(3000)
  }

  // Wait longer for Razorpay page to fully render
  await sleep(5000)

  console.log('✅ Razorpay checkout page loaded')

  // Step 1: Click on "Cards" payment method to reveal the form
  console.log('Clicking on Cards payment method...')

  // Click the radio input inside the label for Cards
  const cardsClicked = await page.evaluate(() => {
    // Find all radio inputs with name="radio-0"
    const radios = document.querySelectorAll('input[type="radio"][name="radio-0"]')

    for (const radio of radios) {
      // Get the parent label
      const label = radio.closest('label')
      if (label) {
        // Check if this label contains Cards
        const cardsSpan = label.querySelector('[data-testid="Cards"]')
        if (cardsSpan) {
          // Found the Cards option - click the radio input
          radio.click()
          return true
        }
      }
    }
    return false
  })

  if (!cardsClicked) {
    console.log('❌ Could not find Cards payment option')

    // Debug: Print available payment options
    const availableOptions = await page.evaluate(() => {
      const options = document.querySelectorAll('[data-value]')
      return Array.from(options).map(opt => ({
        value: opt.getAttribute('data-value'),
        index: opt.getAttribute('data-index')
      }))
    })
    console.log('Available payment options:', JSON.stringify(availableOptions, null, 2))

    return false
  }

  console.log('✅ Clicked Cards payment method successfully')

  // Wait for card form to appear after clicking
  await sleep(3000)

  // Wait for card number input to be visible
  await page.waitForSelector('input[name="card.number"]', { timeout: 10000 }).catch(() => {
    console.log('⚠️ Card form may not have appeared')
  })

  console.log('✅ Card details form is now visible')

  // Step 2: Fill card details
  console.log('Filling card details...')

  // Fill card number
  const cardNumberFilled = await page.evaluate((cardNumber) => {
    const input = document.querySelector('input[name="card.number"]')
    if (input) {
      input.value = cardNumber
      input.dispatchEvent(new Event('input', { bubbles: true }))
      input.dispatchEvent(new Event('change', { bubbles: true }))
      input.dispatchEvent(new Event('blur', { bubbles: true }))
      return true
    }
    return false
  }, cardDetails.cardNumber)

  if (cardNumberFilled) {
    console.log('✅ Filled card number')
  } else {
    console.log('❌ Could not fill card number')
  }

  await sleep(500)

  // Fill expiry date (format: MM / YY)
  const expiryValue = `${cardDetails.expiryMonth} / ${cardDetails.expiryYear}`
  const expiryFilled = await page.evaluate((expiry) => {
    const input = document.querySelector('input[name="card.expiry"]')
    if (input) {
      input.value = expiry
      input.dispatchEvent(new Event('input', { bubbles: true }))
      input.dispatchEvent(new Event('change', { bubbles: true }))
      input.dispatchEvent(new Event('blur', { bubbles: true }))
      return true
    }
    return false
  }, expiryValue)

  if (expiryFilled) {
    console.log(`✅ Filled expiry: ${expiryValue}`)
  } else {
    console.log('❌ Could not fill expiry date')
  }

  await sleep(500)

  // Fill CVV
  const cvvFilled = await page.evaluate((cvv) => {
    const input = document.querySelector('input[name="card.cvv"]')
    if (input) {
      input.value = cvv
      input.dispatchEvent(new Event('input', { bubbles: true }))
      input.dispatchEvent(new Event('change', { bubbles: true }))
      input.dispatchEvent(new Event('blur', { bubbles: true }))
      return true
    }
    return false
  }, cardDetails.cvv)

  if (cvvFilled) {
    console.log('✅ Filled CVV')
  } else {
    console.log('❌ Could not fill CVV')
  }

  await sleep(1000)

  // Step 3: Click Continue button
  console.log('Clicking Continue button...')

  const continueClicked = await page.evaluate(() => {
    // Find Continue button by data-test-id
    const button = document.querySelector('[data-test-id="add-card-cta"]') ||
                   document.querySelector('button[validateform="true"]')

    if (button && !button.disabled) {
      button.click()
      return true
    }

    // Fallback: Find by text content
    const buttons = Array.from(document.querySelectorAll('button'))
    for (const btn of buttons) {
      if (btn.textContent.trim() === 'Continue' && !btn.disabled) {
        btn.click()
        return true
      }
    }

    return false
  })

  if (continueClicked) {
    console.log('✅ Clicked Continue button')
  } else {
    console.log('❌ Could not click Continue button')
    return false
  }

  // Wait for payment processing
  await sleep(3000)

  console.log('✅ Razorpay payment form submitted')

  return cardNumberFilled && expiryFilled && cvvFilled && continueClicked
}

// ============================================================================
// MAIN ORCHESTRATION FUNCTION
// ============================================================================

async function automatePurchase() {
  const browser = await puppeteer.launch({
    headless: CONFIG.headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized' // Start browser maximized
    ]
  })

  const page = await browser.newPage()

  // Set viewport to full screen - No need to set viewport, maximized handles it

  try {
    console.log('\n🤖 Starting Tones Fashion Automation Bot...\n')

    // LEVEL 1: Navigate to Product
    const navigated = await navigateToProduct(page, CONFIG.productURL)
    if (!navigated) throw new Error('Failed at Level 1: Navigation')

    await sleep(2000)

    // LEVEL 2: Select Size
    const sizeSelected = await selectSize(page, CONFIG.size)
    // Continue even if size selection fails (will use default)

    await sleep(1000)

    // LEVEL 3: Add to Cart
    const addedToCart = await addToCart(page)
    if (!addedToCart) throw new Error('Failed at Level 3: Add to Cart')

    await sleep(2000)

    // LEVEL 4: Proceed to Checkout
    const proceededToCheckout = await proceedToCheckout(page)
    if (!proceededToCheckout) throw new Error('Failed at Level 4: Checkout Navigation')

    await sleep(3000)

    // LEVEL 5: Fill Shipping Details
    const detailsFilled = await fillShippingDetails(page, CONFIG.userDetails)
    if (!detailsFilled) console.warn('⚠️ Warning: Some shipping details may be incomplete')

    await sleep(2000)

    // LEVEL 6: Fill Payment Details
    const paymentFilled = await fillPaymentDetails(page, CONFIG.cardDetails)
    if (!paymentFilled) console.warn('⚠️ Warning: Payment details may be incomplete')

    await sleep(2000)

    // LEVEL 7: Complete Checkout (Initiates Razorpay redirect)
    const orderCompleted = await completeCheckout(page)
    if (!orderCompleted) throw new Error('Failed at Level 7: Order Completion')

    await sleep(3000)

    // LEVEL 8: Handle Razorpay Payment
    const razorpayCompleted = await handleRazorpayPayment(page, CONFIG.cardDetails)
    if (!razorpayCompleted) console.warn('⚠️ Warning: Razorpay payment may be incomplete')

    console.log('\n⚠️  PAYMENT SUBMISSION COMPLETED - VERIFY TRANSACTION STATUS')
    console.log('⚠️  This is a test automation - ensure you use test cards only\n')

    console.log('\n✅ All automation steps completed successfully!\n')

    // Keep browser open to review
    await sleep(100000)

  } catch (error) {
    console.error(`\n❌ Automation failed: ${error.message}\n`)

    // Take screenshot on error
    // await page.screenshot({ path: 'error-screenshot.png', fullPage: true })
    // console.log('📸 Error screenshot saved as error-screenshot.png')
  } finally {
    await browser.close()
  }
}

// ============================================================================
// RUN THE BOT
// ============================================================================

// Execute the automation
automatePurchase().catch(console.error)
