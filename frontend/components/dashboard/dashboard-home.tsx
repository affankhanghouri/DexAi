"use client"

import {
  PremiumActionCard,
  PremiumEmptyState,
  PremiumPageShell,
  PremiumPanel,
  PremiumStatCard,
  PremiumStatusPill,
} from "@/components/shared/premium-ui"
import { getBrandProfile, type BrandProfile } from "@/lib/brand-profile"
import {
  clearBrandProfileId,
  getBrandProfileId,
} from "@/lib/brand-profile-session"
import { getRecentCampaigns, type RecentCampaign } from "@/lib/campaign-output"
import {
  ArrowRight,
  Brain,
  FileText,
  GalleryVerticalEnd,
  Globe,
  PackageCheck,
  Plus,
  Wand2,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

export function DashboardHome() {
  const [activeBrand, setActiveBrand] = useState<BrandProfile | null>(null)
  const [campaigns, setCampaigns] = useState<RecentCampaign[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
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

        const recent = await getRecentCampaigns(brandId)
        setCampaigns(recent)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    void loadDashboard()
  }, [])

  const latestCampaign = campaigns[0]

  const completionState = useMemo(() => {
    if (!activeBrand) {
      return {
        label: "Brand DNA needed",
        tone: "orange" as const,
      }
    }

    if (campaigns.length === 0) {
      return {
        label: "Ready for first campaign",
        tone: "lime" as const,
      }
    }

    return {
      label: "Campaign engine active",
      tone: "lime" as const,
    }
  }, [activeBrand, campaigns.length])

  if (isLoading) {
    return (
      <PremiumPageShell
        eyebrow="Dhoom operating center"
        title="Loading your campaign workspace..."
        subtitle="Dhoom is preparing your active brand, recent campaigns, and ready-to-use assets."
      >
        <PremiumPanel>
          <div className="grid gap-3 md:grid-cols-3">
            <SkeletonBlock />
            <SkeletonBlock />
            <SkeletonBlock />
          </div>
        </PremiumPanel>
      </PremiumPageShell>
    )
  }

  return (
    <PremiumPageShell
      eyebrow="Dhoom operating center"
      title={
        activeBrand
          ? `${activeBrand.brandName || "Your brand"} campaign brain`
          : "Build your AI campaign workspace"
      }
      subtitle={
        activeBrand
          ? "Your active brand is loaded. Create a campaign, open Creative Lab, or continue from your latest ready-to-post pack."
          : "Start with one public brand link. Dhoom will build Brand DNA and prepare your campaign engine without a long form."
      }
      action={
        activeBrand ? (
          <Link href="/dashboard/campaigns/new" className="wizard-primary-btn">
            <Plus size={17} />
            New campaign
          </Link>
        ) : (
          <Link href="/dashboard/brand-dna" className="wizard-primary-btn">
            <Globe size={17} />
            Setup Brand DNA
          </Link>
        )
      }
    >
      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <PremiumPanel>
            <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <PremiumStatusPill tone={completionState.tone}>
                  {completionState.label}
                </PremiumStatusPill>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.07em] text-white">
                  {activeBrand ? "What would you like to prepare?" : "Start here"}
                </h2>

                <p className="mt-2 max-w-xl text-sm font-bold leading-6 text-white/45">
                  Dhoom prepares the hard parts. You choose what to use.
                </p>
              </div>
            </div>

            {activeBrand ? (
              <div className="grid gap-3 md:grid-cols-3">
                <PremiumActionCard
                  icon={<Wand2 size={20} />}
                  title="Create campaign"
                  description="Upload product, choose direction, generate ready-to-post output."
                >
                  <Link
                    href="/dashboard/campaigns/new"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#d9ff3f] px-4 text-xs font-black text-[#070816]"
                  >
                    Start
                    <ArrowRight size={15} />
                  </Link>
                </PremiumActionCard>

                <PremiumActionCard
                  icon={<GalleryVerticalEnd size={20} />}
                  title="Creative Lab"
                  description="Open poster prompts, generated assets, versions, and refinements."
                >
                  <Link
                    href="/dashboard/creative-lab"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.065] px-4 text-xs font-black text-white/72"
                  >
                    Open lab
                    <ArrowRight size={15} />
                  </Link>
                </PremiumActionCard>

                <PremiumActionCard
                  icon={<Brain size={20} />}
                  title="Brand DNA"
                  description="Review active brand context, enrich it, or switch workspace."
                >
                  <Link
                    href="/dashboard/brand-dna"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.065] px-4 text-xs font-black text-white/72"
                  >
                    Open DNA
                    <ArrowRight size={15} />
                  </Link>
                </PremiumActionCard>
              </div>
            ) : (
              <PremiumEmptyState
                icon={<Globe size={28} />}
                title="Brand DNA required"
                description="Dhoom needs one public brand link first. After that, campaigns become guided and personalized."
                action={
                  <Link href="/dashboard/brand-dna" className="wizard-primary-btn">
                    Reconstruct my brand
                  </Link>
                }
              />
            )}
          </PremiumPanel>

          {activeBrand && (
            <PremiumPanel>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
                    Recent campaign packs
                  </p>

                  <h2 className="mt-1 text-3xl font-black tracking-[-0.07em] text-white">
                    Ready work
                  </h2>
                </div>

                <Link
                  href="/dashboard/campaigns"
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.065] px-4 text-xs font-black text-white/65"
                >
                  View all
                </Link>
              </div>

              {campaigns.length === 0 ? (
                <PremiumEmptyState
                  icon={<FileText size={28} />}
                  title="No campaigns yet"
                  description="Create your first campaign. Dhoom will generate copy, WhatsApp message, creative brief, and export pack."
                  action={
                    <Link href="/dashboard/campaigns/new" className="wizard-primary-btn">
                      Create first campaign
                    </Link>
                  }
                />
              ) : (
                <div className="grid gap-3">
                  {campaigns.slice(0, 4).map((campaign) => (
                    <RecentCampaignCard key={campaign.id} campaign={campaign} />
                  ))}
                </div>
              )}
            </PremiumPanel>
          )}
        </div>

        <aside className="space-y-4">
          <PremiumPanel>
            <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
              Workspace status
            </p>

            <div className="mt-4 grid gap-3">
              <PremiumStatCard
                label="Active brand"
                value={activeBrand ? "Loaded" : "Missing"}
                hint={
                  activeBrand
                    ? activeBrand.category || "Brand context ready"
                    : "Setup Brand DNA first"
                }
              />

              <PremiumStatCard
                label="Campaign packs"
                value={String(campaigns.length)}
                hint="Ready-to-use campaign outputs"
              />

              <PremiumStatCard
                label="Brand confidence"
                value={
                  activeBrand
                    ? `${Math.round((activeBrand.confidence || 0) * 100)}%`
                    : "0%"
                }
                hint="Improves with enrichment"
              />
            </div>
          </PremiumPanel>

          {latestCampaign && (
            <PremiumPanel className="border-[#d9ff3f]/20 bg-[#d9ff3f]/10">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
                <PackageCheck size={22} />
              </div>

              <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
                Latest ready pack
              </p>

              <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-white">
                {latestCampaign.productName || "Untitled campaign"}
              </h3>

              <p className="mt-2 text-sm font-bold leading-6 text-white/52">
                Continue from your latest generated campaign package.
              </p>

              <Link
                href={`/dashboard/campaigns/${latestCampaign.id}`}
                className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#d9ff3f] px-4 text-xs font-black text-[#070816]"
              >
                Open pack
                <ArrowRight size={15} />
              </Link>
            </PremiumPanel>
          )}

          <PremiumPanel>
            <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
              Dhoom principle
            </p>

            <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-white">
              Prepared, not dictated.
            </h3>

            <p className="mt-2 text-sm font-bold leading-6 text-white/48">
              No pressure, no fixed posting schedule. Dhoom prepares the
              campaign. The seller decides when and how to use it.
            </p>
          </PremiumPanel>
        </aside>
      </section>
    </PremiumPageShell>
  )
}

