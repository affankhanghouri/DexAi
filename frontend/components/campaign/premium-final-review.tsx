"use client"

import {
  getCampaignReviewView,
  type CampaignReviewView,
} from "@/lib/campaign-review-view"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  Check,
  FileText,
  ImageIcon,
  Layers3,
  Loader2,
  MessageCircle,
  PackageCheck,
  Palette,
  ShieldCheck,
  Sparkles,
  Target,
  Wand2,
  Zap,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

export function PremiumFinalReview({
  draftId,
  isGenerating,
  onGenerate,
}: {
  draftId: string
  isGenerating: boolean
  onGenerate: () => void
}) {
  const [review, setReview] = useState<CampaignReviewView | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadReview() {
      try {
        const data = await getCampaignReviewView(draftId)
        setReview(data)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not load review data.",
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadReview()
  }, [draftId])

  if (isLoading) {
    return <FinalReviewLoading />
  }

  if (error) {
    return <FinalReviewError error={error} />
  }

  if (!review) {
    return <FinalReviewError error="Campaign review data not found." />
  }

  return (
    <div className="space-y-5">
      <FinalReadinessHero
        review={review}
        isGenerating={isGenerating}
        onGenerate={onGenerate}
      />

      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <main className="space-y-4">
          <ReviewProductPanel review={review} />

          <section className="grid gap-4 md:grid-cols-2">
            <ReviewLockCard
              icon={<Target size={20} />}
              label="Selected campaign angle"
              title={review.selectedAngleTitle || "No angle selected"}
              description={
                review.selectedAngleDescription ||
                "Campaign angle is not selected yet."
              }
              footer={review.selectedAngleReason || "No reasoning available."}
              ready={Boolean(review.selectedAngleId)}
            />

            <ReviewLockCard
              icon={<Palette size={20} />}
              label="Selected creative variant"
              title={review.selectedVariantName || "No variant selected"}
              description={
                review.selectedVariantDescription ||
                "Creative variant is not selected yet."
              }
              footer={
                review.selectedVariantCaptionStyle ||
                "No caption style selected."
              }
              ready={Boolean(review.selectedVariantId)}
            />
          </section>

          {review.selectedVariantVisual && (
            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#d9ff3f] text-[#070816]">
                  <ImageIcon size={18} />
                </div>

                <div>
                  <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-orange-300">
                    Visual direction
                  </p>

                  <h3 className="text-xl font-black tracking-[-0.05em] text-white">
                    Poster and creative style
                  </h3>
                </div>
              </div>

              <p className="text-sm font-bold leading-7 text-white/58">
                {review.selectedVariantVisual}
              </p>
            </section>
          )}

          <FinalOutputPreview />
        </main>

        <aside className="space-y-4">
          <ReadinessChecklist review={review} />

          <GenerationPipelinePanel />

          <section className="rounded-[1.4rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
              <PackageCheck size={22} />
            </div>

            <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
              Ready pack principle
            </p>

            <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-white">
              Prepared, not dictated.
            </h3>

            <p className="mt-2 text-sm font-bold leading-6 text-white/52">
              Dhoom prepares the campaign pack. You decide when and how to use
              it.
            </p>
          </section>
        </aside>
      </section>
    </div>
  )
}

