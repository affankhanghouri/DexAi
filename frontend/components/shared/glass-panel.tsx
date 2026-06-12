import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export function GlassPanel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.055] shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(120deg,rgba(255,255,255,0.16),transparent_35%,rgba(217,255,63,0.08))]",
        className,
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  )
}