function RecentCampaignCard({ campaign }: { campaign: RecentCampaign }) {
  return (
    <Link
      href={`/dashboard/campaigns/${campaign.id}`}
      className="group relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.045] p-4 transition hover:border-[#d9ff3f]/35 hover:bg-white/[0.075]"
    >
      <div className="absolute inset-0 translate-x-[-120%] bg-white/10 blur-xl transition duration-700 group-hover:translate-x-[120%]" />

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap gap-2">
            <PremiumStatusPill tone="white">
              {campaign.category || "Campaign"}
            </PremiumStatusPill>

            {campaign.selectedAngleTitle && (
              <PremiumStatusPill tone="orange">
                {campaign.selectedAngleTitle}
              </PremiumStatusPill>
            )}
          </div>

          <h3 className="truncate text-xl font-black tracking-[-0.05em] text-white">
            {campaign.productName || "Untitled campaign"}
          </h3>

          <p className="mt-1 text-xs font-bold text-white/40">
            {new Date(campaign.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#d9ff3f] text-[#070816]">
          <ArrowRight size={17} />
        </div>
      </div>
    </Link>
  )
}

function SkeletonBlock() {
  return (
    <div className="h-36 animate-pulse rounded-[1.25rem] border border-white/10 bg-white/[0.045]" />
  )
}
