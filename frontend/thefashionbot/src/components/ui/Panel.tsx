import { cn } from "@/lib/utils"

/**
 * The house card: a hairline box with corner brackets that catch vermilion on
 * hover. Deliberately square — nothing in this system is a rounded pill.
 */
export function Panel({
  as: Tag = "div",
  active,
  interactive,
  className,
  children,
  ...rest
}: {
  as?: "div" | "article" | "li" | "section"
  active?: boolean
  interactive?: boolean
  className?: string
  children: React.ReactNode
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      data-active={active ? "true" : undefined}
      className={cn(
        "brackets relative border border-line bg-surface",
        "transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        interactive && "hover:border-line-strong hover:bg-raised",
        active && "border-signal/50 bg-signal-wash/40",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}
