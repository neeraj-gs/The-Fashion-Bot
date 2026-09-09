import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { AnimatePresence, motion } from "motion/react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { StatusDot } from "@/components/ui/StatusDot"
import { Mark, Wordmark } from "@/components/chrome/Mark"
import { isAuthenticatedState } from "@/store/authState"
import { RUN_NO, SECTIONS } from "@/lib/site"
import { useScrollToId } from "@/lib/hooks"
import { EASE_OUT_EXPO } from "@/lib/motion"

const NAV = SECTIONS.filter((s) =>
  ["run", "loadout", "lanes", "questions"].includes(s.id)
)

export function TopBar() {
  const navigate = useNavigate()
  const isAuthenticated = useRecoilValue(isAuthenticatedState)
  const scrollToId = useScrollToId()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // The menu takes the whole screen, so the page beneath must not scroll.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    scrollToId(id)
  }

  return (
    <>
      <header
        className={
          "fixed inset-x-0 top-0 z-50 h-16 border-b transition-colors duration-500 " +
          (scrolled
            ? "border-line bg-canvas/85 backdrop-blur-xl"
            : "border-transparent bg-transparent")
        }
      >
        <div className="mx-auto flex h-full w-full max-w-[1560px] items-center gap-6 px-6 lg:px-16">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5"
            aria-label="The Fashion Bot, back to top"
          >
            <Mark />
            <Wordmark className="hidden sm:inline" />
          </button>

          <span aria-hidden className="hidden h-4 w-px bg-line-strong lg:block" />
          <p className="mono-label hidden text-faint lg:block">Run no. {RUN_NO}</p>

          <nav className="ml-auto hidden items-center gap-8 lg:flex">
            {NAV.map((section) => (
              <button
                key={section.id}
                onClick={() => go(section.id)}
                className="mono-label transition-colors duration-300 hover:text-bone"
              >
                {section.label}
              </button>
            ))}

            <span className="mono-label flex items-center gap-2 text-mute">
              <StatusDot tone="live" />
              All lanes up
            </span>
          </nav>

          <div className="ml-auto flex items-center gap-3 lg:ml-0">
            {isAuthenticated ? (
              <Button size="sm" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  className="hidden sm:inline-flex"
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </Button>
                <Button size="sm" onClick={() => navigate("/login")}>
                  Start a run
                </Button>
              </>
            )}

            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid size-9 place-items-center border border-line text-bone transition-colors hover:border-line-strong lg:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-canvas pt-16 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
          >
            <nav className="flex h-full flex-col border-t border-line">
              {SECTIONS.map((section, i) => (
                <motion.button
                  key={section.id}
                  onClick={() => go(section.id)}
                  className="flex flex-1 items-center gap-5 border-b border-line px-6 text-left"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.04 * i,
                    duration: 0.6,
                    ease: EASE_OUT_EXPO,
                  }}
                >
                  <span className="mono-label text-signal">{section.index}</span>
                  <span className="display text-2xl">{section.label}</span>
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
