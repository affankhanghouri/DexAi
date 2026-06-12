"use client"

import { GlassPanel } from "@/components/shared/glass-panel"
import type { BrandSourceType } from "@/lib/brand-dna-api"
import {
  getBrandIntakeJob,
  startBrandIntake,
  type BrandIntakeJob,
  type BrandIntakeStep,
} from "@/lib/brand-intake-api"
import { getBrandProfile } from "@/lib/brand-profile"
import { saveBrandProfileId } from "@/lib/brand-profile-session"
import { motion } from "framer-motion"
import {
  AtSign,
  Check,
  Globe,
  Loader2,
  MessageCircle,
  ScanLine,
  ShoppingBag,
  Sparkles,
  Store,
  Tags,
  Zap,
} from "lucide-react"
import { useEffect, useMemo, useState, type ReactNode } from "react"

const sourceOptions: {
  id: BrandSourceType
  label: string
  placeholder: string
  icon: ReactNode
}[] = [
  {
    id: "website",
    label: "Website",
    placeholder: "https://yourstore.com",
    icon: <Globe size={17} />,
  },
  {
    id: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/yourbrand",
    icon: <AtSign size={17} />,
  },
  {
    id: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/yourbrand",
    icon: <MessageCircle size={17} />,
  },
  {
    id: "shopify",
    label: "Shopify",
    placeholder: "https://yourstore.com",
    icon: <ShoppingBag size={17} />,
  },
  {
    id: "daraz",
    label: "Daraz",
    placeholder: "https://www.daraz.pk/shop/yourstore",
    icon: <Tags size={17} />,
  },
]

