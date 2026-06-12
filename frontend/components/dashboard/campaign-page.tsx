"use client"

import { getAllCampaigns, type RecentCampaign } from "@/lib/campaign-output"
import { getBrandProfile, type BrandProfile } from "@/lib/brand-profile"
import { getBrandProfileId } from "@/lib/brand-profile-session"
import {
  ArrowRight,
  FileText,
  Globe,
  Megaphone,
  Plus,
  Search,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

export function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<RecentCampaign[]>([])
  const [activeBrand, setActiveBrand] = useState<BrandProfile | null>(null)
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const brandId = getBrandProfileId()

        if (!brandId) {
          setCampaigns([])
          return
        }

        const brand = await getBrandProfile(brandId)
        setActiveBrand(brand)

        const data = await getAllCampaigns(brandId)
        setCampaigns(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCampaigns()
  }, [])

  const filteredCampaigns = useMemo(() => {
    const search = query.trim().toLowerCase()

    if (!search) return campaigns

    return campaigns.filter((campaign) => {
      const text = [
        campaign.productName,
        campaign.category,
        campaign.selectedAngleTitle,
        campaign.selectedVariantName,
        campaign.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return text.includes(search)
    })
  }, [campaigns, query])

  return (
    <div className="mx-auto max-w-[1120px] space-y-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-[-0.07em] text-white md:text-4xl">
            Campaigns
          </h1>
          <p className="mt-2 text-sm font-bold text-white/45">
            {activeBrand
              ? `Campaign library for ${activeBrand.brandName || "active brand"}.`
              : "Choose a brand to view campaigns."}
          </p>
        </div>

        {activeBrand ? (
          <Link href="/dashboard/campaigns/new" className="wizard-primary-btn">
            <Plus size={17} />
            New campaign
          </Link>
        ) : (
          <Link href="/dashboard/brand-dna" className="wizard-primary-btn">
            <Globe size={17} />
            Setup Brand DNA
          </Link>
        )}
      </div>

      {activeBrand && (
        <section className="rounded-[1.3rem] border border-white/10 bg-[#0d0d13]/90 p-4">
          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
            Active brand
          </p>

          <div className="mt-2 flex flex-col justify-between gap-2 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-black tracking-[-0.06em] text-white">
                {activeBrand.brandName || "Untitled brand"}
              </h2>
              <p className="mt-1 text-sm font-bold text-white/45">
                {activeBrand.category || "No category"} •{" "}
                {activeBrand.pricePositioning || "No positioning"}
              </p>
            </div>

            <Link
              href="/dashboard/brand-dna"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.055] px-4 text-xs font-black text-white/70 transition hover:bg-white/[0.1]"
            >
              Switch brand
            </Link>
          </div>
        </section>
      )}

      <section className="grid gap-3 md:grid-cols-3">
        <StatCard label="Total" value={String(campaigns.length)} />
        <StatCard
          label="Ready"
          value={String(campaigns.filter((item) => item.status === "ready").length)}
        />
        <StatCard
          label="Filtered"
          value={String(filteredCampaigns.length)}
        />
      </section>

      <section className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4">
        <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
              Campaign library
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.06em] text-white">
              Saved campaigns
            </h2>
          </div>

          <div className="flex h-11 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.055] px-3 md:w-[320px]">
            <Search size={16} className="text-white/35" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search campaigns..."
              className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/30"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.045] p-5">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-white/45">
              Loading campaigns...
            </p>
          </div>
        ) : !activeBrand ? (
          <BrandRequiredState />
        ) : filteredCampaigns.length === 0 ? (
          <EmptyState hasQuery={query.length > 0} />
        ) : (
          <div className="grid gap-3">
            {filteredCampaigns.map((campaign) => (
              <CampaignListItem key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <div className="mb-5 grid h-10 w-10 place-items-center rounded-xl bg-[#d9ff3f] text-[#070816]">
        <Megaphone size={18} />
      </div>

      <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-white/35">
        {label}
      </p>

      <h3 className="mt-2 text-3xl font-black tracking-[-0.07em] text-white">
        {value}
      </h3>
    </div>
  )
}

function CampaignListItem({ campaign }: { campaign: RecentCampaign }) {
  const date = new Date(campaign.createdAt).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  return (
    <div className="grid gap-4 rounded-[1.2rem] border border-white/10 bg-white/[0.045] p-4 transition hover:border-orange-400/30 lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-lg font-black tracking-[-0.05em] text-white">
            {campaign.productName || "Untitled campaign"}
          </h3>

          <span className="rounded-full bg-[#d9ff3f] px-3 py-1 text-[0.58rem] font-black uppercase tracking-[0.16em] text-[#070816]">
            {campaign.status}
          </span>
        </div>

        <div className="mt-3 grid gap-2 text-xs font-bold text-white/45 md:grid-cols-4">
          <InfoItem label="Category" value={campaign.category || "—"} />
          <InfoItem label="Angle" value={campaign.selectedAngleTitle || "—"} />
          <InfoItem label="Variant" value={campaign.selectedVariantName || "—"} />
          <InfoItem label="Created" value={date} />
        </div>
      </div>

      <Link
        href={`/dashboard/campaigns/${campaign.id}`}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.065] px-4 text-xs font-black text-white/72 transition hover:bg-white/[0.1]"
      >
        View
        <ArrowRight size={15} />
      </Link>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[0.56rem] font-black uppercase tracking-[0.18em] text-white/28">
        {label}
      </p>
      <p className="mt-1 truncate text-xs font-bold text-white/58">{value}</p>
    </div>
  )
}

function BrandRequiredState() {
  return (
    <div className="grid min-h-[240px] place-items-center rounded-[1.2rem] border border-dashed border-orange-400/25 bg-orange-500/10 p-6 text-center">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.07] text-white/55">
          <Globe size={24} />
        </div>

        <h3 className="mt-4 text-2xl font-black tracking-[-0.06em] text-white">
          Brand DNA required
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm font-bold leading-6 text-white/42">
          Setup or select an active brand before viewing campaigns.
        </p>

        <Link href="/dashboard/brand-dna" className="mt-5 inline-flex wizard-primary-btn">
          Setup Brand DNA
        </Link>
      </div>
    </div>
  )
}

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  return (
    <div className="grid min-h-[240px] place-items-center rounded-[1.2rem] border border-dashed border-white/15 bg-white/[0.035] p-6 text-center">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.07] text-white/55">
          {hasQuery ? <Search size={24} /> : <FileText size={24} />}
        </div>

        <h3 className="mt-4 text-2xl font-black tracking-[-0.06em] text-white">
          {hasQuery ? "No match found" : "No campaigns yet"}
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm font-bold leading-6 text-white/42">
          {hasQuery
            ? "Try a different search term."
            : "Create your first campaign for this active brand."}
        </p>

        {!hasQuery && (
          <Link
            href="/dashboard/campaigns/new"
            className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-[#d9ff3f] px-5 text-sm font-black text-[#070816]"
          >
            <Plus size={17} />
            Create campaign
          </Link>
        )}
      </div>
    </div>
  )
}
