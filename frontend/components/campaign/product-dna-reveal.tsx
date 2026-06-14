"use client"

import {
  getProductDNAView,
  type ProductDNAView,
} from "@/lib/product-dna-view"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Brain,
  Check,
  Eye,
  ScanLine,
  ShieldQuestion,
  Sparkles,
  Target,
  X,
  Zap,
} from "lucide-react"
import { useEffect, useMemo, useState, type ReactNode } from "react"

export function ProductDNAReveal({
  draftId,
  onContinue,
  onClose,
}: {
  draftId: string
  onContinue: () => void
  onClose?: () => void
}) {
  const [dna, setDna] = useState<ProductDNAView | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadProductDNA() {
      try {
        const data = await getProductDNAView(draftId)

        if (!isMounted) return
        setDna(data)
      } catch (err) {
        if (!isMounted) return
        setError(
          err instanceof Error ? err.message : "Could not load Product DNA.",
        )
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadProductDNA()

    return () => {
      isMounted = false
    }
  }, [draftId])

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#070816]/82 p-4 backdrop-blur-2xl">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.42 }}
        className="relative max-h-[92vh] w-full max-w-[1080px] overflow-hidden rounded-[2rem] border border-[#d9ff3f]/20 bg-[#0d0d13] shadow-[0_32px_120px_rgba(0,0,0,0.65)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(217,255,63,0.16),transparent_42%),linear-gradient(315deg,rgba(249,115,22,0.13),transparent_48%)]" />

        <div className="relative z-10 max-h-[92vh] overflow-y-auto p-4 md:p-5">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute right-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.065] text-white/58 transition hover:bg-white/[0.1]"
            >
              <X size={17} />
            </button>
          )}

          {isLoading ? (
            <ProductDNALoading />
          ) : error ? (
            <ProductDNAError error={error} />
          ) : dna ? (
            <ProductDNAContent dna={dna} onContinue={onContinue} />
          ) : null}
        </div>
      </motion.div>
    </div>
  )
}

