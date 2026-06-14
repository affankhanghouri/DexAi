"use client"

import { BrandEnrichmentPanel } from "@/components/brand-dna/brand-enrichment-panel"
import { ZeroFormBrandIntake } from "@/components/brand-dna/zero-form-brand-intake"
import {
  getAllBrandProfiles,
  getBrandProfile,
  type BrandProfile,
} from "@/lib/brand-profile"
import {
  clearBrandProfileId,
  getBrandProfileId,
  saveBrandProfileId,
} from "@/lib/brand-profile-session"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  Check,
  Flame,
  Gem,
  Globe,
  Layers3,
  Loader2,
  MessageCircle,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
  Wand2,
  Zap,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

export function PremiumBrandDNAWorkspace() {
  const [activeBrand, setActiveBrand] = useState<BrandProfile | null>(null)
  const [brands, setBrands] = useState<BrandProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    loadWorkspace()
  }, [refreshKey])

  async function loadWorkspace() {
    setIsLoading(true)

    try {
      const allBrands = await getAllBrandProfiles()
      setBrands(allBrands)

      const activeId = getBrandProfileId()

      if (activeId) {
        const active = allBrands.find((brand) => brand.id === activeId) || null

        if (active) {
          setActiveBrand(active)
          return
        }

        clearBrandProfileId()
      }

      if (allBrands.length > 0) {
        const latest = allBrands[0]
        saveBrandProfileId(latest.id)
        setActiveBrand(latest)
        return
      }

      setActiveBrand(null)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function activateBrand(brandId: string) {
    saveBrandProfileId(brandId)
    const brand = await getBrandProfile(brandId)
    if (!brand) {
      clearBrandProfileId()
      setActiveBrand(null)
      return
    }
    setActiveBrand(brand)
  }

  if (isLoading) {
    return <BrandWorkspaceLoading />
  }

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <BrandWorkspaceHero activeBrand={activeBrand} />

      <ZeroFormBrandIntake
        onBrandReady={() => {
          setRefreshKey((current) => current + 1)
        }}
      />

      {activeBrand ? (
        <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
          <main className="space-y-5">
            <ActiveBrandCommandCenter brand={activeBrand} />

            <BrandDNASignalGrid brand={activeBrand} />

            <BrandMarketIntelligence brand={activeBrand} />

            <BrandEnrichmentPanel
              brandProfileId={activeBrand.id}
              onEnriched={() => {
                setRefreshKey((current) => current + 1)
              }}
            />
          </main>

          <aside className="space-y-5">
            <BrandConfidencePanel brand={activeBrand} />

            <SavedBrandsPanel
              brands={brands}
              activeBrandId={activeBrand.id}
              onActivate={activateBrand}
            />

            <BrandRulesPanel brand={activeBrand} />
          </aside>
        </section>
      ) : (
        <NoBrandWorkspace />
      )}
    </div>
  )
}

function BrandWorkspaceHero({ activeBrand }: { activeBrand: BrandProfile | null }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.42 }}
      className="relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl md:p-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(217,255,63,0.22),transparent_34%),radial-gradient(circle_at_88%_34%,rgba(249,115,22,0.18),transparent_36%)]" />

      <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
            <Brain size={14} />
            Brand DNA workspace
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-[-0.08em] text-white md:text-6xl">
            {activeBrand
              ? `${activeBrand.brandName || "Your brand"} intelligence`
              : "Reconstruct your brand brain."}
          </h1>

          <p className="mt-4 max-w-2xl text-sm font-bold leading-7 text-white/55 md:text-base">
            {activeBrand
              ? "Dhoom uses this Brand DNA to keep every campaign aligned with your store, audience, tone, trust signals, and Pakistani market context."
              : "Paste one public brand link. Dhoom will scan the source and build a campaign-ready brand workspace."}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <HeroPill tone={activeBrand ? "lime" : "orange"}>
              {activeBrand ? "Active brand loaded" : "Brand DNA needed"}
            </HeroPill>

            {activeBrand?.sourceType && (
              <HeroPill tone="white">{activeBrand.sourceType}</HeroPill>
            )}

            {activeBrand?.category && (
              <HeroPill tone="orange">{activeBrand.category}</HeroPill>
            )}
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
          <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-[#d9ff3f]">
            Dhoom rule
          </p>

          <h3 className="mt-2 text-3xl font-black tracking-[-0.07em] text-white">
            No Brand DNA.
            <span className="block text-[#d9ff3f]">No campaign.</span>
          </h3>

          <p className="mt-2 text-sm font-bold leading-6 text-white/50">
            Campaigns should come from brand understanding, not random prompts.
          </p>
        </div>
      </div>
    </motion.header>
  )
}

