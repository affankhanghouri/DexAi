"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Clapperboard,
  Copy,
  Flame,
  Gem,
  ImageIcon,
  Layers3,
  Loader2,
  MessageCircle,
  MousePointerClick,
  Palette,
  PenLine,
  RefreshCw,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react"
import { useState } from "react"

export type PremiumVariantCardData = {
  variant_id: string
  name: string
  description: string
  visual_direction: string
  caption_style: string
  whatsapp_style: string
  poster_layout: string
  why_it_fits: string
  confidence?: number | null
  refinement_count?: number | null
  is_refined?: boolean | null
}

export function PremiumVariantCarousel({
  variants,
  selectedVariantId,
  isSelecting,
  isRefining,
  refiningVariantId,
  onSelect,
  onRefine,
}: {
  variants: PremiumVariantCardData[]
  selectedVariantId: string
  isSelecting?: boolean
  isRefining?: boolean
  refiningVariantId?: string
  onSelect: (variant: PremiumVariantCardData) => void
  onRefine: (variantId: string, instruction: string) => void
}) {
  const [activeVariantId, setActiveVariantId] = useState(
    selectedVariantId || variants[0]?.variant_id || "",
  )

  const activeVariant =
    variants.find((variant) => variant.variant_id === activeVariantId) ||
    variants[0]

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[1.5rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(217,255,63,0.18),transparent_34%),radial-gradient(circle_at_88%_34%,rgba(249,115,22,0.14),transparent_36%)]" />

        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
              Creative execution
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.07em] text-white">
              Pick the campaign vibe.
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-white/55">
              Dhoom prepared different visual and copy styles. Choose the one
              that feels right for your store today.
            </p>
          </div>

          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816] shadow-[0_0_45px_rgba(217,255,63,0.24)]">
            <Layers3 size={26} />
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <div className="grid gap-4">
          {variants.map((variant, index) => (
            <PremiumVariantCard
              key={variant.variant_id}
              variant={variant}
              index={index}
              active={activeVariant?.variant_id === variant.variant_id}
              selected={selectedVariantId === variant.variant_id}
              disabled={isSelecting}
              isRefining={isRefining && refiningVariantId === variant.variant_id}
              onPreview={() => setActiveVariantId(variant.variant_id)}
              onSelect={() => onSelect(variant)}
            />
          ))}
        </div>

        {activeVariant && (
          <PremiumVariantPreview
            variant={activeVariant}
            selected={selectedVariantId === activeVariant.variant_id}
            isSelecting={isSelecting}
            isRefining={isRefining && refiningVariantId === activeVariant.variant_id}
            onSelect={() => onSelect(activeVariant)}
            onRefine={(instruction) =>
              onRefine(activeVariant.variant_id, instruction)
            }
          />
        )}
      </section>
    </div>
  )
}

