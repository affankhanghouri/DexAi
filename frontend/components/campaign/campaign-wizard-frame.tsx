"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  Check,
  Circle,
  FileText,
  ImageIcon,
  Layers3,
  PackageCheck,
  Sparkles,
  Wand2,
} from "lucide-react"
import type { ReactNode } from "react"

export type CampaignWizardStep =
  | "upload"
  | "details"
  | "angles"
  | "variants"
  | "review"

const wizardSteps: {
  id: CampaignWizardStep
  label: string
  description: string
  icon: ReactNode
}[] = [
  {
    id: "upload",
    label: "Product",
    description: "Upload product",
    icon: <ImageIcon size={16} />,
  },
  {
    id: "details",
    label: "DNA",
    description: "Understand product",
    icon: <Sparkles size={16} />,
  },
  {
    id: "angles",
    label: "Angles",
    description: "Pick direction",
    icon: <Wand2 size={16} />,
  },
  {
    id: "variants",
    label: "Variants",
    description: "Choose style",
    icon: <Layers3 size={16} />,
  },
  {
    id: "review",
    label: "Ready",
    description: "Generate pack",
    icon: <PackageCheck size={16} />,
  },
]

export function CampaignWizardFrame({
  step,
  eyebrow,
  title,
  subtitle,
  children,
  sidePanel,
  isProcessing = false,
  processingTitle = "Dhoom is working",
  processingText = "Your campaign engine is preparing the next step.",
}: {
  step: CampaignWizardStep
  eyebrow: string
  title: string
  subtitle: string
  children: ReactNode
  sidePanel?: ReactNode
  isProcessing?: boolean
  processingTitle?: string
  processingText?: string
}) {
  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42 }}
        className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl md:p-6"
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(217,255,63,0.16),transparent_42%),linear-gradient(315deg,rgba(249,115,22,0.13),transparent_48%)]" />

        <div className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
            <Sparkles size={14} />
            {eyebrow}
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-black tracking-[-0.08em] text-white md:text-6xl">
                {title}
              </h1>

              <p className="mt-3 max-w-2xl text-sm font-bold leading-7 text-white/52 md:text-base">
                {subtitle}
              </p>
            </div>

            <CampaignWizardProgress activeStep={step} />
          </div>
        </div>
      </motion.header>

      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <motion.main
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.38 }}
          className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0d0d13]/90 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-5"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.1),transparent_36%,rgba(217,255,63,0.055))]" />
          <div className="relative z-10">{children}</div>

          {isProcessing && (
            <CampaignProcessingOverlay
              title={processingTitle}
              text={processingText}
            />
          )}
        </motion.main>

        <motion.aside
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12, duration: 0.38 }}
          className="space-y-4"
        >
          {sidePanel || <DefaultWizardSidePanel step={step} />}
        </motion.aside>
      </section>
    </div>
  )
}