function FinalReadinessHero({
  review,
  isGenerating,
  onGenerate,
}: {
  review: CampaignReviewView
  isGenerating: boolean
  onGenerate: () => void
}) {
  const confidence = Math.round((review.productConfidence || 0.7) * 100)

  const isReady =
    Boolean(review.productName) &&
    Boolean(review.productDnaSummary) &&
    Boolean(review.selectedAngleId) &&
    Boolean(review.selectedVariantId)

  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-[1.7rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.42)] md:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(217,255,63,0.2),transparent_34%),radial-gradient(circle_at_90%_32%,rgba(249,115,22,0.16),transparent_36%)]" />

      <div className="relative z-10 grid gap-5 lg:grid-cols-[1fr_340px] lg:items-center">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d9ff3f]/25 bg-black/20 px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
            <Sparkles size={14} />
            Final review
          </div>

          <h2 className="max-w-3xl text-4xl font-black tracking-[-0.08em] text-white md:text-5xl">
            Campaign pack is ready to build.
          </h2>

          <p className="mt-3 max-w-2xl text-sm font-bold leading-7 text-white/55">
            Dhoom has the product, Product DNA, campaign angle, and creative
            variant. Now it will generate the final ready-to-post pack.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <ReviewPill tone={isReady ? "lime" : "orange"}>
              {isReady ? "All key inputs ready" : "Some inputs missing"}
            </ReviewPill>

            <ReviewPill tone="white">
              Product signal {confidence}%
            </ReviewPill>

            {review.moment && <ReviewPill tone="orange">{review.moment}</ReviewPill>}
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-white/10 bg-[#070816]/72 p-4">
          <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-white/35">
            Next action
          </p>

          <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-white">
            Generate ready pack
          </h3>

          <p className="mt-2 text-sm font-bold leading-6 text-white/45">
            Caption, WhatsApp copy, poster direction, reel direction, quality
            score, creative brief, and export pack.
          </p>

          <button
            onClick={onGenerate}
            disabled={isGenerating || !isReady}
            className="group relative mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-[#d9ff3f] px-5 text-sm font-black text-[#070816] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              {isGenerating ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Wand2 size={17} />
              )}

              {isGenerating ? "Generating pack..." : "Generate ready pack"}
            </span>

            <span className="absolute inset-0 translate-x-[-110%] bg-white/35 blur-xl transition group-hover:translate-x-[110%]" />
          </button>
        </div>
      </div>
    </motion.section>
  )
}

