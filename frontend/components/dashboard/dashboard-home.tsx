"use client"

import {
  ArrowRight,
  Boxes,
  Brain,
  Globe,
  Megaphone,
  Plus,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  getRecentCampaigns,
  type RecentCampaign,
} from "@/lib/campaign-output"
import { getBrandProfile, type BrandProfile } from "@/lib/brand-profile"
import { getBrandProfileId } from "@/lib/brand-profile-session"

export function DashboardHome() {
  const [campaigns, setCampaigns] = useState<RecentCampaign[]>([])
  const [activeBrand, setActiveBrand] = useState<BrandProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getRecentCampaigns()
        setCampaigns(data)

        const brandId = getBrandProfileId()

        if (brandId) {
          const brand = await getBrandProfile(brandId)
          setActiveBrand(brand)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [])

  return (
    <div className="mx-auto max-w-[1120px] space-y-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-[-0.07em] text-white md:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm font-bold text-white/45">
            Manage campaigns and continue your work.
          </p>
        </div>

        <Link href="/dashboard/campaigns/new" className="wizard-primary-btn">
          <Plus size={17} />
          Create campaign
        </Link>
      </div>

      <ActiveBrandCard brand={activeBrand} />

      <section className="grid gap-3 md:grid-cols-3">
        <StatCard
          icon={<Megaphone size={18} />}
          label="Campaigns"
          value={String(campaigns.length)}
        />
        <StatCard
          icon={<Sparkles size={18} />}
          label="Ready"
          value={String(campaigns.filter((item) => item.status === "ready").length)}
        />
        <StatCard
          icon={<Boxes size={18} />}
          label="Products"
          value={String(campaigns.length)}
        />
      </section>

      <section className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
              Recent campaigns
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.06em] text-white">
              Your campaign work
            </h2>
          </div>

          <Link
            href="/dashboard/campaigns"
            className="rounded-xl border border-white/10 bg-white/[0.055] px-4 py-2 text-xs font-black text-white/65 transition hover:bg-white/[0.1]"
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.045] p-5">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-white/45">
              Loading campaigns...
            </p>
          </div>
        ) : campaigns.length === 0 ? (
          <EmptyCampaignState />
        ) : (
          <div className="grid gap-3">
            {campaigns.map((campaign) => (
              <CampaignRow key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-[1.3rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <div className="mb-5 grid h-10 w-10 place-items-center rounded-xl bg-[#d9ff3f] text-[#070816]">
        {icon}
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

function CampaignRow({ campaign }: { campaign: RecentCampaign }) {
  return (
    <div className="grid gap-3 rounded-[1.2rem] border border-white/10 bg-white/[0.045] p-4 transition hover:border-orange-400/30 md:grid-cols-[1fr_auto] md:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-lg font-black tracking-[-0.05em] text-white">
            {campaign.productName || "Untitled campaign"}
          </h3>

          <span className="rounded-full bg-[#d9ff3f] px-3 py-1 text-[0.58rem] font-black uppercase tracking-[0.16em] text-[#070816]">
            {campaign.status}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-white/42">
          <span>{campaign.category || "No category"}</span>
          <span>•</span>
          <span>{campaign.selectedAngleTitle || "No angle"}</span>
          <span>•</span>
          <span>{campaign.selectedVariantName || "No variant"}</span>
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

function EmptyCampaignState() {
  return (
    <div className="grid min-h-[240px] place-items-center rounded-[1.2rem] border border-dashed border-white/15 bg-white/[0.035] p-6 text-center">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.07] text-white/55">
          <Brain size={24} />
        </div>

        <h3 className="mt-4 text-2xl font-black tracking-[-0.06em] text-white">
          No campaigns yet
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm font-bold leading-6 text-white/42">
          Create your first campaign and it will appear here.
        </p>

        <Link
          href="/dashboard/campaigns/new"
          className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-[#d9ff3f] px-5 text-sm font-black text-[#070816]"
        >
          <Plus size={17} />
          Create campaign
        </Link>
      </div>
    </div>
  )
}

function ActiveBrandCard({ brand }: { brand: BrandProfile | null }) {
  if (!brand) {
    return (
      <div className="rounded-[1.4rem] border border-orange-400/25 bg-orange-500/10 p-4">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
              Brand DNA missing
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.06em] text-white">
              Setup your brand first
            </h2>
            <p className="mt-2 text-sm font-bold text-white/50">
              Dhoom needs Brand DNA before creating campaigns.
            </p>
          </div>

          <Link href="/dashboard/brand-dna" className="wizard-primary-btn">
            <Globe size={17} />
            Setup Brand DNA
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
            Active brand
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-[-0.06em] text-white">
            {brand.brandName || "Untitled brand"}
          </h2>

          <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-white/45">
            <span>{brand.category || "No category"}</span>
            <span>•</span>
            <span>{brand.pricePositioning || "No positioning"}</span>
            <span>•</span>
            <span>{Math.round((brand.confidence || 0) * 100)}% confidence</span>
          </div>
        </div>

        <Link
          href="/dashboard/brand-dna"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.055] px-4 text-xs font-black text-white/70 transition hover:bg-white/[0.1]"
        >
          View Brand DNA
        </Link>
      </div>
    </div>
  )
}