function PremiumVariantCard({
  variant,
  index,
  active,
  selected,
  disabled,
  isRefining,
  onPreview,
  onSelect,
}: {
  variant: PremiumVariantCardData
  index: number
  active: boolean
  selected: boolean
  disabled?: boolean
  isRefining?: boolean
  onPreview: () => void
  onSelect: () => void
}) {
  const visual = getVariantVisual(index)
  const confidence = Math.round((variant.confidence || 0.75) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06, duration: 0.36 }}
      className={cn(
        "group relative overflow-hidden rounded-[1.45rem] border p-4 transition",
        active
          ? "border-orange-400/45 bg-orange-500/10"
          : "border-white/10 bg-white/[0.045] hover:border-orange-400/35 hover:bg-white/[0.075]",
        selected && "border-[#d9ff3f]/60 bg-[#d9ff3f]/10 shadow-[0_0_70px_rgba(217,255,63,0.14)]",
      )}
    >
      <div className={cn("pointer-events-none absolute inset-0", visual.bg)} />
      <div className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-white/10 blur-xl transition duration-700 group-hover:translate-x-[120%]" />

      <div className="relative z-10 grid gap-4 md:grid-cols-[64px_1fr_auto] md:items-center">
        <button
          onClick={onPreview}
          className={cn(
            "grid h-14 w-14 place-items-center rounded-2xl transition",
            selected
              ? "bg-[#d9ff3f] text-[#070816]"
              : active
                ? "bg-orange-400 text-[#070816]"
                : "bg-white/[0.07] text-white/55",
          )}
        >
          {isRefining ? (
            <Loader2 size={22} className="animate-spin" />
          ) : selected ? (
            <Check size={22} />
          ) : (
            visual.icon
          )}
        </button>

        <button onClick={onPreview} className="min-w-0 text-left">
          <div className="mb-2 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[0.56rem] font-black uppercase tracking-[0.14em] text-white/40">
              Variant {index + 1}
            </span>

            <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[0.56rem] font-black uppercase tracking-[0.14em] text-white/40">
              {confidence}% fit
            </span>

            {variant.is_refined && (
              <span className="rounded-full border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 px-3 py-1 text-[0.56rem] font-black uppercase tracking-[0.14em] text-[#d9ff3f]">
                Refined {variant.refinement_count || 1}x
              </span>
            )}
          </div>

          <h3 className="truncate text-2xl font-black tracking-[-0.06em] text-white">
            {variant.name}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm font-bold leading-6 text-white/50">
            {variant.description}
          </p>
        </button>

        <button
          onClick={onSelect}
          disabled={disabled}
          className={cn(
            "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 text-xs font-black transition disabled:cursor-wait disabled:opacity-50",
            selected
              ? "bg-[#d9ff3f] text-[#070816]"
              : "border border-white/10 bg-white/[0.065] text-white/70 hover:bg-[#d9ff3f] hover:text-[#070816]",
          )}
        >
          {selected ? (
            <>
              <Check size={15} />
              Selected
            </>
          ) : (
            <>
              Choose
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}

function PremiumVariantPreview({
  variant,
  selected,
  isSelecting,
  isRefining,
  onSelect,
  onRefine,
}: {
  variant: PremiumVariantCardData
  selected: boolean
  isSelecting?: boolean
  isRefining?: boolean
  onSelect: () => void
  onRefine: (instruction: string) => void
}) {
  const [instruction, setInstruction] = useState("")

  const quickRefines = [
    "Make this more premium and cleaner.",
    "Make this bolder and more sales-driven.",
    "Make this more lifestyle and relatable.",
  ]

  function submitRefine(value?: string) {
    const finalInstruction = (value || instruction).trim()
    if (!finalInstruction) return
    onRefine(finalInstruction)
    setInstruction("")
  }

  return (
    <div className="sticky top-5 space-y-4">
      <section className="relative overflow-hidden rounded-[1.55rem] border border-white/10 bg-[#0d0d13]/92 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(217,255,63,0.13),transparent_45%)]" />

        <div className="relative z-10">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
                Variant preview
              </p>

              <h3 className="mt-2 text-3xl font-black tracking-[-0.075em] text-white">
                {variant.name}
              </h3>
            </div>

            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
              <Palette size={22} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/35 p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(217,255,63,0.14),transparent_45%)]" />

            <div className="relative z-10 space-y-3">
              <MockPosterPreview variant={variant} />

              <VariantDetailBlock
                icon={<ImageIcon size={15} />}
                label="Visual direction"
                value={variant.visual_direction}
              />

              <VariantDetailBlock
                icon={<PenLine size={15} />}
                label="Caption style"
                value={variant.caption_style}
              />

              <VariantDetailBlock
                icon={<MessageCircle size={15} />}
                label="WhatsApp style"
                value={variant.whatsapp_style}
              />

              <VariantDetailBlock
                icon={<Copy size={15} />}
                label="Poster layout"
                value={variant.poster_layout}
              />

              <VariantDetailBlock
                icon={<BadgeCheck size={15} />}
                label="Why it fits"
                value={variant.why_it_fits}
              />
            </div>
          </div>

          <button
            onClick={onSelect}
            disabled={isSelecting}
            className={cn(
              "mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black transition disabled:cursor-wait disabled:opacity-50",
              selected
                ? "bg-[#d9ff3f] text-[#070816]"
                : "bg-gradient-to-r from-orange-500 to-[#d9ff3f] text-[#070816]",
            )}
          >
            {isSelecting ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Locking variant...
              </>
            ) : selected ? (
              <>
                <Check size={17} />
                Creative vibe selected
              </>
            ) : (
              <>
                <MousePointerClick size={17} />
                Choose this creative vibe
              </>
            )}
          </button>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[1.45rem] border border-orange-400/20 bg-orange-500/10 p-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(249,115,22,0.18),transparent_40%)]" />

        <div className="relative z-10">
          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
            Ghost refine variant
          </p>

          <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-white">
            Adjust before choosing
          </h3>

          <p className="mt-2 text-sm font-bold leading-6 text-white/48">
            Keep the strategy, but refine the creative vibe with one sentence.
          </p>

          <div className="mt-4 grid gap-2">
            {quickRefines.map((command) => (
              <button
                key={command}
                onClick={() => submitRefine(command)}
                disabled={isRefining}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-3 text-xs font-black text-white/68 transition hover:bg-white/[0.09] disabled:cursor-wait disabled:opacity-50"
              >
                {isRefining ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : null}
                {command}
              </button>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <input
              value={instruction}
              onChange={(event) => setInstruction(event.target.value)}
              disabled={isRefining}
              placeholder="e.g. Make this more elegant for Eid..."
              className="min-h-11 flex-1 rounded-xl border border-white/10 bg-black/25 px-3 text-sm font-bold text-white outline-none placeholder:text-white/28"
            />

            <button
              onClick={() => submitRefine()}
              disabled={isRefining || !instruction.trim()}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#d9ff3f] px-4 text-xs font-black text-[#070816] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRefining ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Wand2 size={15} />
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function MockPosterPreview({ variant }: { variant: PremiumVariantCardData }) {
  return (
    <div className="relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#070816] p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(217,255,63,0.16),transparent_42%),radial-gradient(circle_at_20%_80%,rgba(249,115,22,0.14),transparent_38%)]" />

      <div className="relative z-10">
        <div className="mb-10 flex justify-between">
          <div className="h-3 w-20 rounded-full bg-[#d9ff3f]/70" />
          <div className="h-3 w-10 rounded-full bg-white/20" />
        </div>

        <div className="mx-auto grid aspect-square w-36 place-items-center rounded-[2rem] border border-white/10 bg-white/[0.06]">
          <Gem size={44} className="text-[#d9ff3f]" />
        </div>

        <div className="mt-8 space-y-2">
          <div className="h-4 w-3/4 rounded-full bg-white/75" />
          <div className="h-3 w-1/2 rounded-full bg-white/25" />
          <div className="h-9 w-32 rounded-2xl bg-[#d9ff3f]" />
        </div>

        <p className="mt-4 line-clamp-2 text-xs font-bold leading-5 text-white/42">
          {variant.poster_layout}
        </p>
      </div>
    </div>
  )
}

function VariantDetailBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
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

function getVariantVisual(index: number) {
  const visuals = [
    {
      icon: <Gem size={22} />,
      bg: "bg-[radial-gradient(circle_at_20%_0%,rgba(217,255,63,0.16),transparent_38%)]",
    },
    {
      icon: <Flame size={22} />,
      bg: "bg-[radial-gradient(circle_at_80%_20%,rgba(249,115,22,0.18),transparent_40%)]",
    },
    {
      icon: <Clapperboard size={22} />,
      bg: "bg-[radial-gradient(circle_at_40%_0%,rgba(255,255,255,0.1),transparent_38%)]",
    },
    {
      icon: <Zap size={22} />,
      bg: "bg-[radial-gradient(circle_at_60%_0%,rgba(217,255,63,0.13),transparent_38%)]",
    },
  ]

  return visuals[index % visuals.length]
}