function ActiveBrandCommandCenter({ brand }: { brand: BrandProfile }) {
  return (
    <section className="relative overflow-hidden rounded-[1.7rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(217,255,63,0.18),transparent_34%),radial-gradient(circle_at_90%_34%,rgba(249,115,22,0.14),transparent_36%)]" />

      <div className="relative z-10 grid gap-5 lg:grid-cols-[1fr_280px] lg:items-center">
        <div>
          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
            Active campaign brain
          </p>

          <h2 className="mt-2 text-4xl font-black tracking-[-0.08em] text-white">
            {brand.brandName || "Untitled brand"}
          </h2>

          <p className="mt-3 max-w-2xl text-sm font-bold leading-7 text-white/58">
            {brand.summary ||
              "Dhoom has created a usable Brand DNA profile for campaign generation."}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {brand.businessType && <HeroPill tone="white">{brand.businessType}</HeroPill>}
            {brand.tone && <HeroPill tone="orange">{brand.tone}</HeroPill>}
            {brand.pricePositioning && (
              <HeroPill tone="lime">{brand.pricePositioning}</HeroPill>
            )}
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-white/10 bg-[#070816]/72 p-4">
          <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-white/35">
            Next action
          </p>

          <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-white">
            Create campaign
          </h3>

          <p className="mt-2 text-sm font-bold leading-6 text-white/45">
            Upload a product and Dhoom will combine product + brand intelligence.
          </p>

          <a
            href="/dashboard/campaigns/new"
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#d9ff3f] px-4 text-xs font-black text-[#070816] transition hover:scale-[1.01]"
          >
            Start campaign
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  )
}

function BrandDNASignalGrid({ brand }: { brand: BrandProfile }) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <DNASignalCard
        icon={<Target size={20} />}
        title="Target audience"
        label="Buyer profile"
        value={brand.targetAudience || "Target audience not clearly detected."}
      />

      <DNASignalCard
        icon={<Gem size={20} />}
        title="Visual style"
        label="Brand look"
        value={brand.visualStyle || "Visual style not clearly detected."}
      />

      <DNASignalCard
        icon={<MessageCircle size={20} />}
        title="Tone"
        label="Communication style"
        value={brand.tone || "Tone not clearly detected."}
      />

      <DNASignalCard
        icon={<ShieldCheck size={20} />}
        title="Trust signals"
        label="Why buyers may trust it"
        value={
          brand.trustSignals?.length
            ? brand.trustSignals.join(", ")
            : "No strong trust signals detected yet."
        }
      />
    </section>
  )
}

function DNASignalCard({
  icon,
  title,
  label,
  value,
}: {
  icon: React.ReactNode
  title: string
  label: string
  value: string
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0d0d13]/90 p-4"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.09),transparent_38%,rgba(217,255,63,0.055))]" />
      <div className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-white/10 blur-xl transition duration-700 group-hover:translate-x-[120%]" />

      <div className="relative z-10">
        <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
          {icon}
        </div>

        <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-orange-300">
          {label}
        </p>

        <h3 className="mt-1 text-2xl font-black tracking-[-0.06em] text-white">
          {title}
        </h3>

        <p className="mt-3 text-sm font-bold leading-7 text-white/56">
          {value}
        </p>
      </div>
    </motion.section>
  )
}

