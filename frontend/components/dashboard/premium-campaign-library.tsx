"use client"

import {
  getBrandProfile,
  type BrandProfile,
} from "@/lib/brand-profile"
import {
  clearBrandProfileId,
  getBrandProfileId,
} from "@/lib/brand-profile-session"
import {
  getCampaignLibraryItems,
  type CampaignLibraryItem,
} from "@/lib/campaign-library"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  Check,
  FileText,
  ImageIcon,
  Layers3,
  MessageCircle,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
  Wand2,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type LibraryFilter = "all" | "ready" | "edited" | "high_score"

export function PremiumCampaignLibrary() {
  const [activeBrand, setActiveBrand] = useState<BrandProfile | null>(null)
  const [campaigns, setCampaigns] = useState<CampaignLibraryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<LibraryFilter>("all")

  useEffect(() => {
    loadLibrary()
  }, [])

  async function loadLibrary() {
    setIsLoading(true)

    try {
      const brandId = getBrandProfileId()

      if (!brandId) {
        setActiveBrand(null)
        setCampaigns([])
        return
      }

      const brand = await getBrandProfile(brandId)
      if (!brand) {
        clearBrandProfileId()
        setActiveBrand(null)
        setCampaigns([])
        return
      }
      setActiveBrand(brand)

      const items = await getCampaignLibraryItems(brandId)
      setCampaigns(items)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCampaigns = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    return campaigns.filter((campaign) => {
      const matchesSearch =
        !query ||
        [
          campaign.productName,
          campaign.category,
          campaign.campaignHeadline,
          campaign.selectedAngleTitle,
          campaign.selectedVariantName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query)

      const matchesFilter =
        filter === "all" ||
        (filter === "ready" && campaign.status === "ready") ||
        (filter === "edited" && campaign.editCount > 0) ||
        (filter === "high_score" && (campaign.campaignScore || 0) >= 80)

      return matchesSearch && matchesFilter
    })
  }, [campaigns, searchQuery, filter])

  if (isLoading) {
    return <CampaignLibraryLoading />
  }

  if (!activeBrand) {
    return <NoBrandLibraryState />
  }

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <LibraryHero
        activeBrand={activeBrand}
        totalCampaigns={campaigns.length}
      />

      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <main className="space-y-5">
          <LibraryControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filter={filter}
            setFilter={setFilter}
            total={filteredCampaigns.length}
          />

          {filteredCampaigns.length === 0 ? (
            <EmptyCampaignLibrary />
          ) : (
            <section className="grid gap-4 md:grid-cols-2">
              {filteredCampaigns.map((campaign, index) => (
                <CampaignVaultCard
                  key={campaign.id}
                  campaign={campaign}
                  index={index}
                />
              ))}
            </section>
          )}
        </main>

        <aside className="space-y-5">
          <LibraryStatsPanel campaigns={campaigns} />

          <LibraryActionPanel />

          <LibraryPrinciplePanel />
        </aside>
      </section>
    </div>
  )
}

function LibraryHero({
  activeBrand,
  totalCampaigns,
}: {
  activeBrand: BrandProfile
  totalCampaigns: number
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.42 }}
      className="relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl md:p-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(217,255,63,0.22),transparent_34%),radial-gradient(circle_at_88%_34%,rgba(249,115,22,0.18),transparent_36%)]" />

      <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
            <PackageCheck size={14} />
            Ready-pack vault
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-[-0.08em] text-white md:text-6xl">
            Your campaign library.
          </h1>

          <p className="mt-4 max-w-2xl text-sm font-bold leading-7 text-white/55 md:text-base">
            Browse ready-to-use campaign packs for{" "}
            <span className="font-black text-white">
              {activeBrand.brandName || "your active brand"}
            </span>
            . Reopen, copy, refine, or use them whenever you are ready.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <HeroPill tone="lime">Active brand loaded</HeroPill>
            <HeroPill tone="white">{totalCampaigns} packs</HeroPill>
            {activeBrand.category && (
              <HeroPill tone="orange">{activeBrand.category}</HeroPill>
            )}
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
          <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-[#d9ff3f]">
            Library idea
          </p>

          <h3 className="mt-2 text-3xl font-black tracking-[-0.07em] text-white">
            Not history.
            <span className="block text-[#d9ff3f]">Reusable packs.</span>
          </h3>

          <p className="mt-2 text-sm font-bold leading-6 text-white/50">
            Every campaign remains useful as copy, direction, and creative
            memory.
          </p>
        </div>
      </div>
    </motion.header>
  )
}

