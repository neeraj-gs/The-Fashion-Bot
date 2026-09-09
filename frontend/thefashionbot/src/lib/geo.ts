/**
 * The onboarding form previously offered seven US states, which left anyone
 * from the other forty-three unable to finish setup at all.
 */
export const US_STATES: { code: string; name: string }[] = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
]

export const COUNTRIES = [
  { code: "USA", name: "United States" },
  { code: "Canada", name: "Canada" },
  { code: "UK", name: "United Kingdom" },
  { code: "India", name: "India" },
]

/** Groups a card number into fours for display without touching the stored value. */
export function formatCardNumber(digits: string): string {
  return (digits.match(/.{1,4}/g) ?? []).join(" ")
}

/** Best-effort issuer from the leading digits. Display only. */
export function cardBrand(digits: string): string {
  if (/^4/.test(digits)) return "VISA"
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "MASTERCARD"
  if (/^3[47]/.test(digits)) return "AMEX"
  if (/^6(?:011|5)/.test(digits)) return "DISCOVER"
  if (/^3(?:0[0-5]|[68])/.test(digits)) return "DINERS"
  if (/^(?:2131|1800|35)/.test(digits)) return "JCB"
  return "CARD"
}

export function maskCard(digits: string): string {
  if (!digits) return "—"
  const last4 = digits.slice(-4)
  return "•••• •••• •••• " + last4
}