function BrandMarketIntelligence({ brand }: { brand: BrandProfile }) {
  const sellingPoints = brand.sellingPoints || []
  const weaknesses = brand.weaknesses || []

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <BrandListPanel
        icon={<Zap size={20} />}
        title="Selling points"
        label="What Dhoom should push"
        items={sellingPoints}
        empty="No strong selling points detected yet."
        tone="lime"
      />

      <BrandListPanel
        icon={<Flame size={20} />}
        title="Weaknesses"
        label="What Dhoom should handle carefully"
        items={weaknesses}
        empty="No major weaknesses detected yet."
        tone="orange"
      />
    </section>
  )
}

function BrandListPanel({
  icon,
  title,
  label,
  items,
  empty,
  tone,
}: {
  icon: React.ReactNode
  title: string
  label: string
  items: string[]
  empty: string
  tone: "lime" | "orange"
}) {
  return (
    <section
      className={`rounded-[1.5rem] border p-4 ${
        tone === "lime"
          ? "border-[#d9ff3f]/20 bg-[#d9ff3f]/10"
          : "border-orange-400/20 bg-orange-500/10"
      }`}
    >
      <div
        className={`mb-4 grid h-11 w-11 place-items-center rounded-2xl ${
          tone === "lime" ? "bg-[#d9ff3f]" : "bg-orange-400"
        } text-[#070816]`}
      >
        {icon}
      </div>

      <p
        className={`text-[0.58rem] font-black uppercase tracking-[0.18em] ${
          tone === "lime" ? "text-[#d9ff3f]" : "text-orange-300"
        }`}
      >
        {label}
      </p>

      <h3 className="mt-1 text-2xl font-black tracking-[-0.06em] text-white">
        {title}
      </h3>

      <div className="mt-4 grid gap-2">
        {items.length === 0 ? (
          <p className="text-sm font-bold leading-6 text-white/45">{empty}</p>
        ) : (
          items.slice(0, 6).map((item) => (
            <div
              key={item}
              className="flex gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2"
            >
              <Check size={14} className="mt-0.5 shrink-0 text-[#d9ff3f]" />
              <p className="text-xs font-bold leading-5 text-white/58">
                {item}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

function BrandConfidencePanel({ brand }: { brand: BrandProfile }) {
  const confidence = Math.round((brand.confidence || 0) * 100)

  const label = useMemo(() => {
    if (confidence >= 80) return "Strong Brand DNA"
    if (confidence >= 65) return "Good Brand DNA"
    if (confidence >= 45) return "Usable Brand DNA"
    return "Needs enrichment"
  }, [confidence])

  return (
    <section className="rounded-[1.5rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
            Confidence
          </p>

          <h3 className="mt-2 text-5xl font-black tracking-[-0.08em] text-white">
            {confidence}%
          </h3>

          <p className="mt-1 text-sm font-bold text-white/48">{label}</p>
        </div>

        <ConfidenceRing value={confidence} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
        <p className="text-xs font-bold leading-5 text-white/52">
          {brand.isEnriched
            ? `Enriched ${brand.enrichmentCount || 1} time(s). Dhoom has extra seller-provided context.`
            : "Add 5 quick answers below to improve campaign accuracy."}
        </p>
      </div>
    </section>
  )
}

function SavedBrandsPanel({
  brands,
  activeBrandId,
  onActivate,
}: {
  brands: BrandProfile[]
  activeBrandId: string
  onActivate: (id: string) => void
}) {
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
        Saved workspaces
      </p>

      <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-white">
        Brand profiles
      </h3>

      <div className="mt-4 grid gap-2">
        {brands.length === 0 ? (
          <p className="text-sm font-bold leading-6 text-white/42">
            No saved brands yet.
          </p>
        ) : (
          brands.map((brand) => {
            const active = brand.id === activeBrandId

            return (
              <button
                key={brand.id}
                onClick={() => onActivate(brand.id)}
                className={`rounded-2xl border p-3 text-left transition ${
                  active
                    ? "border-[#d9ff3f]/30 bg-[#d9ff3f]/10"
                    : "border-white/10 bg-white/[0.045] hover:bg-white/[0.075]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-white">
                      {brand.brandName || "Untitled brand"}
                    </p>

                    <p className="mt-1 truncate text-xs font-bold text-white/38">
                      {brand.category || brand.sourceUrl}
                    </p>
                  </div>

                  <div
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${
                      active
                        ? "bg-[#d9ff3f] text-[#070816]"
                        : "bg-white/[0.07] text-white/35"
                    }`}
                  >
                    {active ? <Check size={15} /> : <Store size={15} />}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </section>
  )
}

function BrandRulesPanel({ brand }: { brand: BrandProfile }) {
  const campaignRules = brand.campaignRules || {}
  const angleStrategy = brand.angleStrategy || {}
  const languageStrategy = brand.contentLanguageStrategy || {}

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-orange-400 text-[#070816]">
        <Layers3 size={22} />
      </div>

      <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
        Operating rules
      </p>

      <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-white">
        How Dhoom should think
      </h3>

      <div className="mt-4 grid gap-3">
        <ObjectPreview title="Campaign rules" data={campaignRules} />
        <ObjectPreview title="Angle strategy" data={angleStrategy} />
        <ObjectPreview title="Language strategy" data={languageStrategy} />
      </div>
    </section>
  )
}

function ObjectPreview({
  title,
  data,
}: {
  title: string
  data: Record<string, unknown>
}) {
  const entries = Object.entries(data || {}).slice(0, 4)

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
      <p className="text-sm font-black text-white">{title}</p>

      <div className="mt-2 grid gap-2">
        {entries.length === 0 ? (
          <p className="text-xs font-bold text-white/35">No rules found.</p>
        ) : (
          entries.map(([key, value]) => (
            <div key={key}>
              <p className="text-[0.55rem] font-black uppercase tracking-[0.16em] text-white/30">
                {key.replaceAll("_", " ")}
              </p>

              <p className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-white/52">
                {Array.isArray(value) ? value.join(", ") : String(value)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function NoBrandWorkspace() {
  return (
    <section className="grid min-h-[420px] place-items-center rounded-[1.7rem] border border-dashed border-white/15 bg-white/[0.035] p-6 text-center">
      <div>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-orange-500/10 text-orange-200">
          <Globe size={30} />
        </div>

        <h2 className="mt-5 text-4xl font-black tracking-[-0.08em] text-white">
          Paste one brand link above.
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm font-bold leading-7 text-white/45">
          Dhoom will scan the source and build a campaign-ready Brand DNA
          workspace.
        </p>
      </div>
    </section>
  )
}

function BrandWorkspaceLoading() {
  return (
    <div className="mx-auto grid min-h-[520px] max-w-[1180px] place-items-center rounded-[1.8rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-6 text-center">
      <div>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
          <Loader2 size={28} className="animate-spin" />
        </div>

        <h1 className="mt-5 text-4xl font-black tracking-[-0.08em] text-white">
          Loading Brand DNA workspace...
        </h1>

        <p className="mt-3 text-sm font-bold text-white/45">
          Dhoom is opening your active brand intelligence.
        </p>
      </div>
    </div>
  )
}

function HeroPill({
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

function ConfidenceRing({ value }: { value: number }) {
  const normalized = Math.min(Math.max(value, 0), 100)
  const circumference = 2 * Math.PI * 24
  const offset = circumference - (normalized / 100) * circumference

  return (
    <div className="relative h-20 w-20">
      <svg className="h-20 w-20 -rotate-90">
        <circle
          cx="40"
          cy="40"
          r="24"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="8"
          fill="transparent"
        />

        <motion.circle
          cx="40"
          cy="40"
          r="24"
          stroke="#d9ff3f"
          strokeWidth="8"
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