function ReviewProductPanel({ review }: { review: CampaignReviewView }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30">
        {review.productImageUrl ? (
          <img
            src={review.productImageUrl}
            alt={review.productName || "Product"}
            className="aspect-[4/5] w-full object-cover"
          />
        ) : (
          <div className="grid aspect-[4/5] place-items-center text-white/35">
            <ImageIcon size={34} />
          </div>
        )}
      </div>

      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4">
        <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
          Product locked
        </p>

        <h2 className="mt-2 text-4xl font-black tracking-[-0.08em] text-white">
          {review.productName || "Untitled product"}
        </h2>

        <div className="mt-3 flex flex-wrap gap-2">
          {review.category && <ReviewPill tone="white">{review.category}</ReviewPill>}
          {review.priceOffer && (
            <ReviewPill tone="lime">{review.priceOffer}</ReviewPill>
          )}
          {review.buyerAction && (
            <ReviewPill tone="orange">{review.buyerAction}</ReviewPill>
          )}
        </div>

        <p className="mt-4 text-sm font-bold leading-7 text-white/58">
          {review.productDnaSummary ||
            "Product DNA summary is not available yet."}
        </p>

        {review.productPositioning && (
          <div className="mt-4 rounded-2xl border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
            <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-[#d9ff3f]">
              Product positioning
            </p>

            <p className="mt-2 text-sm font-black leading-6 text-white">
              {review.productPositioning}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

function ReviewLockCard({
  icon,
  label,
  title,
  description,
  footer,
  ready,
}: {
  icon: React.ReactNode
  label: string
  title: string
  description: string
  footer: string
  ready: boolean
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[1.5rem] border p-4 ${
        ready
          ? "border-[#d9ff3f]/20 bg-[#d9ff3f]/10"
          : "border-orange-400/25 bg-orange-500/10"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(217,255,63,0.1),transparent_38%)]" />

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div
            className={`grid h-11 w-11 place-items-center rounded-2xl ${
              ready ? "bg-[#d9ff3f] text-[#070816]" : "bg-orange-400 text-[#070816]"
            }`}
          >
            {ready ? <Check size={20} /> : icon}
          </div>

          <ReviewPill tone={ready ? "lime" : "orange"}>
            {ready ? "Locked" : "Missing"}
          </ReviewPill>
        </div>

        <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-white/35">
          {label}
        </p>

        <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm font-bold leading-6 text-white/52">
          {description}
        </p>

        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs font-bold leading-5 text-white/48">{footer}</p>
        </div>
      </div>
    </section>
  )
}

function ReadinessChecklist({ review }: { review: CampaignReviewView }) {
  const items = [
    {
      label: "Product image",
      ready: Boolean(review.productImageUrl),
    },
    {
      label: "Product details",
      ready: Boolean(review.productName && review.category),
    },
    {
      label: "Product DNA",
      ready: Boolean(review.productDnaSummary),
    },
    {
      label: "Campaign angle",
      ready: Boolean(review.selectedAngleId),
    },
    {
      label: "Creative variant",
      ready: Boolean(review.selectedVariantId),
    },
  ]

  return (
    <section className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
        Readiness check
      </p>

      <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-white">
        Campaign inputs
      </h3>

      <div className="mt-4 grid gap-2">
        {items.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-3 rounded-2xl border px-3 py-3 ${
              item.ready
                ? "border-[#d9ff3f]/20 bg-[#d9ff3f]/10"
                : "border-white/10 bg-white/[0.035]"
            }`}
          >
            <div
              className={`grid h-8 w-8 place-items-center rounded-xl ${
                item.ready
                  ? "bg-[#d9ff3f] text-[#070816]"
                  : "bg-white/[0.07] text-white/35"
              }`}
            >
              {item.ready ? <Check size={15} /> : <Zap size={15} />}
            </div>

            <p className="text-xs font-black text-white/70">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function GenerationPipelinePanel() {
  const outputs = [
    {
      icon: <FileText size={16} />,
      title: "Caption",
      text: "Instagram/Facebook-ready post copy.",
    },
    {
      icon: <MessageCircle size={16} />,
      title: "WhatsApp copy",
      text: "Message-ready sales copy.",
    },
    {
      icon: <ImageIcon size={16} />,
      title: "Poster direction",
      text: "Creative direction for static poster.",
    },
    {
      icon: <Layers3 size={16} />,
      title: "Creative brief",
      text: "Poster and reel execution prompts.",
    },
    {
      icon: <ShieldCheck size={16} />,
      title: "Quality gate",
      text: "Campaign score and improvements.",
    },
    {
      icon: <PackageCheck size={16} />,
      title: "Ready tray",
      text: "Copy/download command center.",
    },
  ]

  return (
    <section className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
        Dhoom will prepare
      </p>

      <div className="mt-4 grid gap-2">
        {outputs.map((item) => (
          <div
            key={item.title}
            className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3"
          >
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/[0.07] text-[#d9ff3f]">
              {item.icon}
            </div>

            <div>
              <p className="text-sm font-black text-white">{item.title}</p>
              <p className="mt-1 text-xs font-bold leading-5 text-white/42">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function FinalOutputPreview() {
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
          <Brain size={20} />
        </div>

        <div>
          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
            Final output preview
          </p>

          <h3 className="text-2xl font-black tracking-[-0.06em] text-white">
            What happens next
          </h3>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <MiniOutputCard
          title="Generate"
          text="Dhoom writes the final campaign pack."
        />
        <MiniOutputCard
          title="Quality check"
          text="Dhoom scores and polishes weak parts."
        />
        <MiniOutputCard
          title="Package"
          text="Dhoom prepares export and Creative Lab assets."
        />
      </div>
    </section>
  )
}

function MiniOutputCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
      <p className="text-sm font-black text-white">{title}</p>
      <p className="mt-1 text-xs font-bold leading-5 text-white/42">{text}</p>
    </div>
  )
}

function ReviewPill({
  children,
  tone,
}: {
  children: React.ReactNode
  tone: "lime" | "orange" | "white"
}) {
  const styles = {
    lime: "border-[#d9ff3f]/25 bg-[#d9ff3f]/10 text-[#d9ff3f]",
    orange: "border-orange-400/25 bg-orange-500/10 text-orange-200",
    white: "border-white/10 bg-white/[0.055] text-white/50",
  }

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[0.58rem] font-black uppercase tracking-[0.14em] ${styles[tone]}`}
    >
      {children}
    </span>
  )
}

function FinalReviewLoading() {
  return (
    <div className="grid min-h-[420px] place-items-center rounded-[1.5rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-6 text-center">
      <div>
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.08, 1],
          }}
          transition={{
            rotate: { duration: 2.4, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.2, repeat: Infinity },
          }}
          className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]"
        >
          <PackageCheck size={28} />
        </motion.div>

        <h2 className="mt-5 text-4xl font-black tracking-[-0.08em] text-white">
          Loading final review...
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm font-bold leading-7 text-white/52">
          Dhoom is checking product, angle, variant, and campaign readiness.
        </p>
      </div>
    </div>
  )
}

function FinalReviewError({ error }: { error: string }) {
  return (
    <div className="grid min-h-[360px] place-items-center rounded-[1.5rem] border border-red-500/30 bg-red-500/10 p-6 text-center">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-500/10 text-red-200">
          <Zap size={26} />
        </div>

        <h2 className="mt-4 text-3xl font-black tracking-[-0.07em] text-white">
          Review could not load
        </h2>

        <p className="mt-2 text-sm font-bold leading-6 text-red-200">
          {error}
        </p>
      </div>
    </div>
  )
}