function LibraryControls({
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  total,
}: {
  searchQuery: string
  setSearchQuery: (value: string) => void
  filter: LibraryFilter
  setFilter: (value: LibraryFilter) => void
  total: number
}) {
  const filters: { id: LibraryFilter; label: string }[] = [
    { id: "all", label: "All packs" },
    { id: "ready", label: "Ready" },
    { id: "edited", label: "Edited" },
    { id: "high_score", label: "High score" },
  ]

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
            Find campaign pack
          </p>

          <h2 className="mt-1 text-3xl font-black tracking-[-0.07em] text-white">
            {total} result{total === 1 ? "" : "s"}
          </h2>
        </div>

        <Link href="/dashboard/campaigns/new" className="wizard-primary-btn">
          <Plus size={17} />
          New campaign
        </Link>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto]">
        <div className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 focus-within:border-[#d9ff3f]/35">
          <Search size={17} className="text-orange-300" />

          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search product, angle, variant, category..."
            className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/28"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`min-h-12 rounded-2xl border px-4 text-xs font-black transition ${
                filter === item.id
                  ? "border-[#d9ff3f]/35 bg-[#d9ff3f]/10 text-[#d9ff3f]"
                  : "border-white/10 bg-white/[0.045] text-white/50 hover:bg-white/[0.075]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function CampaignVaultCard({
  campaign,
  index,
}: {
  campaign: CampaignLibraryItem
  index: number
}) {
  const score = campaign.campaignScore || 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.34 }}
      className="group relative overflow-hidden rounded-[1.55rem] border border-white/10 bg-[#0d0d13]/90 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.32)] transition hover:border-[#d9ff3f]/35 hover:bg-white/[0.06]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.09),transparent_38%,rgba(217,255,63,0.055))]" />
      <div className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-white/10 blur-xl transition duration-700 group-hover:translate-x-[120%]" />

      <div className="relative z-10">
        <div className="relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-black/30">
          {campaign.productImageUrl ? (
            <img
              src={campaign.productImageUrl}
              alt={campaign.productName || "Campaign product"}
              className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="grid aspect-[4/3] place-items-center text-white/35">
              <ImageIcon size={36} />
            </div>
          )}

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {campaign.status && (
              <CardPill tone="lime">{campaign.status}</CardPill>
            )}

            {campaign.editCount > 0 && (
              <CardPill tone="orange">Edited {campaign.editCount}x</CardPill>
            )}
          </div>

          <div className="absolute bottom-3 right-3 rounded-2xl border border-white/10 bg-[#070816]/78 px-3 py-2 backdrop-blur-xl">
            <p className="text-[0.55rem] font-black uppercase tracking-[0.16em] text-white/35">
              Score
            </p>
            <p className="text-xl font-black text-white">{score || "--"}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-orange-300">
            {campaign.category || "Campaign pack"}
          </p>

          <h3 className="mt-1 line-clamp-2 text-2xl font-black tracking-[-0.06em] text-white">
            {campaign.productName || campaign.campaignHeadline || "Untitled campaign"}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm font-bold leading-6 text-white/48">
            {campaign.campaignHeadline ||
              campaign.campaignAngle ||
              "Ready-to-use campaign pack"}
          </p>
        </div>

        <div className="mt-4 grid gap-2">
          {campaign.selectedAngleTitle && (
            <MiniSignal
              icon={<Target size={14} />}
              label="Angle"
              value={campaign.selectedAngleTitle}
            />
          )}

          {campaign.selectedVariantName && (
            <MiniSignal
              icon={<Layers3 size={14} />}
              label="Variant"
              value={campaign.selectedVariantName}
            />
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs font-bold text-white/35">
            {new Date(campaign.createdAt).toLocaleDateString()}
          </p>

          <Link
            href={`/dashboard/campaigns/${campaign.id}`}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#d9ff3f] px-4 text-xs font-black text-[#070816] transition hover:scale-[1.01]"
          >
            Open pack
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

function MiniSignal({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/[0.07] text-[#d9ff3f]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[0.52rem] font-black uppercase tracking-[0.16em] text-white/30">
          {label}
        </p>

        <p className="truncate text-xs font-black text-white/62">{value}</p>
      </div>
    </div>
  )
}

function LibraryStatsPanel({
  campaigns,
}: {
  campaigns: CampaignLibraryItem[]
}) {
  const readyCount = campaigns.filter((item) => item.status === "ready").length
  const editedCount = campaigns.filter((item) => item.editCount > 0).length

  const averageScore =
    campaigns.length === 0
      ? 0
      : Math.round(
          campaigns.reduce((total, item) => total + (item.campaignScore || 0), 0) /
            campaigns.length,
        )

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
        Library stats
      </p>

      <div className="mt-4 grid gap-3">
        <StatCard label="Total packs" value={String(campaigns.length)} />
        <StatCard label="Ready packs" value={String(readyCount)} />
        <StatCard label="Edited packs" value={String(editedCount)} />
        <StatCard label="Avg score" value={averageScore ? String(averageScore) : "--"} />
      </div>
    </section>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
      <p className="text-[0.56rem] font-black uppercase tracking-[0.18em] text-white/35">
        {label}
      </p>

      <p className="mt-1 text-3xl font-black tracking-[-0.07em] text-white">
        {value}
      </p>
    </div>
  )
}

function LibraryActionPanel() {
  return (
    <section className="rounded-[1.5rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
        <Wand2 size={22} />
      </div>

      <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
        Next campaign
      </p>

      <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-white">
        Create another ready pack
      </h3>

      <p className="mt-2 text-sm font-bold leading-6 text-white/52">
        Upload another product and Dhoom will create a new campaign package from
        the same active Brand DNA.
      </p>

      <Link
        href="/dashboard/campaigns/new"
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#d9ff3f] px-4 text-xs font-black text-[#070816] transition hover:scale-[1.01]"
      >
        New campaign
        <ArrowRight size={15} />
      </Link>
    </section>
  )
}

function LibraryPrinciplePanel() {
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-orange-400 text-[#070816]">
        <Brain size={22} />
      </div>

      <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
        Dhoom principle
      </p>

      <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-white">
        Campaign memory
      </h3>

      <p className="mt-2 text-sm font-bold leading-6 text-white/48">
        Every pack teaches the seller what kind of campaigns were created, but
        without forcing a schedule or complicated analytics.
      </p>
    </section>
  )
}

function EmptyCampaignLibrary() {
  return (
    <section className="grid min-h-[420px] place-items-center rounded-[1.7rem] border border-dashed border-white/15 bg-white/[0.035] p-6 text-center">
      <div>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
          <FileText size={30} />
        </div>

        <h2 className="mt-5 text-4xl font-black tracking-[-0.08em] text-white">
          No campaign packs found.
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm font-bold leading-7 text-white/45">
          Create your first campaign pack. Dhoom will prepare copy, WhatsApp
          message, creative direction, and ready-to-post output.
        </p>

        <Link
          href="/dashboard/campaigns/new"
          className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#d9ff3f] px-6 text-sm font-black text-[#070816]"
        >
          Create first campaign
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  )
}

function NoBrandLibraryState() {
  return (
    <div className="mx-auto grid min-h-[520px] max-w-[1180px] place-items-center rounded-[1.8rem] border border-orange-400/20 bg-orange-500/10 p-6 text-center">
      <div>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-orange-400 text-[#070816]">
          <Store size={30} />
        </div>

        <h1 className="mt-5 text-4xl font-black tracking-[-0.08em] text-white">
          Brand DNA required first.
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm font-bold leading-7 text-white/50">
          Dhoom needs an active brand workspace before showing campaign packs.
        </p>

        <Link
          href="/dashboard/brand-dna"
          className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#d9ff3f] px-6 text-sm font-black text-[#070816]"
        >
          Setup Brand DNA
          <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  )
}

function CampaignLibraryLoading() {
  return (
    <div className="mx-auto grid min-h-[520px] max-w-[1180px] place-items-center rounded-[1.8rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-6 text-center">
      <div>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
          <RefreshCw size={28} className="animate-spin" />
        </div>

        <h1 className="mt-5 text-4xl font-black tracking-[-0.08em] text-white">
          Loading campaign library...
        </h1>

        <p className="mt-3 text-sm font-bold text-white/45">
          Dhoom is opening your ready-pack vault.
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

function CardPill({
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
      className={`rounded-full border px-3 py-1 text-[0.55rem] font-black uppercase tracking-[0.14em] backdrop-blur-xl ${styles[tone]}`}
    >
      {children}
    </span>
  )
}
