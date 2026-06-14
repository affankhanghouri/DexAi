"use client"

import { getBrandProfile, type BrandProfile } from "@/lib/brand-profile"
import {
  clearBrandProfileId,
  getBrandProfileId,
} from "@/lib/brand-profile-session"
import {
  generatePosterAsset,
  getCreativeLabAssets,
  getCreativeLabBriefs,
  refineCreativeBrief,
  type CreativeLabAsset,
  type CreativeLabBrief,
} from "@/lib/creative-lab-workspace"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  Check,
  Clapperboard,
  Copy,
  FileText,
  ImageIcon,
  Layers3,
  Loader2,
  PackageCheck,
  Palette,
  RefreshCw,
  Search,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

export function PremiumCreativeLab() {
  const [activeBrand, setActiveBrand] = useState<BrandProfile | null>(null)
  const [briefs, setBriefs] = useState<CreativeLabBrief[]>([])
  const [selectedBriefId, setSelectedBriefId] = useState("")
  const [assets, setAssets] = useState<CreativeLabAsset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingAssets, setIsLoadingAssets] = useState(false)
  const [isRefining, setIsRefining] = useState(false)
  const [generatingAssetId, setGeneratingAssetId] = useState("")
  const [copied, setCopied] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const selectedBrief =
    briefs.find((brief) => brief.id === selectedBriefId) || briefs[0] || null

  useEffect(() => {
    loadWorkspace()
  }, [])

  useEffect(() => {
    if (!selectedBrief?.id) return
    loadAssets(selectedBrief.id)
  }, [selectedBrief?.id])

  async function loadWorkspace() {
    setIsLoading(true)

    try {
      const brandId = getBrandProfileId()

      if (!brandId) {
        setActiveBrand(null)
        setBriefs([])
        return
      }

      const brand = await getBrandProfile(brandId)
      if (!brand) {
        clearBrandProfileId()
        setActiveBrand(null)
        setBriefs([])
        return
      }
      setActiveBrand(brand)

      const data = await getCreativeLabBriefs(brandId)
      setBriefs(data)

      if (data[0]) {
        setSelectedBriefId(data[0].id)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function loadAssets(assetBriefId: string) {
    setIsLoadingAssets(true)

    try {
      const data = await getCreativeLabAssets(assetBriefId)
      setAssets(data)
    } catch (error) {
      console.error(error)
      setAssets([])
    } finally {
      setIsLoadingAssets(false)
    }
  }

  async function copyText(label: string, text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(label)

    setTimeout(() => {
      setCopied("")
    }, 1200)
  }

  async function handleRefine(instruction: string) {
    if (!selectedBrief) return

    setIsRefining(true)

    try {
      await refineCreativeBrief({
        assetBriefId: selectedBrief.id,
        instruction,
      })

      await loadWorkspace()
    } finally {
      setIsRefining(false)
    }
  }

  async function handleGeneratePoster(asset: CreativeLabAsset) {
    setGeneratingAssetId(asset.id)

    try {
      await generatePosterAsset(asset.id)
      await loadAssets(asset.assetBriefId)
    } finally {
      setGeneratingAssetId("")
    }
  }

  const filteredBriefs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    if (!query) return briefs

    return briefs.filter((brief) =>
      [
        brief.productName,
        brief.category,
        brief.creativeBriefTitle,
        brief.campaignHeadline,
        brief.selectedAngleTitle,
        brief.selectedVariantName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    )
  }, [briefs, searchQuery])

  if (isLoading) {
    return <CreativeLabLoading />
  }

  if (!activeBrand) {
    return <NoBrandCreativeLab />
  }

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <CreativeLabHero activeBrand={activeBrand} totalBriefs={briefs.length} />

      <section className="grid gap-5 xl:grid-cols-[330px_1fr_340px]">
        <aside className="space-y-4">
          <BriefSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <BriefVault
            briefs={filteredBriefs}
            selectedBriefId={selectedBrief?.id || ""}
            onSelect={setSelectedBriefId}
          />
        </aside>

        <main className="space-y-5">
          {selectedBrief ? (
            <>
              <CreativeBriefStudio
                brief={selectedBrief}
                copied={copied}
                onCopy={copyText}
              />

              <CreativeRefineStudio
                isRefining={isRefining}
                onRefine={handleRefine}
              />
            </>
          ) : (
            <EmptyCreativeLab />
          )}
        </main>

        <aside className="space-y-5">
          {selectedBrief && (
            <>
              <GeneratedAssetsStudio
                assets={assets}
                isLoading={isLoadingAssets}
                generatingAssetId={generatingAssetId}
                onGeneratePoster={handleGeneratePoster}
              />

              <CreativeLabStatusPanel brief={selectedBrief} />
            </>
          )}
        </aside>
      </section>
    </div>
  )
}

