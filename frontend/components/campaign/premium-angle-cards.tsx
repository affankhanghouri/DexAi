"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  Check,
  Flame,
  Lightbulb,
  MousePointerClick,
  Sparkles,
  Target,
  Zap,
} from "lucide-react"
import type { ReactNode } from "react"

export type PremiumAngleCardData = {
  angle_id: string
  title: string
  description: string
  why_it_works: string
  buyer_trigger: string
  recommended_for: string
  confidence?: number | null
}

export function PremiumAngleCards({
  angles,
  selectedAngleId,
  isSelecting,
  onSelect,
}: {
  angles: PremiumAngleCardData[]
  selectedAngleId: string
  isSelecting?: boolean
  onSelect: (angle: PremiumAngleCardData) => void
}) {
  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[1.5rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(217,255,63,0.16),transparent_42%),linear-gradient(315deg,rgba(249,115,22,0.12),transparent_48%)]" />

        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
              Strategy selection
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.07em] text-white">
              Pick the story your product should tell.
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-white/55">
              These are not random ideas. Dhoom created them from Brand DNA,
              Product DNA, buyer objections, and Pakistani social-commerce
              behavior.
            </p>
          </div>

          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816] shadow-[0_0_45px_rgba(217,255,63,0.24)]">
            <Brain size={26} />
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {angles.map((angle, index) => (
          <PremiumAngleCard
            key={angle.angle_id}
            angle={angle}
            index={index}
            selected={selectedAngleId === angle.angle_id}
            disabled={isSelecting}
            onClick={() => onSelect(angle)}
          />
        ))}
      </div>
    </div>
  )
}

function PremiumAngleCard({
  angle,
  index,
  selected,
  disabled,
  onClick,
}: {
  angle: PremiumAngleCardData
  index: number
  selected: boolean
  disabled?: boolean
  onClick: () => void
}) {
  const visual = getAngleVisual(index)
  const confidence = Math.round((angle.confidence || 0.75) * 100)

  return (
    <motion.button
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06, duration: 0.36 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative min-h-[360px] overflow-hidden rounded-[1.55rem] border p-4 text-left transition",
        selected
          ? "border-[#d9ff3f]/60 bg-[#d9ff3f]/10 shadow-[0_0_70px_rgba(217,255,63,0.16)]"
          : "border-white/10 bg-white/[0.045] hover:border-orange-400/35 hover:bg-white/[0.075]",
        disabled && "cursor-wait opacity-70",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-80",
          visual.background,
        )}
      />

      <div className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-white/10 blur-xl transition duration-700 group-hover:translate-x-[120%]" />

      {selected && (
        <motion.div
          layoutId="selectedAngleGlow"
          className="pointer-events-none absolute inset-0 border-2 border-[#d9ff3f]/50"
        />
      )}

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div
            className={cn(
              "grid h-12 w-12 place-items-center rounded-2xl shadow-[0_0_35px_rgba(217,255,63,0.16)]",
              selected
                ? "bg-[#d9ff3f] text-[#070816]"
                : "bg-white/[0.07] text-white/58",
            )}
          >
            {selected ? <Check size={22} /> : visual.icon}
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-[0.56rem] font-black uppercase tracking-[0.16em]",
                selected
                  ? "border-[#d9ff3f]/25 bg-[#d9ff3f]/15 text-[#d9ff3f]"
                  : "border-white/10 bg-white/[0.055] text-white/40",
              )}
            >
              {selected ? "Selected" : `Angle ${index + 1}`}
            </span>

            <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[0.56rem] font-black uppercase tracking-[0.14em] text-white/40">
              {confidence}% signal
            </span>
          </div>
        </div>

        <h3 className="text-3xl font-black tracking-[-0.075em] text-white">
          {angle.title}
        </h3>

        <p className="mt-3 text-sm font-bold leading-7 text-white/58">
          {angle.description}
        </p>

        <div className="mt-5 grid gap-3">
          <InsightBlock
            icon={<Target size={15} />}
            label="Buyer trigger"
            value={angle.buyer_trigger}
          />

          <InsightBlock
            icon={<Lightbulb size={15} />}
            label="Why it works"
            value={angle.why_it_works}
          />

          <InsightBlock
            icon={<BadgeCheck size={15} />}
            label="Best for"
            value={angle.recommended_for}
          />
        </div>

        <div className="mt-auto pt-5">
          <div
            className={cn(
              "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black transition",
              selected
                ? "bg-[#d9ff3f] text-[#070816]"
                : "border border-white/10 bg-white/[0.065] text-white/70 group-hover:bg-[#d9ff3f] group-hover:text-[#070816]",
            )}
          >
            {selected ? (
              <>
                <Check size={17} />
                Direction selected
              </>
            ) : (
              <>
                <MousePointerClick size={17} />
                Choose this direction
                <ArrowRight size={16} />
              </>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  )
}

function InsightBlock({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <div className="mb-2 flex items-center gap-2 text-orange-300">
        {icon}
        <p className="text-[0.55rem] font-black uppercase tracking-[0.18em]">
          {label}
        </p>
      </div>

      <p className="text-xs font-bold leading-5 text-white/58">{value}</p>
    </div>
  )
}

function getAngleVisual(index: number) {
  const visuals = [
    {
      icon: <Sparkles size={22} />,
      background:
        "bg-[linear-gradient(135deg,rgba(217,255,63,0.16),transparent_42%)]",
    },
    {
      icon: <Flame size={22} />,
      background:
        "bg-[linear-gradient(315deg,rgba(249,115,22,0.18),transparent_44%)]",
    },
    {
      icon: <Zap size={22} />,
      background:
        "bg-[linear-gradient(135deg,rgba(255,255,255,0.1),transparent_42%)]",
    },
    {
      icon: <Target size={22} />,
      background:
        "bg-[linear-gradient(135deg,rgba(217,255,63,0.12),transparent_42%),linear-gradient(315deg,rgba(249,115,22,0.1),transparent_48%)]",
    },
  ]

  return visuals[index % visuals.length]
}
