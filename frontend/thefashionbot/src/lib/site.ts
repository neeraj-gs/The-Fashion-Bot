/**
 * Every piece of authored copy and structure for the landing page lives here,
 * so the section components stay pure layout.
 */

export interface SectionMeta {
  id: string
  index: string
  label: string
  /** Short form for the fixed left rail. */
  rail: string
}

export const SECTIONS: SectionMeta[] = [
  { id: "drop", index: "01", label: "The Drop", rail: "DROP" },
  { id: "odds", index: "02", label: "The Odds", rail: "ODDS" },
  { id: "run", index: "03", label: "The Run", rail: "RUN" },
  { id: "loadout", index: "04", label: "The Loadout", rail: "LOADOUT" },
  { id: "lanes", index: "05", label: "The Lanes", rail: "LANES" },
  { id: "vault", index: "06", label: "The Vault", rail: "VAULT" },
  { id: "questions", index: "07", label: "Questions", rail: "ASK" },
  { id: "start", index: "08", label: "Start", rail: "START" },
]

/** A fresh serial each load, so the chrome reads as live instrumentation. */
export const RUN_NO = String(Math.floor(Math.random() * 9_000_000_000) + 1_000_000_000)

/* -------------------------------------------------------------------------- */
/* Lanes — the stores the automation backend can actually drive                */
/* -------------------------------------------------------------------------- */

export interface Lane {
  /** The exact value the automation API expects. Empty for lanes not yet live. */
  value: string
  name: string
  domain: string
  status: "live" | "soon"
  /** Tones Fashion needs a garment size; Stanley does not. */
  needsSize: boolean
  note: string
}

export const LANES: Lane[] = [
  {
    value: "Stanley",
    name: "Stanley 1913",
    domain: "stanley1913.com",
    status: "live",
    needsSize: false,
    note: "Drinkware. Colour drops clear fast.",
  },
  {
    value: "TonesFashion",
    name: "Tones Fashion",
    domain: "tonesfashion.com",
    status: "live",
    needsSize: true,
    note: "Apparel. Pick a size and the bot holds it.",
  },
  {
    value: "",
    name: "Nike",
    domain: "nike.com",
    status: "soon",
    needsSize: true,
    note: "In build.",
  },
  {
    value: "",
    name: "Adidas",
    domain: "adidas.com",
    status: "soon",
    needsSize: true,
    note: "In build.",
  },
  {
    value: "",
    name: "Supreme",
    domain: "supremenewyork.com",
    status: "soon",
    needsSize: true,
    note: "In build.",
  },
]

export const LIVE_LANES = LANES.filter((l) => l.status === "live")

export function laneByValue(value: string): Lane | undefined {
  return LANES.find((l) => l.value === value && l.value !== "")
}

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

export const TICKER = [
  "2 lanes live",
  "median run under 30s",
  "one loadout, every store",
  "size held automatically",
  "no form filled twice",
  "runs while you sleep",
  "your card never retyped",
  "built for restocks",
]

export const HERO_STATS = [
  { label: "Setup", value: "2", unit: "min" },
  { label: "Median run", value: "<30", unit: "s" },
  { label: "Lanes live", value: "2", unit: "" },
  { label: "Availability", value: "24/7", unit: "" },
]

/* -------------------------------------------------------------------------- */
/* 02 — The Odds                                                              */
/* -------------------------------------------------------------------------- */

export const ODDS = [
  {
    figure: "8+",
    title: "Fields in the way",
    body: "Name, address, city, postcode, card, expiry, CVV. Every store. Every time. All of it standing between you and an order that is already disappearing.",
  },
  {
    figure: "01",
    title: "Shot at it",
    body: "Limited runs and restocks clear before most carts are finished. There is no second attempt, and refreshing the page is not a strategy.",
  },
  {
    figure: "00",
    title: "Things remembered",
    body: "Guest checkout forgets you the moment the tab closes. Next drop, you type the same postcode you typed last time.",
  },
]

/* -------------------------------------------------------------------------- */
/* 03 — The Run                                                               */
/* -------------------------------------------------------------------------- */

export const RUN_STAGES = [
  {
    step: "01",
    title: "Open the lane",
    body: "You hand over a product URL. The bot opens the store in a real browser session — not a scraped API, the actual page a person would see.",
    tag: "Real browser",
  },
  {
    step: "02",
    title: "Resolve the product",
    body: "It reads the page, finds the variant you asked for, sets the size and the quantity, and puts it in the cart before the listing can change under it.",
    tag: "Size held",
  },
  {
    step: "03",
    title: "Fill the form",
    body: "Shipping, billing, card, expiry, CVV — pulled from the loadout you saved once and typed into the checkout at machine speed.",
    tag: "Zero typing",
  },
  {
    step: "04",
    title: "Confirm",
    body: "The order goes through and you get the outcome. If anything blocks the run, it tells you exactly which stage stopped and why.",
    tag: "Plain outcome",
  },
]

/* -------------------------------------------------------------------------- */
/* 04 — The Loadout                                                           */
/* -------------------------------------------------------------------------- */

export const LOADOUT = [
  {
    title: "Saved once",
    body: "Three short steps and your details are set. Nothing to re-enter on the next run, or the hundred after it.",
  },
  {
    title: "Paste and go",
    body: "A product URL is the entire input. No extension to install, no cart to prepare, no store account to link.",
  },
  {
    title: "Machine speed",
    body: "The form-filling is the part that costs you the drop. That part now takes no time at all.",
  },
  {
    title: "Size aware",
    body: "Lanes that need a garment size take one from you up front and hold it through the whole run.",
  },
  {
    title: "Always awake",
    body: "Restocks do not announce themselves at a convenient hour. The bot does not need one.",
  },
  {
    title: "One outcome",
    body: "Every run ends with a clear answer. Ordered, or stopped at a named stage. Never a spinner that goes nowhere.",
  },
]

/* -------------------------------------------------------------------------- */
/* 06 — The Vault                                                             */
/* -------------------------------------------------------------------------- */

export const VAULT = [
  {
    title: "One loadout",
    body: "Your details are stored against your account and used for nothing except the runs you start yourself.",
  },
  {
    title: "Yours to change",
    body: "Every field in the loadout can be edited or replaced from Settings at any point, with no support ticket in between.",
  },
  {
    title: "Only on lanes you name",
    body: "The bot goes to the URL you give it. It does not browse, it does not shop on your behalf, and it does not act without a run you started.",
  },
]

/* -------------------------------------------------------------------------- */
/* 07 — Questions                                                             */
/* -------------------------------------------------------------------------- */

export const FAQ = [
  {
    q: "Which stores work today?",
    a: "Stanley 1913 and Tones Fashion are live. Nike, Adidas and Supreme are in build. A run against anything else will not have a lane to open.",
  },
  {
    q: "What exactly do I paste?",
    a: "The full product page URL, copied from the address bar of the store. Not a search page and not a cart link — the page for the specific item you want.",
  },
  {
    q: "How long does a run take?",
    a: "Most finish in under thirty seconds. The bot drives a real browser, so the store's own speed sets the floor.",
  },
  {
    q: "What happens if the item is out of stock?",
    a: "The run stops and tells you which stage it stopped at. Nothing is ordered and nothing is charged.",
  },
  {
    q: "Can I change my saved details later?",
    a: "Yes. Settings holds the same three groups you filled in during setup — identity, shipping and payment — and each can be updated on its own.",
  },
  {
    q: "Does it need a browser extension?",
    a: "No. The automation runs server side. You only ever need this site and a product link.",
  },
]