function CreativeLabHero({
  activeBrand,
  totalBriefs,
}: {
  activeBrand: BrandProfile
  totalBriefs: number
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.42 }}
      className="relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl md:p-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(217,255,63,0.22),transparent_34%),radial-gradient(circle_at_88%_34%,rgba(249,115,22,0.18),transparent_36%)]" />

      <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_330px] lg:items-end">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
            <Palette size={14} />
            Creative Lab
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-[-0.08em] text-white md:text-6xl">
            Asset studio for ready campaigns.
          </h1>

          <p className="mt-4 max-w-2xl text-sm font-bold leading-7 text-white/55 md:text-base">
            Open creative briefs for{" "}
            <span className="font-black text-white">
              {activeBrand.brandName || "your active brand"}
            </span>
            . Refine poster prompts, generate poster assets, and manage creative
            directions without touching a complex design tool.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <HeroPill tone="lime">Active brand loaded</HeroPill>
            <HeroPill tone="white">{totalBriefs} creative briefs</HeroPill>
            {activeBrand.category && (
              <HeroPill tone="orange">{activeBrand.category}</HeroPill>
            )}
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
          <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-[#d9ff3f]">
            Studio principle
          </p>

          <h3 className="mt-2 text-3xl font-black tracking-[-0.07em] text-white">
            Direction first.
            <span className="block text-[#d9ff3f]">Assets second.</span>
          </h3>

          <p className="mt-2 text-sm font-bold leading-6 text-white/50">
            Dhoom creates creative logic before creating visuals.
          </p>
        </div>
      </div>
    </motion.header>
  )
}

function BriefSearch({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string
  setSearchQuery: (value: string) => void
}) {
  return (
    <section className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
        Find brief
      </p>

      <div className="mt-3 flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 focus-within:border-[#d9ff3f]/35">
        <Search size={17} className="text-orange-300" />

        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search product, angle, variant..."
          className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/28"
        />
      </div>
    </section>
  )
}

