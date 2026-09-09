import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSetRecoilState } from "recoil"
import { motion } from "motion/react"
import { z } from "zod"
import Cookies from "js-cookie"
import { AlertCircle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Field } from "@/components/ui/Field"
import { Segmented } from "@/components/ui/Segmented"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { StatusDot } from "@/components/ui/StatusDot"
import { Mark } from "@/components/chrome/Mark"
import { GatePoster } from "@/three/GatePoster"
import { authAPI } from "@/lib/api"
import { userState, tokenState } from "@/store/authState"
import { RUN_NO } from "@/lib/site"
import { EASE_OUT_EXPO } from "@/lib/motion"

const authSchema = z.object({
  email: z.string().email("That does not look like an email address"),
  password: z.string().min(6, "Six characters or more"),
})

type Mode = "login" | "signup"

export function LoginPage() {
  const navigate = useNavigate()
  const setUser = useSetRecoilState(userState)
  const setToken = useSetRecoilState(tokenState)

  const [mode, setMode] = useState<Mode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [apiError, setApiError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const isLogin = mode === "login"

  const validateForm = () => {
    const result = authSchema.safeParse({ email, password })
    if (result.success) {
      setErrors({})
      return true
    }

    const fieldErrors: { email?: string; password?: string } = {}
    for (const issue of result.error.issues) {
      const key = issue.path[0]
      if (key === "email" || key === "password") fieldErrors[key] = issue.message
    }
    setErrors(fieldErrors)
    return false
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError("")

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = isLogin
        ? await authAPI.login(email, password)
        : await authAPI.signup(email, password)

      if (response.data.success) {
        const { user, token } = response.data.data

        Cookies.set("token", token, { expires: 30 })
        setToken(token)
        setUser(user)

        navigate(user.onBoarded ? "/dashboard" : "/onboarding")
      }
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Something went wrong. Try that again."
      setApiError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const switchMode = (next: Mode) => {
    setMode(next)
    setErrors({})
    setApiError("")
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-[1.05fr_1fr]">
      {/* --- The plate: a still of the gate, and the promise. --- */}
      <aside className="relative hidden overflow-hidden border-r border-line bg-void lg:block">
        <GatePoster className="absolute inset-0 size-full opacity-45" />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/30"
        />

        <div className="relative flex h-full flex-col justify-between p-14">
          <div className="flex items-center gap-2.5">
            <Mark />
            <span className="font-display text-sm font-extrabold uppercase tracking-[0.14em] text-bone">
              The Fashion Bot
            </span>
          </div>

          <div>
            <p className="display text-[clamp(2.5rem,4vw,4rem)]">
              Paste a link.
              <br />
              Own it in{" "}
              <span className="counter font-normal tracking-normal">
                thirty seconds.
              </span>
            </p>
            <p className="mt-7 max-w-md text-sm leading-relaxed text-dim">
              Your loadout is filled in once. Every checkout after that is a URL
              and half a minute of nothing to do.
            </p>
          </div>

          <p className="mono-label flex items-center gap-2 text-faint">
            <StatusDot tone="live" />
            All lanes up &middot; Run no. {RUN_NO}
          </p>
        </div>
      </aside>

      {/* --- The form. --- */}
      <main className="flex items-center justify-center px-6 py-14 sm:px-10">
        <motion.div
          className="w-full max-w-[26rem]"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        >
          <button
            onClick={() => navigate("/")}
            className="mono-label group mb-12 flex items-center gap-2 text-faint transition-colors hover:text-bone"
          >
            <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to the landing
          </button>

          <Eyebrow index="00">{isLogin ? "Sign in" : "New account"}</Eyebrow>

          <h1 className="display mt-5 text-4xl sm:text-5xl">
            {isLogin ? "Welcome back." : "Two minutes."}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-dim">
            {isLogin
              ? "Sign in and your loadout is exactly where you left it."
              : "Make an account, build your loadout, and the bot is ready for the next drop."}
          </p>

          <div className="mt-10">
            <Segmented
              label="Sign in or create an account"
              value={mode}
              onChange={switchMode}
              options={[
                { value: "login", label: "Sign in" },
                { value: "signup", label: "Create account" },
              ]}
            />
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
            <Field
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="you@example.com"
              disabled={isLoading}
            />

            <Field
              label="Password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              hint={isLogin ? undefined : "Six characters or more"}
              placeholder="••••••••"
              disabled={isLoading}
            />

            {apiError && (
              <div
                role="alert"
                className="flex items-start gap-3 border border-signal/40 bg-signal-wash px-4 py-3.5"
              >
                <AlertCircle className="mt-px size-4 shrink-0 text-signal" />
                <p className="mono-sm leading-relaxed text-signal">{apiError}</p>
              </div>
            )}

            <Button type="submit" size="lg" block disabled={isLoading} className="group">
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Working
                </>
              ) : (
                <>
                  {isLogin ? "Sign in" : "Create account"}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          {!isLogin && (
            <p className="mono-sm mt-6 leading-relaxed text-faint">
              Next you will fill in your loadout: who you are, where it ships,
              and what pays for it.
            </p>
          )}
        </motion.div>
      </main>
    </div>
  )
}
