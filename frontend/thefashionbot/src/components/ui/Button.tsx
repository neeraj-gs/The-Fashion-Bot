import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const button = cva(
  [
    "relative inline-flex items-center justify-center gap-2.5 select-none whitespace-nowrap",
    "font-mono font-medium uppercase tracking-[0.14em]",
    "transition-[background-color,border-color,color,opacity] duration-300",
    "ease-[cubic-bezier(0.16,1,0.3,1)]",
    "active:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-40",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
  ].join(" "),
  {
    variants: {
      variant: {
        /* The primary action. Vermilion block, near-black ink. */
        signal: "bg-signal text-[#170502] hover:bg-[#ff5432]",
        /* Secondary. Hairline box that brightens. */
        outline:
          "border border-line-strong text-bone hover:border-bone hover:bg-bone/[0.04]",
        /* Tertiary. Text only. */
        ghost: "text-mute hover:text-bone",
        /* Confirmation / completed states. */
        jade: "bg-jade text-[#04140f] hover:bg-[#43d2b3]",
        /* Destructive, but restrained — vermilion is already the action colour. */
        danger:
          "border border-signal/40 text-signal hover:bg-signal-wash hover:border-signal",
      },
      size: {
        sm: "h-9 px-4 text-[10px]",
        md: "h-11 px-6 text-[11px]",
        lg: "h-14 px-8 text-xs",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "signal", size: "md", block: false },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(button({ variant, size, block }), className)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