function BriefVault({
  briefs,
  selectedBriefId,
  onSelect,
}: {
  briefs: CreativeLabBrief[]
  selectedBriefId: string
  onSelect: (id: string) => void
}) {
  return (
    <section className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
        Brief vault
      </p>

      <div className="mt-4 grid gap-2">
        {briefs.length === 0 ? (
          <p className="text-sm font-bold leading-6 text-white/42">
            No creative briefs found.
          </p>
        ) : (
          briefs.map((brief) => {
            const active = brief.id === selectedBriefId

            return (
              <button
                key={brief.id}
                onClick={() => onSelect(brief.id)}
                className={`rounded-2xl border p-3 text-left transition ${
                  active
                    ? "border-[#d9ff3f]/35 bg-[#d9ff3f]/10"
                    : "border-white/10 bg-white/[0.045] hover:bg-white/[0.075]"
                }`}
              >
                <div className="flex gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                    {brief.productImageUrl ? (
                      <img
                        src={brief.productImageUrl}
                        alt={brief.productName || "Product"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-white/35">
                        <ImageIcon size={18} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-white">
                      {brief.productName || brief.creativeBriefTitle}
                    </p>

                    <p className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-white/38">
                      {brief.campaignHeadline || brief.creativeBriefTitle}
                    </p>

                    {brief.refinementCount > 0 && (
                      <p className="mt-1 text-[0.55rem] font-black uppercase tracking-[0.14em] text-[#d9ff3f]">
                        Refined {brief.refinementCount}x
                      </p>
                    )}
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

function CreativeBriefStudio({
  brief,
  copied,
  onCopy,
}: {
  brief: CreativeLabBrief
  copied: string
  onCopy: (label: string, text: string) => void
}) {
  return (
    <section className="space-y-5">
      <div className="relative overflow-hidden rounded-[1.6rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4 md:p-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(217,255,63,0.18),transparent_34%),radial-gradient(circle_at_90%_34%,rgba(249,115,22,0.14),transparent_36%)]" />

        <div className="relative z-10">
          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
            Active creative brief
          </p>

          <h2 className="mt-2 text-4xl font-black tracking-[-0.08em] text-white">
            {brief.creativeBriefTitle}
          </h2>

          <p className="mt-3 max-w-2xl text-sm font-bold leading-7 text-white/58">
            {brief.productName || "Product"} ·{" "}
            {brief.selectedAngleTitle || "Campaign angle"} ·{" "}
            {brief.selectedVariantName || "Creative variant"}
          </p>
        </div>
      </div>

      <PromptCard
        icon={<ImageIcon size={20} />}
        label="Poster prompt"
        title="Static poster direction"
        text={brief.posterPrompt}
        copied={copied === "Poster prompt"}
        onCopy={() => onCopy("Poster prompt", brief.posterPrompt)}
      />

      <PromptCard
        icon={<Wand2 size={20} />}
        label="Image generation prompt"
        title="AI image prompt"
        text={brief.imageGenerationPrompt}
        copied={copied === "Image prompt"}
        onCopy={() => onCopy("Image prompt", brief.imageGenerationPrompt)}
      />

      <PromptCard
        icon={<Clapperboard size={20} />}
        label="Reel prompt"
        title="Video / reel direction"
        text={brief.reelPrompt}
        copied={copied === "Reel prompt"}
        onCopy={() => onCopy("Reel prompt", brief.reelPrompt)}
      />

      <section className="grid gap-4 md:grid-cols-2">
        <ListPanel
          title="Poster design rules"
          items={brief.posterDesignRules}
          empty="No design rules found."
        />

        <ListPanel
          title="Reel shot list"
          items={brief.reelShotList}
          empty="No reel shots found."
        />

        <ListPanel
          title="Designer notes"
          items={brief.designerNotes}
          empty="No designer notes found."
        />

        <ListPanel
          title="Asset risks"
          items={brief.assetRisks}
          empty="No asset risks found."
        />
      </section>
    </section>
  )
}

function PromptCard({
  icon,
  label,
  title,
  text,
  copied,
  onCopy,
}: {
  icon: React.ReactNode
  label: string
  title: string
  text: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <section className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.09),transparent_38%,rgba(217,255,63,0.055))]" />
      <div className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-white/10 blur-xl transition duration-700 group-hover:translate-x-[120%]" />

      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
            {icon}
          </div>

          <button
            onClick={onCopy}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.065] px-3 text-xs font-black text-white/65 transition hover:bg-[#d9ff3f] hover:text-[#070816]"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-orange-300">
          {label}
        </p>

        <h3 className="mt-1 text-2xl font-black tracking-[-0.06em] text-white">
          {title}
        </h3>

        <p className="mt-3 whitespace-pre-line text-sm font-bold leading-7 text-white/58">
          {text}
        </p>
      </div>
    </section>
  )
}

function CreativeRefineStudio({
  isRefining,
  onRefine,
}: {
  isRefining: boolean
  onRefine: (instruction: string) => void
}) {
  const [instruction, setInstruction] = useState("")

  const quickActions = [
    "Make poster more premium and less cluttered.",
    "Make reel more high-energy.",
    "Make it Eid-focused but still premium.",
    "Make the prompt better for a clean product ad.",
    "Make it less English-heavy.",
    "Make CTA stronger for WhatsApp orders.",
  ]

  function submit(value?: string) {
    const finalInstruction = (value || instruction).trim()
    if (!finalInstruction) return
    onRefine(finalInstruction)
    setInstruction("")
  }

  return (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-orange-400/20 bg-orange-500/10 p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(249,115,22,0.18),transparent_40%)]" />

      <div className="relative z-10">
        <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
          Creative Ghost Editor
        </p>

        <h3 className="mt-2 text-3xl font-black tracking-[-0.07em] text-white">
          Refine the creative direction.
        </h3>

        <p className="mt-2 text-sm font-bold leading-6 text-white/48">
          Tell Dhoom how to adjust the poster/reel brief without manually
          rewriting prompts.
        </p>

        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {quickActions.map((action) => (
            <button
              key={action}
              onClick={() => submit(action)}
              disabled={isRefining}
              className="inline-flex min-h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.055] px-3 text-xs font-black text-white/68 transition hover:bg-white/[0.09] disabled:cursor-wait disabled:opacity-50"
            >
              {action}
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={instruction}
            onChange={(event) => setInstruction(event.target.value)}
            disabled={isRefining}
            placeholder="e.g. Make poster cleaner with more luxury spacing..."
            className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-black/25 px-4 text-sm font-bold text-white outline-none placeholder:text-white/28"
          />

          <button
            onClick={() => submit()}
            disabled={isRefining || !instruction.trim()}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#d9ff3f] px-5 text-xs font-black text-[#070816] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRefining ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Wand2 size={16} />
            )}
          </button>
        </div>
      </div>
    </section>
  )
}

function GeneratedAssetsStudio({
  assets,
  isLoading,
  generatingAssetId,
  onGeneratePoster,
}: {
  assets: CreativeLabAsset[]
  isLoading: boolean
  generatingAssetId: string
  onGeneratePoster: (asset: CreativeLabAsset) => void
}) {
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
        Generated assets
      </p>

      <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-white">
        Asset slots
      </h3>

      {isLoading ? (
        <div className="mt-4 grid min-h-40 place-items-center text-white/45">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : (
        <div className="mt-4 grid gap-3">
          {assets.length === 0 ? (
            <p className="text-sm font-bold leading-6 text-white/42">
              No asset slots found.
            </p>
          ) : (
            assets.map((asset) => (
              <AssetSlotCard
                key={asset.id}
                asset={asset}
                isGenerating={generatingAssetId === asset.id}
                onGeneratePoster={() => onGeneratePoster(asset)}
              />
            ))
          )}
        </div>
      )}
    </section>
  )
}

function AssetSlotCard({
  asset,
  isGenerating,
  onGeneratePoster,
}: {
  asset: CreativeLabAsset
  isGenerating: boolean
  onGeneratePoster: () => void
}) {
  const isPoster = asset.assetType === "poster"

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045]">
      {asset.assetUrl ? (
        <img
          src={asset.assetUrl}
          alt={asset.title}
          className="aspect-[4/5] w-full object-cover"
        />
      ) : (
        <div className="grid aspect-[4/5] place-items-center bg-black/25 text-white/35">
          {isPoster ? <ImageIcon size={34} /> : <Clapperboard size={34} />}
        </div>
      )}

      <div className="p-3">
        <p className="text-[0.55rem] font-black uppercase tracking-[0.16em] text-white/35">
          {asset.assetSlot}
        </p>

        <h4 className="mt-1 text-lg font-black tracking-[-0.05em] text-white">
          {asset.title}
        </h4>

        <p className="mt-1 text-xs font-bold leading-5 text-white/42">
          {asset.description || asset.status}
        </p>

        {asset.assetUrl ? (
          <a
            href={asset.assetUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#d9ff3f] px-3 text-xs font-black text-[#070816]"
          >
            Open asset
            <ArrowRight size={14} />
          </a>
        ) : isPoster ? (
          <button
            onClick={onGeneratePoster}
            disabled={isGenerating}
            className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#d9ff3f] px-3 text-xs font-black text-[#070816] disabled:cursor-wait disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Wand2 size={14} />
            )}
            {isGenerating ? "Generating..." : "Generate poster"}
          </button>
        ) : (
          <div className="mt-3 rounded-xl border border-white/10 bg-black/25 p-3">
            <p className="text-xs font-bold text-white/38">
              Reel generation is planned for later.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function CreativeLabStatusPanel({ brief }: { brief: CreativeLabBrief }) {
  const confidence = Math.round((brief.confidence || 0.75) * 100)

  return (
    <section className="rounded-[1.5rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
        <BadgeCheck size={22} />
      </div>

      <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
        Brief status
      </p>

      <h3 className="mt-2 text-3xl font-black tracking-[-0.07em] text-white">
        {confidence}%
      </h3>

      <p className="mt-2 text-sm font-bold leading-6 text-white/52">
        {brief.refinementCount > 0
          ? `Refined ${brief.refinementCount} time(s).`
          : "Original creative brief from final campaign."}
      </p>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
        <p className="text-xs font-bold leading-5 text-white/52">
          Dhoom prepares the creative logic. You generate or copy assets when
          ready.
        </p>
      </div>
    </section>
  )
}

function ListPanel({
  title,
  items,
  empty,
}: {
  title: string
  items: string[]
  empty: string
}) {
  return (
    <section className="rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-4">
      <h3 className="text-xl font-black tracking-[-0.05em] text-white">
        {title}
      </h3>

      <div className="mt-3 grid gap-2">
        {items.length === 0 ? (
          <p className="text-sm font-bold text-white/38">{empty}</p>
        ) : (
          items.slice(0, 6).map((item) => (
            <div key={item} className="flex gap-2">
              <Check size={14} className="mt-0.5 shrink-0 text-[#d9ff3f]" />
              <p className="text-xs font-bold leading-5 text-white/56">
                {item}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

function EmptyCreativeLab() {
  return (
    <section className="grid min-h-[420px] place-items-center rounded-[1.7rem] border border-dashed border-white/15 bg-white/[0.035] p-6 text-center">
      <div>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
          <FileText size={30} />
        </div>

        <h2 className="mt-5 text-4xl font-black tracking-[-0.08em] text-white">
          No creative briefs yet.
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm font-bold leading-7 text-white/45">
          Generate a final campaign first. Dhoom will automatically create a
          creative brief and asset slots.
        </p>

        <Link
          href="/dashboard/campaigns/new"
          className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#d9ff3f] px-6 text-sm font-black text-[#070816]"
        >
          Create campaign
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  )
}

function NoBrandCreativeLab() {
  return (
    <div className="mx-auto grid min-h-[520px] max-w-[1180px] place-items-center rounded-[1.8rem] border border-orange-400/20 bg-orange-500/10 p-6 text-center">
      <div>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-orange-400 text-[#070816]">
          <Brain size={30} />
        </div>

        <h1 className="mt-5 text-4xl font-black tracking-[-0.08em] text-white">
          Brand DNA required first.
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm font-bold leading-7 text-white/50">
          Creative Lab needs an active brand workspace and generated campaign
          briefs.
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

function CreativeLabLoading() {
  return (
    <div className="mx-auto grid min-h-[520px] max-w-[1180px] place-items-center rounded-[1.8rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-6 text-center">
      <div>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
          <RefreshCw size={28} className="animate-spin" />
        </div>

        <h1 className="mt-5 text-4xl font-black tracking-[-0.08em] text-white">
          Loading Creative Lab...
        </h1>

        <p className="mt-3 text-sm font-bold text-white/45">
          Dhoom is opening your creative asset studio.
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
