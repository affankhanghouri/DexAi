"use client"

import { refineCampaignAssetBrief } from "@/lib/campaign-asset-brief-refinement-api"
import {
  ensureGeneratedAssetSlots,
  getGeneratedAssetsForBrief,
  type CampaignGeneratedAsset,
} from "@/lib/campaign-generated-assets"
import {
  getGeneratedAssetVersions,
  selectGeneratedAssetVersion,
  type GeneratedAssetVersion,
} from "@/lib/generated-asset-versions"
import { generatePosterAsset } from "@/lib/poster-generation-api"
import { getBrandProfile, type BrandProfile } from "@/lib/brand-profile"
import {
  clearBrandProfileId,
  getBrandProfileId,
} from "@/lib/brand-profile-session"
import {
  getCreativeLabAssets,
  type CreativeLabAsset,
} from "@/lib/creative-lab-assets"
import {
  ArrowRight,
  Check,
  Clapperboard,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  Globe,
  ImageIcon,
  Layers,
  Loader2,
  Megaphone,
  PackageCheck,
  RefreshCw,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Wand2,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"

export function CreativeLabPage() {
  const [activeBrand, setActiveBrand] = useState<BrandProfile | null>(null)
  const [assets, setAssets] = useState<CreativeLabAsset[]>([])
  const [selectedAssetId, setSelectedAssetId] = useState("")
  const [query, setQuery] = useState("")
  const [copied, setCopied] = useState("")
  const [refiningAssetId, setRefiningAssetId] = useState("")
  const [refineError, setRefineError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadCreativeLab() {
      try {
        const brandId = getBrandProfileId()

        if (!brandId) {
          setActiveBrand(null)
          setAssets([])
          return
        }

        const brand = await getBrandProfile(brandId)
        if (!brand) {
          clearBrandProfileId()
          setActiveBrand(null)
          setAssets([])
          return
        }
        setActiveBrand(brand)

        const data = await getCreativeLabAssets(brandId)
        setAssets(data)

        if (data.length > 0) {
          setSelectedAssetId(data[0].id)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCreativeLab()
  }, [])

  const filteredAssets = useMemo(() => {
    const search = query.trim().toLowerCase()

    if (!search) return assets

    return assets.filter((asset) => {
      const text = [
        asset.creativeBriefTitle,
        asset.campaign.productName,
        asset.campaign.category,
        asset.campaign.selectedAngleTitle,
        asset.campaign.selectedVariantName,
        asset.posterPrompt,
        asset.reelPrompt,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return text.includes(search)
    })
  }, [assets, query])

  const selectedAsset =
    filteredAssets.find((asset) => asset.id === selectedAssetId) ||
    filteredAssets[0] ||
    null

  async function copyText(label: string, text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(label)

    setTimeout(() => {
      setCopied("")
    }, 1200)
  }

  async function handleRefineAsset(assetId: string, instruction: string) {
    setRefineError("")

    if (!instruction.trim()) {
      setRefineError("Please enter a refinement instruction.")
      return
    }

    setRefiningAssetId(assetId)

    try {
      const result = await refineCampaignAssetBrief({
        assetBriefId: assetId,
        refineInstruction: instruction,
      })

      setAssets((current) =>
        current.map((asset) => {
          if (asset.id !== result.brief.id) return asset

          return {
            ...asset,
            creativeBriefTitle: result.brief.creativeBriefTitle,

            posterPrompt: result.brief.posterPrompt,
            imageGenerationPrompt: result.brief.imageGenerationPrompt,
            posterLayoutDirection: result.brief.posterLayoutDirection,
            posterTextHierarchy: result.brief.posterTextHierarchy,
            posterDesignRules: result.brief.posterDesignRules,

            reelPrompt: result.brief.reelPrompt,
            videoGenerationPrompt: result.brief.videoGenerationPrompt,
            reelShotList: result.brief.reelShotList,
            reelSoundDirection: result.brief.reelSoundDirection,
            reelEditingStyle: result.brief.reelEditingStyle,

            designerNotes: result.brief.designerNotes,
            assetRisks: result.brief.assetRisks,

            confidence: result.brief.confidence,
            status: result.brief.status,

            refinementCount: result.brief.refinementCount,
            refinementNotes: result.brief.refinementNotes,
          }
        }),
      )
    } catch (error) {
      setRefineError(
        error instanceof Error ? error.message : "Could not refine asset brief.",
      )
    } finally {
      setRefiningAssetId("")
    }
  }

  return (
    <div className="mx-auto max-w-[1180px] space-y-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-[-0.07em] text-white md:text-4xl">
            Creative Lab
          </h1>

          <p className="mt-2 text-sm font-bold text-white/45">
            Poster and reel execution briefs for your active brand.
          </p>
        </div>

        {activeBrand ? (
          <Link href="/dashboard/campaigns/new" className="wizard-primary-btn">
            <Wand2 size={17} />
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
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
                Active brand
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-[-0.06em] text-white">
                {activeBrand.brandName || "Untitled brand"}
              </h2>

              <p className="mt-1 text-sm font-bold text-white/45">
                {activeBrand.category || "No category"} •{" "}
                {Math.round((activeBrand.confidence || 0) * 100)}% Brand DNA
                confidence
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

      <section className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4">
          <section className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
                  Assets
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-[-0.06em] text-white">
                  Campaign briefs
                </h2>
              </div>

              <span className="rounded-full bg-white/[0.06] px-3 py-2 text-xs font-black text-white/55">
                {filteredAssets.length}
              </span>
            </div>

            <div className="mb-4 flex h-11 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.055] px-3">
              <Search size={16} className="text-white/35" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search creative briefs..."
                className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/30"
              />
            </div>

            {isLoading ? (
              <LoadingCard />
            ) : !activeBrand ? (
              <BrandRequiredState />
            ) : filteredAssets.length === 0 ? (
              <EmptyCreativeState hasQuery={query.length > 0} />
            ) : (
              <div className="grid gap-3">
                {filteredAssets.map((asset) => (
                  <AssetListCard
                    key={asset.id}
                    asset={asset}
                    active={selectedAsset?.id === asset.id}
                    onClick={() => setSelectedAssetId(asset.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </aside>

        <main>
          {isLoading ? (
            <LoadingDetail />
          ) : !activeBrand ? (
            <BrandRequiredDetail />
          ) : !selectedAsset ? (
            <EmptyDetail />
          ) : (
            <CreativeBriefDetail
              asset={selectedAsset}
              copied={copied}
              refineError={refineError}
              isRefining={refiningAssetId === selectedAsset.id}
              onCopy={copyText}
              onRefine={(instruction) =>
                handleRefineAsset(selectedAsset.id, instruction)
              }
            />
          )}
        </main>
      </section>
    </div>
  )
}

function AssetListCard({
  asset,
  active,
  onClick,
}: {
  asset: CreativeLabAsset
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-[1.2rem] border p-4 text-left transition ${
        active
          ? "border-[#d9ff3f]/45 bg-[#d9ff3f]/10"
          : "border-white/10 bg-white/[0.045] hover:border-orange-400/30"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-black tracking-[-0.05em] text-white">
            {asset.campaign.productName || "Untitled campaign"}
          </h3>

          <p className="mt-1 truncate text-xs font-bold text-white/42">
            {asset.campaign.category || "No category"}
          </p>
        </div>

        <span
          className={`grid h-8 w-8 place-items-center rounded-xl ${
            active
              ? "bg-[#d9ff3f] text-[#070816]"
              : "bg-white/[0.07] text-white/45"
          }`}
        >
          <Sparkles size={16} />
        </span>
      </div>

      <p className="line-clamp-2 text-xs font-bold leading-5 text-white/48">
        {asset.creativeBriefTitle}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <TinyPill>{asset.campaign.selectedAngleTitle || "No angle"}</TinyPill>
        <TinyPill>{Math.round((asset.confidence || 0) * 100)}%</TinyPill>
      </div>
    </button>
  )
}

function CreativeBriefDetail({
  asset,
  copied,
  refineError,
  isRefining,
  onCopy,
  onRefine,
}: {
  asset: CreativeLabAsset
  copied: string
  refineError: string
  isRefining: boolean
  onCopy: (label: string, text: string) => void
  onRefine: (instruction: string) => void
}) {
  return (
    <div className="space-y-4">
      <section className="rounded-[1.4rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
          <div>
            <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
              Creative brief
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.07em] text-white">
              {asset.creativeBriefTitle}
            </h2>

            <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-white/50">
              <span>{asset.campaign.productName || "Untitled product"}</span>
              <span>•</span>
              <span>{asset.campaign.category || "No category"}</span>
              <span>•</span>
              <span>{asset.campaign.selectedVariantName || "No variant"}</span>
            </div>
          </div>

          <Link
            href={`/dashboard/campaigns/${asset.outputId}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-4 text-xs font-black text-white/70 transition hover:bg-white/[0.1]"
          >
            View campaign
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <AssetRefinementPanel
        asset={asset}
        error={refineError}
        isRefining={isRefining}
        onRefine={onRefine}
      />

      <GeneratedAssetSlotsPanel
        assetBriefId={asset.id}
        copied={copied}
        onCopy={onCopy}
      />

      <section className="grid gap-4 xl:grid-cols-2">
        <CreativeColumn
          icon={<ImageIcon size={18} />}
          title="Poster direction"
          subtitle="Static creative"
        >
          <PromptCard
            title="Poster prompt"
            text={asset.posterPrompt}
            copied={copied}
            onCopy={() => onCopy("Poster prompt", asset.posterPrompt)}
          />

          <PromptCard
            title="Image generation prompt"
            text={asset.imageGenerationPrompt}
            copied={copied}
            onCopy={() =>
              onCopy("Image generation prompt", asset.imageGenerationPrompt)
            }
          />

          <InfoCard
            title="Poster layout"
            value={asset.posterLayoutDirection}
          />

          <MiniList title="Text hierarchy" items={asset.posterTextHierarchy} />
          <MiniList title="Design rules" items={asset.posterDesignRules} />
        </CreativeColumn>

        <CreativeColumn
          icon={<Clapperboard size={18} />}
          title="Reel direction"
          subtitle="Short-form video"
        >
          <PromptCard
            title="Reel prompt"
            text={asset.reelPrompt}
            copied={copied}
            onCopy={() => onCopy("Reel prompt", asset.reelPrompt)}
          />

          <PromptCard
            title="Video generation prompt"
            text={asset.videoGenerationPrompt}
            copied={copied}
            onCopy={() =>
              onCopy("Video generation prompt", asset.videoGenerationPrompt)
            }
          />

          <MiniList title="Shot list" items={asset.reelShotList} />

          <InfoCard
            title="Sound direction"
            value={asset.reelSoundDirection || "Modern clean sound."}
          />

          <InfoCard
            title="Editing style"
            value={asset.reelEditingStyle || "Clean, product-focused cuts."}
          />
        </CreativeColumn>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <MiniList title="Designer notes" items={asset.designerNotes} />
        <MiniList title="Asset risks" items={asset.assetRisks} />
      </section>
    </div>
  )
}

function CreativeColumn({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: ReactNode
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <section className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#d9ff3f] text-[#070816]">
          {icon}
        </div>

        <div>
          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
            {subtitle}
          </p>

          <h3 className="text-2xl font-black tracking-[-0.06em] text-white">
            {title}
          </h3>
        </div>
      </div>

      <div className="space-y-3">{children}</div>
    </section>
  )
}

function PromptCard({
  title,
  text,
  copied,
  onCopy,
}: {
  title: string
  text: string
  copied: string
  onCopy: () => void
}) {
  const isCopied = copied === title

  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.045] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[0.58rem] font-black uppercase tracking-[0.2em] text-white/35">
          {title}
        </p>

        <button
          onClick={onCopy}
          className="inline-flex h-8 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-3 text-xs font-black text-white/65 transition hover:bg-white/[0.1]"
        >
          {isCopied ? <Check size={14} /> : <Copy size={14} />}
          {isCopied ? "Copied" : "Copy"}
        </button>
      </div>

      <p className="whitespace-pre-line text-sm font-bold leading-7 text-white/66">
        {text}
      </p>
    </div>
  )
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.045] p-4">
      <p className="text-[0.58rem] font-black uppercase tracking-[0.2em] text-white/35">
        {title}
      </p>

      <p className="mt-2 text-sm font-bold leading-7 text-white/62">{value}</p>
    </div>
  )
}

function MiniList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.045] p-4">
      <p className="mb-3 text-[0.58rem] font-black uppercase tracking-[0.2em] text-white/35">
        {title}
      </p>

      {items.length === 0 ? (
        <p className="text-sm font-bold text-white/40">No items.</p>
      ) : (
        <div className="grid gap-2">
          {items.map((item) => (
            <p
              key={item}
              className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-bold leading-5 text-white/62"
            >
              {item}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

function TinyPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1 text-[0.58rem] font-black uppercase tracking-[0.14em] text-white/45">
      {children}
    </span>
  )
}

function LoadingCard() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.045] p-5">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-white/45">
        Loading briefs...
      </p>
    </div>
  )
}

function LoadingDetail() {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-8">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-white/45">
        Loading Creative Lab...
      </p>
    </div>
  )
}

function BrandRequiredState() {
  return (
    <div className="rounded-[1.2rem] border border-orange-400/25 bg-orange-500/10 p-5 text-center">
      <Globe size={24} className="mx-auto text-orange-200" />

      <h3 className="mt-3 text-xl font-black tracking-[-0.05em] text-white">
        Brand required
      </h3>

      <p className="mt-2 text-sm font-bold leading-6 text-white/45">
        Setup or select an active brand first.
      </p>

      <Link
        href="/dashboard/brand-dna"
        className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-[#d9ff3f] px-4 text-xs font-black text-[#070816]"
      >
        Setup Brand DNA
      </Link>
    </div>
  )
}

function BrandRequiredDetail() {
  return (
    <div className="grid min-h-[520px] place-items-center rounded-[1.4rem] border border-orange-400/25 bg-orange-500/10 p-6 text-center">
      <div>
        <Globe size={32} className="mx-auto text-orange-200" />

        <h3 className="mt-4 text-3xl font-black tracking-[-0.07em] text-white">
          Brand DNA required
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm font-bold leading-6 text-white/45">
          Creative Lab needs an active brand because asset briefs belong to
          brand-specific campaigns.
        </p>

        <Link href="/dashboard/brand-dna" className="mt-5 inline-flex wizard-primary-btn">
          Setup Brand DNA
        </Link>
      </div>
    </div>
  )
}

function EmptyCreativeState({ hasQuery }: { hasQuery: boolean }) {
  return (
    <div className="rounded-[1.2rem] border border-dashed border-white/15 bg-white/[0.035] p-5 text-center">
      {hasQuery ? (
        <Search size={24} className="mx-auto text-white/45" />
      ) : (
        <FileText size={24} className="mx-auto text-white/45" />
      )}

      <h3 className="mt-3 text-xl font-black tracking-[-0.05em] text-white">
        {hasQuery ? "No match found" : "No creative briefs yet"}
      </h3>

      <p className="mt-2 text-sm font-bold leading-6 text-white/42">
        {hasQuery
          ? "Try a different search term."
          : "Generate a final campaign first. Dhoom will create asset briefs automatically."}
      </p>
    </div>
  )
}

function EmptyDetail() {
  return (
    <div className="grid min-h-[520px] place-items-center rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-6 text-center">
      <div>
        <Megaphone size={32} className="mx-auto text-white/35" />

        <h3 className="mt-4 text-3xl font-black tracking-[-0.07em] text-white">
          No brief selected
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm font-bold leading-6 text-white/42">
          Select a campaign brief from the left to view poster and reel
          directions.
        </p>
      </div>
    </div>
  )
}

function AssetRefinementPanel({
  asset,
  error,
  isRefining,
  onRefine,
}: {
  asset: CreativeLabAsset
  error: string
  isRefining: boolean
  onRefine: (instruction: string) => void
}) {
  const [customInstruction, setCustomInstruction] = useState("")

  const quickActions = [
    "Make the poster more premium, cleaner, and less cluttered.",
    "Make the reel more high-energy with faster pacing.",
    "Make it Eid-focused while keeping it premium.",
    "Make it wedding-season focused and elegant.",
    "Make copy simpler and less English-heavy.",
    "Make the CTA stronger for WhatsApp orders.",
  ]

  function submitCustom() {
    onRefine(customInstruction)
    setCustomInstruction("")
  }

  return (
    <section className="rounded-[1.4rem] border border-orange-400/20 bg-orange-500/10 p-4">
      <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
            Refine asset brief
          </p>

          <h3 className="mt-1 text-2xl font-black tracking-[-0.06em] text-white">
            Improve creative direction
          </h3>

          <p className="mt-2 text-sm font-bold leading-6 text-white/52">
            Refine poster and reel prompts without changing the campaign
            strategy.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3 text-right">
          <p className="text-[0.56rem] font-black uppercase tracking-[0.18em] text-white/35">
            Refined
          </p>
          <p className="mt-1 text-xl font-black text-white">
            {asset.refinementCount || 0}x
          </p>
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {quickActions.map((action) => (
          <button
            key={action}
            onClick={() => onRefine(action)}
            disabled={isRefining}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-3 py-3 text-xs font-black leading-5 text-white/68 transition hover:bg-white/[0.09] disabled:cursor-wait disabled:opacity-50"
          >
            {isRefining ? <RefreshCw size={15} className="animate-spin" /> : null}
            {action}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-2 md:flex-row">
        <div className="flex min-h-11 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.055] px-3">
          <SlidersHorizontal size={16} className="text-white/35" />
          <input
            value={customInstruction}
            onChange={(event) => setCustomInstruction(event.target.value)}
            placeholder="Custom refinement instruction..."
            className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/28"
          />
        </div>

        <button
          onClick={submitCustom}
          disabled={isRefining || !customInstruction.trim()}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-[#d9ff3f] px-5 text-sm font-black text-[#070816] transition disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isRefining ? <RefreshCw size={16} className="animate-spin" /> : null}
          {isRefining ? "Refining..." : "Refine"}
        </button>
      </div>

      {error && (
        <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
          {error}
        </p>
      )}

      {asset.refinementNotes.length > 0 && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.045] p-3">
          <p className="mb-2 text-[0.56rem] font-black uppercase tracking-[0.18em] text-white/35">
            Last refinements
          </p>

          <div className="grid gap-2">
            {asset.refinementNotes.slice(-3).map((note) => (
              <p
                key={note}
                className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-bold leading-5 text-white/58"
              >
                {note}
              </p>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function GeneratedAssetSlotsPanel({
  assetBriefId,
  copied,
  onCopy,
}: {
  assetBriefId: string
  copied: string
  onCopy: (label: string, text: string) => void
}) {
  const [assets, setAssets] = useState<CampaignGeneratedAsset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [generatingAssetId, setGeneratingAssetId] = useState("")

  useEffect(() => {
    async function loadSlots() {
      setIsLoading(true)
      setError("")

      try {
        let data = await getGeneratedAssetsForBrief(assetBriefId)

        if (data.length === 0) {
          data = await ensureGeneratedAssetSlots(assetBriefId)
        }

        setAssets(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load asset slots.")
      } finally {
        setIsLoading(false)
      }
    }

    loadSlots()
  }, [assetBriefId])

  async function handleGeneratePoster(assetId: string) {
    setError("")
    setGeneratingAssetId(assetId)

    try {
      const result = await generatePosterAsset(assetId)

      setAssets((current) =>
        current.map((asset) =>
          asset.id === result.asset.id ? result.asset : asset,
        ),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate poster.")
    } finally {
      setGeneratingAssetId("")
    }
  }

  return (
    <section className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
            Generated asset slots
          </p>

          <h3 className="mt-1 text-2xl font-black tracking-[-0.06em] text-white">
            Ready for generation
          </h3>

          <p className="mt-2 text-sm font-bold leading-6 text-white/48">
            These slots will store actual poster and reel assets when generation
            is connected.
          </p>
        </div>

        <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#d9ff3f] text-[#070816]">
          <Layers size={19} />
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.045] p-4">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-white/42">
            Loading asset slots...
          </p>
        </div>
      ) : error ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
          {error}
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {assets.map((asset) => (
            <GeneratedAssetSlotCard
              key={asset.id}
              asset={asset}
              copied={copied}
              isGenerating={generatingAssetId === asset.id}
              onCopy={onCopy}
              onGeneratePoster={() => handleGeneratePoster(asset.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function GeneratedAssetSlotCard({
  asset,
  copied,
  isGenerating,
  onCopy,
  onGeneratePoster,
}: {
  asset: CampaignGeneratedAsset
  copied: string
  isGenerating: boolean
  onCopy: (label: string, text: string) => void
  onGeneratePoster: () => void
}) {
  const isPoster = asset.assetType === "poster"
  const copyLabel = `${asset.title} prompt`
  const isCopied = copied === copyLabel
  const [versions, setVersions] = useState<GeneratedAssetVersion[]>([])
  const [isLoadingVersions, setIsLoadingVersions] = useState(false)
  const [versionError, setVersionError] = useState("")
  const selectedVersion = versions.find((version) => version.isSelected)
  const selectedAssetUrl = selectedVersion?.assetUrl || asset.assetUrl

  useEffect(() => {
    async function loadVersions() {
      if (!asset.assetUrl) {
        setVersions([])
        return
      }

      setIsLoadingVersions(true)
      setVersionError("")

      try {
        const data = await getGeneratedAssetVersions(asset.id)
        setVersions(data)
      } catch (err) {
        setVersionError(
          err instanceof Error ? err.message : "Could not load versions.",
        )
      } finally {
        setIsLoadingVersions(false)
      }
    }

    loadVersions()
  }, [asset.id, asset.assetUrl])

  async function handleSelectVersion(versionId: string) {
    setVersionError("")

    try {
      await selectGeneratedAssetVersion(versionId)

      const data = await getGeneratedAssetVersions(asset.id)
      setVersions(data)
    } catch (err) {
      setVersionError(
        err instanceof Error ? err.message : "Could not select version.",
      )
    }
  }

  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.045] p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-white/[0.07] text-white/55">
            {isPoster ? <ImageIcon size={18} /> : <Clapperboard size={18} />}
          </div>

          <p className="text-[0.56rem] font-black uppercase tracking-[0.18em] text-orange-300">
            {asset.assetType}
          </p>

          <h4 className="mt-1 text-xl font-black tracking-[-0.05em] text-white">
            {asset.title}
          </h4>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-2 text-[0.58rem] font-black uppercase tracking-[0.14em] text-white/45">
          <Clock size={13} />
          {asset.status}
        </span>
      </div>

      <p className="text-sm font-bold leading-6 text-white/48">
        {asset.description || "Asset slot prepared for future generation."}
      </p>

      {selectedAssetUrl && (
        <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black/30">
          <img
            src={selectedAssetUrl}
            alt={asset.title}
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
      )}

      <div className="mt-4 rounded-xl border border-white/10 bg-[#070816]/60 p-3">
        <p className="mb-2 text-[0.56rem] font-black uppercase tracking-[0.18em] text-white/30">
          Generation prompt
        </p>

        <p className="line-clamp-5 text-xs font-bold leading-5 text-white/58">
          {asset.generationPrompt}
        </p>
      </div>

      <div className="mt-4 grid gap-2">
        <button
          onClick={() => onCopy(copyLabel, asset.generationPrompt)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.065] px-4 text-xs font-black text-white/72 transition hover:bg-white/[0.1]"
        >
          {isCopied ? <Check size={15} /> : <Copy size={15} />}
          {isCopied ? "Copied" : "Copy generation prompt"}
        </button>

        {asset.assetType === "poster" ? (
          <>
            {selectedAssetUrl && (
            <a
              href={selectedAssetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white/[0.075] px-4 text-xs font-black text-white/72 transition hover:bg-white/[0.11]"
            >
              <ExternalLink size={15} />
              Open selected poster
            </a>
            )}

            <button
              onClick={onGeneratePoster}
              disabled={isGenerating}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#d9ff3f] px-4 text-xs font-black text-[#070816] transition disabled:cursor-wait disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader2 size={15} className="animate-spin" />
              ) : selectedAssetUrl ? (
                <RotateCcw size={15} />
              ) : null}

              {isGenerating
                ? "Generating..."
                : selectedAssetUrl
                  ? "Generate another version"
                  : "Generate poster"}
            </button>
          </>
        ) : (
          <button
            disabled
            className="inline-flex h-10 cursor-not-allowed items-center justify-center rounded-xl bg-[#d9ff3f]/20 px-4 text-xs font-black text-[#d9ff3f]/50"
          >
            Reel generation coming later
          </button>
        )}

        {asset.assetUrl && (
          <a
            href={`/dashboard/campaigns/${asset.outputId}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.065] px-4 text-xs font-black text-white/72 transition hover:bg-white/[0.1]"
          >
            <PackageCheck size={15} />
            Open export pack
          </a>
        )}
      </div>

      {asset.assetType === "poster" && selectedAssetUrl && (
        <div className="mt-4 rounded-xl border border-white/10 bg-[#070816]/60 p-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[0.56rem] font-black uppercase tracking-[0.18em] text-white/30">
              Poster versions
            </p>

            <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[0.56rem] font-black text-white/45">
              {versions.length}
            </span>
          </div>

          {isLoadingVersions ? (
            <p className="text-xs font-bold text-white/40">Loading versions...</p>
          ) : versionError ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200">
              {versionError}
            </p>
          ) : versions.length === 0 ? (
            <p className="text-xs font-bold text-white/40">No versions yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {versions.map((version) => (
                <button
                  key={version.id}
                  onClick={() => handleSelectVersion(version.id)}
                  className={`overflow-hidden rounded-xl border text-left transition ${
                    version.isSelected
                      ? "border-[#d9ff3f]/60 bg-[#d9ff3f]/10"
                      : "border-white/10 bg-white/[0.045] hover:border-orange-400/35"
                  }`}
                >
                  <div className="relative">
                    <img
                      src={version.thumbnailUrl || version.assetUrl}
                      alt={`Version ${version.versionNumber}`}
                      className="aspect-[4/5] w-full object-cover"
                    />

                    {version.isSelected && (
                      <div className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-[#d9ff3f] text-[#070816]">
                        <Star size={14} />
                      </div>
                    )}
                  </div>

                  <div className="p-2">
                    <p className="text-[0.56rem] font-black uppercase tracking-[0.14em] text-white/55">
                      Version {version.versionNumber}
                    </p>

                    <p className="mt-1 text-[0.58rem] font-bold text-white/35">
                      {version.isSelected ? "Selected" : "Click to select"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