export function ZeroFormBrandIntake({
  onBrandReady,
}: {
  onBrandReady: () => void
}) {
  const [sourceType, setSourceType] = useState<BrandSourceType>("website")
  const [sourceUrl, setSourceUrl] = useState("")
  const [job, setJob] = useState<BrandIntakeJob | null>(null)
  const [error, setError] = useState("")
  const [isStarting, setIsStarting] = useState(false)

  const selectedSource = useMemo(() => {
    return sourceOptions.find((option) => option.id === sourceType) || sourceOptions[0]
  }, [sourceType])

  useEffect(() => {
    if (!job?.id) return
    if (job.status === "completed" || job.status === "failed") return

    const interval = window.setInterval(async () => {
      try {
        const result = await getBrandIntakeJob(job.id)
        setJob(result.job)

        if (result.job.status === "completed" && result.job.brandProfileId) {
          saveBrandProfileId(result.job.brandProfileId)
          await getBrandProfile(result.job.brandProfileId)
          window.clearInterval(interval)

          setTimeout(() => {
            onBrandReady()
          }, 700)
        }

        if (result.job.status === "failed") {
          window.clearInterval(interval)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not check progress.")
      }
    }, 900)

    return () => window.clearInterval(interval)
  }, [job?.id, job?.status, onBrandReady])

  async function handleStart() {
    setError("")

    if (!sourceUrl.trim()) {
      setError("Paste one public brand link first.")
      return
    }

    setIsStarting(true)

    try {
      const result = await startBrandIntake({
        sourceUrl: sourceUrl.trim(),
        sourceType,
      })

      setJob(result.job)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start Brand DNA intake.")
    } finally {
      setIsStarting(false)
    }
  }

  const isRunning =
    isStarting || job?.status === "queued" || job?.status === "processing"

  return (
    <GlassPanel className="p-5 md:p-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 px-4 py-2 text-[0.65rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]"
          >
            <Sparkles size={14} />
            Zero-form brand intake
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.45 }}
            className="max-w-3xl text-4xl font-black tracking-[-0.08em] text-white md:text-6xl"
          >
            Give Dhoom one link.
            <span className="block bg-gradient-to-r from-orange-300 via-[#d9ff3f] to-white bg-clip-text text-transparent">
              We rebuild the brand brain.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="mt-4 max-w-2xl text-sm font-bold leading-7 text-white/52 md:text-base"
          >
            No long onboarding form. Paste your Instagram, Facebook, website,
            Shopify, or Daraz link. Dhoom will scan public signals and build a
            campaign-ready Brand DNA workspace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className="mt-6 grid gap-2 sm:grid-cols-5"
          >
            {sourceOptions.map((option) => {
              const active = option.id === sourceType

              return (
                <button
                  key={option.id}
                  onClick={() => setSourceType(option.id)}
                  disabled={isRunning}
                  className={`group relative overflow-hidden rounded-2xl border px-3 py-3 text-left transition ${
                    active
                      ? "border-[#d9ff3f]/50 bg-[#d9ff3f]/12 text-[#d9ff3f]"
                      : "border-white/10 bg-white/[0.045] text-white/52 hover:border-orange-400/35 hover:bg-white/[0.07]"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <div className="relative z-10 flex items-center gap-2">
                    {option.icon}
                    <span className="text-xs font-black">{option.label}</span>
                  </div>

                  {active && (
                    <motion.div
                      layoutId="sourceGlow"
                      className="absolute inset-0 bg-[linear-gradient(135deg,rgba(217,255,63,0.18),transparent_62%)]"
                    />
                  )}
                </button>
              )
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.45 }}
            className="mt-4 flex flex-col gap-3 md:flex-row"
          >
            <div className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 shadow-inner">
              <div className="text-orange-300">{selectedSource.icon}</div>
              <input
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
                disabled={isRunning}
                placeholder={selectedSource.placeholder}
                className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/28"
              />
            </div>

            <button
              onClick={handleStart}
              disabled={isRunning}
              className="group relative min-h-14 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-[#d9ff3f] px-6 text-sm font-black text-[#070816] shadow-[0_0_45px_rgba(217,255,63,0.18)] transition hover:scale-[1.015] disabled:cursor-wait disabled:opacity-60"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                {isRunning ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Zap size={17} />
                )}
                {isRunning ? "Building..." : "Reconstruct my brand"}
              </span>

              <span className="absolute inset-0 translate-x-[-110%] bg-white/35 blur-xl transition group-hover:translate-x-[110%]" />
            </button>
          </motion.div>

          {error && (
            <p className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
              {error}
            </p>
          )}
        </div>

        <AgentProgressPanel job={job} />
      </div>
    </GlassPanel>
  )
}

function AgentProgressPanel({ job }: { job: BrandIntakeJob | null }) {
  const steps = job?.steps?.length ? job.steps : defaultPreviewSteps()
  const progress = job?.progress || 0

  return (
    <div className="relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#070816]/80 p-4 shadow-[inset_0_0_60px_rgba(217,255,63,0.05)]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(217,255,63,0.1),transparent_45%)]" />

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
              Agent pipeline
            </p>
            <h3 className="mt-1 text-2xl font-black tracking-[-0.06em] text-white">
              Brand scanner
            </h3>
          </div>

          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "linear",
            }}
            className="grid h-12 w-12 place-items-center rounded-2xl border border-[#d9ff3f]/25 bg-[#d9ff3f]/10 text-[#d9ff3f]"
          >
            <ScanLine size={21} />
          </motion.div>
        </div>

        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-white/35">
              Progress
            </span>
            <span className="text-xs font-black text-[#d9ff3f]">{progress}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
            <motion.div
              animate={{
                width: `${progress}%`,
              }}
              transition={{ duration: 0.45 }}
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-[#d9ff3f] shadow-[0_0_22px_rgba(217,255,63,0.45)]"
            />
          </div>
        </div>

        <div className="grid gap-3">
          {steps.map((step, index) => (
            <AgentStep key={step.id} step={step} index={index} />
          ))}
        </div>

        {job?.status === "completed" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl border border-[#d9ff3f]/25 bg-[#d9ff3f]/10 p-4"
          >
            <p className="text-sm font-black text-[#d9ff3f]">
              Brand DNA ready. Opening workspace...
            </p>
          </motion.div>
        )}

        {job?.status === "failed" && (
          <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm font-bold text-red-200">
              {job.errorMessage || "Brand intake failed."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function AgentStep({
  step,
  index,
}: {
  step: BrandIntakeStep
  index: number
}) {
  const isCompleted = step.status === "completed"
  const isProcessing = step.status === "processing"

  return (
    <motion.div
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`relative overflow-hidden rounded-2xl border p-3 ${
        isCompleted
          ? "border-[#d9ff3f]/25 bg-[#d9ff3f]/10"
          : isProcessing
            ? "border-orange-400/35 bg-orange-500/10"
            : "border-white/10 bg-white/[0.035]"
      }`}
    >
      {isProcessing && (
        <motion.div
          animate={{
            x: ["-120%", "120%"],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
      )}

      <div className="relative z-10 flex gap-3">
        <div
          className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-xl ${
            isCompleted
              ? "bg-[#d9ff3f] text-[#070816]"
              : isProcessing
                ? "bg-orange-400 text-[#070816]"
                : "bg-white/[0.07] text-white/35"
          }`}
        >
          {isCompleted ? (
            <Check size={16} />
          ) : isProcessing ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Store size={15} />
          )}
        </div>

        <div>
          <p className="text-sm font-black text-white">{step.label}</p>
          <p className="mt-1 text-xs font-bold leading-5 text-white/42">
            {step.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

function defaultPreviewSteps(): BrandIntakeStep[] {
  return [
    {
      id: "source_reader",
      label: "Reading public brand source",
      description: "Waiting for your brand link.",
      status: "pending",
    },
    {
      id: "category_detector",
      label: "Detecting business category",
      description: "Dhoom will identify what you sell.",
      status: "pending",
    },
    {
      id: "buyer_mapper",
      label: "Mapping Pakistani buyer context",
      description: "Dhoom will understand likely buyer behavior.",
      status: "pending",
    },
    {
      id: "tone_extractor",
      label: "Extracting brand tone and trust signals",
      description: "Dhoom will find brand voice and credibility signals.",
      status: "pending",
    },
    {
      id: "campaign_brain",
      label: "Building campaign operating rules",
      description: "Dhoom will prepare campaign rules.",
      status: "pending",
    },
    {
      id: "workspace_ready",
      label: "Brand workspace ready",
      description: "Your Brand DNA will be ready.",
      status: "pending",
    },
  ]
}
