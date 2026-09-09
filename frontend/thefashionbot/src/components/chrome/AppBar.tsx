import { useNavigate } from "react-router-dom"
import { useSetRecoilState } from "recoil"
import Cookies from "js-cookie"
import { LogOut } from "lucide-react"
import { Mark, Wordmark } from "@/components/chrome/Mark"
import { StatusDot } from "@/components/ui/StatusDot"
import { userState } from "@/store/authState"
import { RUN_NO } from "@/lib/site"
import { cn } from "@/lib/utils"

type Tab = "dashboard" | "checkout" | "settings"

const TABS: { id: Tab; label: string; to: string }[] = [
  { id: "dashboard", label: "Control room", to: "/dashboard" },
  { id: "checkout", label: "New run", to: "/checkout" },
  { id: "settings", label: "Loadout", to: "/settings" },
]

/**
 * The bar across every signed-in page. Same chrome language as the landing
 * top bar, but it navigates the product rather than the page.
 */
export function AppBar({ current, minimal }: { current?: Tab; minimal?: boolean }) {
  const navigate = useNavigate()
  const setUser = useSetRecoilState(userState)

  const logout = () => {
    Cookies.remove("token")
    setUser(null)
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1560px] items-center gap-6 px-6 lg:px-10">
        <button
          onClick={() => navigate(minimal ? "/" : "/dashboard")}
          className="flex items-center gap-2.5"
          aria-label="The Fashion Bot"
        >
          <Mark />
          <Wordmark className="hidden sm:inline" />
        </button>

        <span aria-hidden className="hidden h-4 w-px bg-line-strong lg:block" />
        <p className="mono-label hidden text-faint lg:block">Run no. {RUN_NO}</p>

        {!minimal && (
          <nav className="ml-auto flex items-center gap-1" aria-label="Product">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(tab.to)}
                aria-current={current === tab.id ? "page" : undefined}
                className={cn(
                  "border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-300",
                  current === tab.id
                    ? "border-signal/50 bg-signal-wash text-signal"
                    : "border-transparent text-mute hover:border-line hover:text-bone"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}

        <div className={cn("flex items-center gap-5", minimal && "ml-auto")}>
          <span className="mono-label hidden items-center gap-2 text-faint sm:flex">
            <StatusDot tone="live" />
            Lanes up
          </span>
          <button
            onClick={logout}
            className="mono-label flex items-center gap-2 text-mute transition-colors hover:text-signal"
          >
            <LogOut className="size-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  )
}
