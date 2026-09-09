import { TopBar } from "@/components/chrome/TopBar"
import { SectionRail } from "@/components/chrome/SectionRail"
import { Ticker } from "@/components/chrome/Ticker"
import { Footer } from "@/components/chrome/Footer"
import { Hero } from "@/sections/Hero"
import { Odds } from "@/sections/Odds"
import { Run } from "@/sections/Run"
import { Loadout } from "@/sections/Loadout"
import { Lanes } from "@/sections/Lanes"
import { Vault } from "@/sections/Vault"
import { Faq } from "@/sections/Faq"
import { Start } from "@/sections/Start"

export function LandingPage() {
  return (
    <div className="relative bg-canvas">
      <TopBar />
      <SectionRail />

      {/* The rail is fixed, so the page sits beside it from lg up. */}
      <main className="lg:pl-14">
        <Hero />
        <Ticker />
        <Odds />
        <Run />
        <Loadout />
        <Lanes />
        <Vault />
        <Faq />
        <Start />
        <Footer />
      </main>
    </div>
  )
}