function ProductDNAContent({
  dna,
  onContinue,
}: {
  dna: ProductDNAView
  onContinue: () => void
}) {
  const confidence = Math.round((dna.productConfidence || 0.7) * 100)

  const confidenceLabel = useMemo(() => {
    if (confidence >= 80) return "Strong product signal"
    if (confidence >= 65) return "Good product signal"
    return "Usable product signal"
  }, [confidence])

  return (
    <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
      <aside className="space-y-4">
        <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#070816]/72 p-4">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(217,255,63,0.12),transparent_44%)]" />

          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 px-4 py-2 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#d9ff3f]">
              <Brain size={14} />
              Product DNA ready
            </div>

            <h2 className="text-4xl font-black tracking-[-0.08em] text-white">
              Dhoom understood your product.
            </h2>

            <p className="mt-3 text-sm font-bold leading-7 text-white/52">
              Product DNA is ready. Now Dhoom can create sharper angles,
              variants, poster direction, and WhatsApp copy.
            </p>

            <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/30">
              {dna.productImageUrl ? (
                <img
                  src={dna.productImageUrl}
                  alt={dna.productName || "Product"}
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <div className="grid aspect-[4/5] place-items-center text-white/35">
                  <Eye size={34} />
                </div>
              )}
            </div>

            <div className="mt-4 rounded-[1.3rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-[#d9ff3f]">
                    Confidence
                  </p>

                  <h3 className="mt-1 text-3xl font-black tracking-[-0.07em] text-white">
                    {confidence}%
                  </h3>

                  <p className="mt-1 text-xs font-bold text-white/45">
                    {confidenceLabel}
                  </p>
                </div>

                <ConfidenceRing value={confidence} />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="space-y-4">
        <section className="rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-4 md:p-5">
          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
            Product summary
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-[-0.08em] text-white">
            {dna.productName || "Untitled product"}
          </h1>

          <div className="mt-3 flex flex-wrap gap-2">
            {dna.category && <ProductPill>{dna.category}</ProductPill>}
            {dna.productType && <ProductPill>{dna.productType}</ProductPill>}
            {dna.priceOffer && <ProductPill>{dna.priceOffer}</ProductPill>}
            {dna.moment && <ProductPill>{dna.moment}</ProductPill>}
          </div>

          <p className="mt-4 text-sm font-bold leading-7 text-white/62">
            {dna.productDnaSummary ||
              "Dhoom has created a usable product understanding from the uploaded image and product details."}
          </p>

          {dna.productPositioning && (
            <div className="mt-4 rounded-2xl border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
              <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-[#d9ff3f]">
                Positioning
              </p>

              <p className="mt-2 text-sm font-black leading-6 text-white">
                {dna.productPositioning}
              </p>
            </div>
          )}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <DNACard
            icon={<Zap size={18} />}
            title="Product features"
            items={dna.productFeatures}
            empty="No product features found."
          />

          <DNACard
            icon={<Target size={18} />}
            title="Buyer reasons"
            items={dna.buyerReasons}
            empty="No buyer reasons found."
          />

          <DNACard
            icon={<ShieldQuestion size={18} />}
            title="Buyer objections"
            items={dna.buyerObjections}
            empty="No buyer objections found."
          />

          <DNACard
            icon={<Sparkles size={18} />}
            title="Suggested use cases"
            items={dna.suggestedUseCases}
            empty="No use cases found."
          />
        </section>

        {dna.productVisualNotes && (
          <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4">
            <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
              Visual notes
            </p>

            <p className="mt-2 text-sm font-bold leading-7 text-white/58">
              {dna.productVisualNotes}
            </p>
          </section>
        )}

        <div className="flex flex-col justify-between gap-3 rounded-[1.5rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4 md:flex-row md:items-center">
          <div>
            <h3 className="text-2xl font-black tracking-[-0.06em] text-white">
              Ready for Smart Angle Cards
            </h3>

            <p className="mt-1 text-sm font-bold leading-6 text-white/52">
              Dhoom will now turn this Product DNA into campaign directions.
            </p>
          </div>

          <button
            onClick={onContinue}
            className="group relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#d9ff3f] px-6 text-sm font-black text-[#070816] transition hover:scale-[1.01]"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              Continue to angles
              <ArrowRight size={17} />
            </span>

            <span className="absolute inset-0 translate-x-[-110%] bg-white/35 blur-xl transition group-hover:translate-x-[110%]" />
          </button>
        </div>
      </main>
    </div>
  )
}

function ProductDNALoading() {
  return (
    <div className="grid min-h-[560px] place-items-center text-center">
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
          <ScanLine size={28} />
        </motion.div>

        <h2 className="mt-5 text-4xl font-black tracking-[-0.08em] text-white">
          Loading Product DNA...
        </h2>

        <p className="mt-3 text-sm font-bold text-white/45">
          Dhoom is preparing the product understanding.
        </p>

        <div className="mx-auto mt-6 h-2 max-w-sm overflow-hidden rounded-full bg-white/[0.08]">
          <motion.div
            animate={{ x: ["-100%", "260%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="h-full w-1/3 rounded-full bg-gradient-to-r from-orange-500 to-[#d9ff3f]"
          />
        </div>
      </div>
    </div>
  )
}

function ProductDNAError({ error }: { error: string }) {
  return (
    <div className="grid min-h-[420px] place-items-center text-center">
      <div className="max-w-md">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-500/10 text-red-200">
          <X size={26} />
        </div>

        <h2 className="mt-4 text-3xl font-black tracking-[-0.07em] text-white">
          Product DNA could not load
        </h2>

        <p className="mt-2 text-sm font-bold leading-6 text-red-200">
          {error}
        </p>
      </div>
    </div>
  )
}

function DNACard({
  icon,
  title,
  items,
  empty,
}: {
  icon: ReactNode
  title: string
  items: string[]
  empty: string
}) {
  return (
    <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#d9ff3f] text-[#070816]">
          {icon}
        </div>

        <h3 className="text-xl font-black tracking-[-0.05em] text-white">
          {title}
        </h3>
      </div>

      {items.length === 0 ? (
        <p className="text-sm font-bold text-white/38">{empty}</p>
      ) : (
        <div className="grid gap-2">
          {items.slice(0, 5).map((item) => (
            <div
              key={item}
              className="flex gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2"
            >
              <Check size={14} className="mt-0.5 shrink-0 text-[#d9ff3f]" />
              <p className="text-xs font-bold leading-5 text-white/60">
                {item}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ProductPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1 text-[0.6rem] font-black uppercase tracking-[0.14em] text-white/50">
      {children}
    </span>
  )
}

function ConfidenceRing({ value }: { value: number }) {
  const normalized = Math.min(Math.max(value, 0), 100)
  const circumference = 2 * Math.PI * 22
  const offset = circumference - (normalized / 100) * circumference

  return (
    <div className="relative h-16 w-16">
      <svg className="h-16 w-16 -rotate-90">
        <circle
          cx="32"
          cy="32"
          r="22"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="7"
          fill="transparent"
        />
        <motion.circle
          cx="32"
          cy="32"
          r="22"
          stroke="#d9ff3f"
          strokeWidth="7"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8 }}
        />
      </svg>

      <div className="absolute inset-0 grid place-items-center text-xs font-black text-white">
        {value}%
      </div>
    </div>
  )
}