function CampaignWizardProgress({
  activeStep,
}: {
  activeStep: CampaignWizardStep
}) {
  const activeIndex = wizardSteps.findIndex((step) => step.id === activeStep)

  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-[#070816]/70 p-4">
      <p className="mb-4 text-[0.58rem] font-black uppercase tracking-[0.2em] text-orange-300">
        Campaign pipeline
      </p>

      <div className="grid gap-2">
        {wizardSteps.map((step, index) => {
          const isDone = index < activeIndex
          const isActive = index === activeIndex

          return (
            <div
              key={step.id}
              className={cn(
                "relative overflow-hidden rounded-2xl border p-3 transition",
                isActive
                  ? "border-[#d9ff3f]/35 bg-[#d9ff3f]/10"
                  : isDone
                    ? "border-[#d9ff3f]/20 bg-[#d9ff3f]/5"
                    : "border-white/10 bg-white/[0.035]",
              )}
            >
              {isActive && (
                <motion.div
                  animate={{ x: ["-120%", "120%"] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                />
              )}

              <div className="relative z-10 flex items-center gap-3">
                <div
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                    isDone || isActive
                      ? "bg-[#d9ff3f] text-[#070816]"
                      : "bg-white/[0.07] text-white/35",
                  )}
                >
                  {isDone ? (
                    <Check size={16} />
                  ) : isActive ? (
                    step.icon
                  ) : (
                    <Circle size={13} />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-black text-white">{step.label}</p>
                  <p className="truncate text-xs font-bold text-white/38">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function WizardCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-4",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function WizardSectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle: string
}) {
  return (
    <div className="mb-5">
      <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-3xl font-black tracking-[-0.07em] text-white">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-white/45">
        {subtitle}
      </p>
    </div>
  )
}

export function PremiumInputWrap({
  icon,
  label,
  children,
}: {
  icon: ReactNode
  label: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <p className="mb-2 text-[0.58rem] font-black uppercase tracking-[0.18em] text-white/35">
        {label}
      </p>

      <div className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 transition focus-within:border-[#d9ff3f]/35">
        <div className="text-orange-300">{icon}</div>
        {children}
      </div>
    </label>
  )
}

export function WizardPrimaryButton({
  children,
  disabled,
  onClick,
  type = "button",
}: {
  children: ReactNode
  disabled?: boolean
  onClick?: () => void
  type?: "button" | "submit"
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-[#d9ff3f] px-6 text-sm font-black text-[#070816] shadow-[0_0_45px_rgba(217,255,63,0.16)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
      <span className="absolute inset-0 translate-x-[-110%] bg-white/35 blur-xl transition group-hover:translate-x-[110%]" />
    </button>
  )
}

function CampaignProcessingOverlay({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="absolute inset-0 z-30 grid place-items-center bg-[#070816]/78 p-6 backdrop-blur-xl">
      <div className="w-full max-w-sm rounded-[1.5rem] border border-[#d9ff3f]/25 bg-[#d9ff3f]/10 p-5 text-center shadow-[0_0_80px_rgba(217,255,63,0.14)]">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.08, 1] }}
          transition={{
            rotate: { duration: 2.2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.2, repeat: Infinity },
          }}
          className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]"
        >
          <Wand2 size={24} />
        </motion.div>

        <h3 className="mt-4 text-2xl font-black tracking-[-0.06em] text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm font-bold leading-6 text-white/52">{text}</p>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.08]">
          <motion.div
            animate={{ x: ["-100%", "260%"] }}
            transition={{ duration: 1.25, repeat: Infinity, ease: "linear" }}
            className="h-full w-1/3 rounded-full bg-gradient-to-r from-orange-500 to-[#d9ff3f]"
          />
        </div>
      </div>
    </div>
  )
}

function DefaultWizardSidePanel({ step }: { step: CampaignWizardStep }) {
  const copy = {
    upload: {
      title: "Start with the product",
      text: "Upload the product image. Dhoom will use it as the campaign anchor.",
    },
    details: {
      title: "Product DNA matters",
      text: "This step helps Dhoom understand what the product is, why buyers care, and what objections to handle.",
    },
    angles: {
      title: "Choose the story",
      text: "Angles turn raw product details into a clear campaign direction.",
    },
    variants: {
      title: "Pick the vibe",
      text: "Variants give you different creative styles without making you design manually.",
    },
    review: {
      title: "Ready pack",
      text: "Dhoom will generate the final campaign, quality-check it, and prepare the ready-to-post pack.",
    },
  }[step]

  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
        <FileText size={22} />
      </div>

      <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
        Dhoom guidance
      </p>

      <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-white">
        {copy.title}
      </h3>

      <p className="mt-2 text-sm font-bold leading-6 text-white/48">
        {copy.text}
      </p>

      <div className="mt-4 rounded-2xl border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
        <p className="text-sm font-black leading-6 text-[#d9ff3f]">
          Dhoom prepares. You choose.
        </p>
      </div>
    </div>
  )
}
