"use client"

import { GhostCommandPanel } from "@/components/shared/ghost-command-panel"
import { getCampaignAssetBrief, type CampaignAssetBrief } from "@/lib/campaign-asset-brief"
import {
  buildCampaignExportText,
  downloadTextFile,
} from "@/lib/campaign-export-pack"
import { refineCampaignWithGhostEditor } from "@/lib/campaign-ghost-editor-api"
import {
  getGeneratedAssetsForBrief,
  type CampaignGeneratedAsset,
} from "@/lib/campaign-generated-assets"
import { getCampaignOutput, type CampaignOutput } from "@/lib/campaign-output"
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

export function CampaignResult({ campaignId }: { campaignId: string }) {
  const [output, setOutput] = useState<CampaignOutput | null>(null)
  const [assetBrief, setAssetBrief] = useState<CampaignAssetBrief | null>(null)
  const [generatedAssets, setGeneratedAssets] = useState<CampaignGeneratedAsset[]>([])
  const [copied, setCopied] = useState("")
  const [ghostIsRunning, setGhostIsRunning] = useState(false)
  const [ghostError, setGhostError] = useState("")
  const [ghostSuccess, setGhostSuccess] = useState("")

  const loadOutput = useCallback(async () => {
    const data = await getCampaignOutput(campaignId)
    setOutput(data)

    const brief = await getCampaignAssetBrief(data.id)
    setAssetBrief(brief)

    if (brief) {
      const assets = await getGeneratedAssetsForBrief(brief.id)
      setGeneratedAssets(assets)
    } else {
      setGeneratedAssets([])
    }
  }, [campaignId])

  useEffect(() => {
    loadOutput()
  }, [loadOutput])

  async function copyText(label: string, text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(label)

    setTimeout(() => {
      setCopied("")
    }, 1200)
  }

  async function handleGhostEdit(instruction: string) {
    if (!output) return

    setGhostError("")
    setGhostSuccess("")
    setGhostIsRunning(true)

    try {
      const result = await refineCampaignWithGhostEditor({
        campaignOutputId: output.id,
        instruction,
      })

      setGhostSuccess(result.actionSummary)

      await loadOutput()
    } catch (error) {
      setGhostError(
        error instanceof Error ? error.message : "Could not apply Ghost Editor change.",
      )
    } finally {
      setGhostIsRunning(false)
    }
  }

  if (!output) {
    return (
      <div className="mx-auto max-w-[1120px] rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-8 text-white">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-300">
          Loading campaign...
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1120px] space-y-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <p className="text-[0.62rem] font-black uppercase tracking-[0.26em] text-orange-300">
            Campaign ready
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-[-0.07em] text-white md:text-4xl">
            {output.campaignHeadline || "Your Dhoom output"}
          </h1>

          {output.editCount > 0 && (
            <span className="mt-3 inline-flex items-center rounded-full border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 px-3 py-1 text-[0.6rem] font-black uppercase tracking-[0.16em] text-[#d9ff3f]">
              Ghost edited {output.editCount}x
            </span>
          )}

          <p className="mt-2 text-sm font-bold text-white/45">
            Final campaign pack ready to copy and use.
          </p>
        </div>

        <Link href="/dashboard/campaigns/new" className="wizard-primary-btn">
          <Wand2 size={17} />
          New campaign
        </Link>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <GhostCommandPanel
            title="Ask Dhoom to change anything"
            subtitle="Change tone, CTA, WhatsApp copy, poster direction, reel direction, or seasonal angle without opening a manual editor."
            isRunning={ghostIsRunning}
            successMessage={ghostSuccess}
            error={ghostError}
            onSubmit={handleGhostEdit}
          />

          <OutputCard
            title="Campaign angle"
            text={output.campaignAngle}
            copied={copied}
            onCopy={() => copyText("Campaign angle", output.campaignAngle)}
          />

          {output.buyerInsight && (
            <OutputCard
              title="Buyer insight"
              text={output.buyerInsight}
              copied={copied}
              onCopy={() => copyText("Buyer insight", output.buyerInsight || "")}
            />
          )}

          <OutputCard
            title="Caption"
            text={output.caption}
            copied={copied}
            onCopy={() => copyText("Caption", output.caption)}
          />

          <OutputCard
            title="WhatsApp copy"
            text={output.whatsappCopy}
            copied={copied}
            onCopy={() => copyText("WhatsApp copy", output.whatsappCopy)}
          />

          <OutputCard
            title="Poster direction"
            text={output.posterDirection}
            copied={copied}
            onCopy={() =>
              copyText("Poster direction", output.posterDirection)
            }
          />

          {output.reelDirection && (
            <OutputCard
              title="Reel direction"
              text={output.reelDirection}
              copied={copied}
              onCopy={() =>
                copyText("Reel direction", output.reelDirection || "")
              }
            />
          )}
        </div>

        <aside className="space-y-4">
          <CampaignExportPack
            output={output}
            assetBrief={assetBrief}
            generatedAssets={generatedAssets}
            copied={copied}
            onCopy={copyText}
          />

          <QualityPanel output={output} />

          <div className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
                Story flow
              </p>

              <Sparkles size={18} className="text-[#d9ff3f]" />
            </div>

            <div className="grid gap-2">
              {output.storyFlow.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="rounded-xl border border-white/10 bg-white/[0.055] p-3"
                >
                  <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-[#d9ff3f]">
                    Story {index + 1}
                  </p>

                  <p className="mt-2 text-sm font-bold leading-6 text-white/65">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <SmallCard title="Offer idea" value={output.offerIdea} />
          <SmallCard title="CTA" value={output.primaryCta || "Message to order"} />

          <RuleCard title="Do" items={output.doRules} />
          <RuleCard title="Avoid" items={output.avoidRules} />
        </aside>
      </section>
    </div>
  )
}

function CampaignExportPack({
  output,
  assetBrief,
  generatedAssets,
  copied,
  onCopy,
}: {
  output: CampaignOutput
  assetBrief: CampaignAssetBrief | null
  generatedAssets: CampaignGeneratedAsset[]
  copied: string
  onCopy: (label: string, text: string) => void
}) {
  const selectedPoster = generatedAssets.find(
    (asset) => asset.assetType === "poster" && asset.assetUrl,
  )

  const exportText = buildCampaignExportText({
    output,
    assetBrief,
    generatedAssets,
  })

  const isCopied = copied === "Export pack"

  function handleDownload() {
    const safeName =
      output.campaignHeadline
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "dhoom-campaign"

    downloadTextFile(`${safeName}-export-pack.txt`, exportText)
  }

  return (
    <div className="rounded-[1.4rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
            Export pack
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-[-0.06em] text-white">
            Ready-to-post package
          </h2>

          <p className="mt-2 text-sm font-bold leading-6 text-white/55">
            Copy or download the full campaign package for posting, sharing, or
            designer handoff.
          </p>
        </div>

        <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#d9ff3f] text-[#070816]">
          <PackageCheck size={20} />
        </div>
      </div>

      <div className="grid gap-2">
        <button
          onClick={() => onCopy("Export pack", exportText)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#d9ff3f] px-4 text-xs font-black text-[#070816]"
        >
          {isCopied ? <Check size={15} /> : <Copy size={15} />}
          {isCopied ? "Copied" : "Copy full pack"}
        </button>

        <button
          onClick={handleDownload}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.065] px-4 text-xs font-black text-white/72 transition hover:bg-white/[0.1]"
        >
          <Download size={15} />
          Download .txt
        </button>

        {selectedPoster?.assetUrl ? (
          <a
            href={selectedPoster.assetUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.065] px-4 text-xs font-black text-white/72 transition hover:bg-white/[0.1]"
          >
            <ExternalLink size={15} />
            Open selected poster
          </a>
        ) : (
          <Link
            href="/dashboard/creative-lab"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-orange-400/20 bg-orange-500/10 px-4 text-xs font-black text-orange-200 transition hover:bg-orange-500/15"
          >
            <FileText size={15} />
            Generate poster in Creative Lab
          </Link>
        )}
      </div>
    </div>
  )
}

function QualityPanel({ output }: { output: CampaignOutput }) {
  const score = output.campaignScore ?? 0

  const scoreLabel =
    score >= 85 ? "Strong" : score >= 70 ? "Usable" : "Needs review"

  return (
    <div className="rounded-[1.4rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
            Quality score
          </p>

          <h2 className="mt-1 text-3xl font-black tracking-[-0.07em] text-white">
            {score}/100
          </h2>

          <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-white/45">
            {scoreLabel} / {output.qualityStatus || "checked"}
          </p>
        </div>

        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
          <ShieldCheck size={22} />
        </div>
      </div>

      {output.improvementsApplied.length > 0 && (
        <div className="mt-3">
          <p className="mb-2 text-[0.56rem] font-black uppercase tracking-[0.18em] text-white/35">
            Improvements applied
          </p>

          <div className="grid gap-2">
            {output.improvementsApplied.slice(0, 4).map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-bold leading-5 text-white/62"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {output.riskFlags.length > 0 && (
        <div className="mt-3 rounded-xl border border-orange-400/25 bg-orange-500/10 p-3">
          <div className="mb-2 flex items-center gap-2 text-orange-200">
            <AlertTriangle size={15} />
            <p className="text-[0.56rem] font-black uppercase tracking-[0.18em]">
              Risk flags
            </p>
          </div>

          <div className="grid gap-2">
            {output.riskFlags.map((item) => (
              <p
                key={item}
                className="text-xs font-bold leading-5 text-orange-100/75"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function OutputCard({
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
    <div className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
          {title}
        </p>

        <button
          onClick={onCopy}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-3 text-xs font-black text-white/65 transition hover:bg-white/[0.1]"
        >
          {isCopied ? <Check size={15} /> : <Copy size={15} />}
          {isCopied ? "Copied" : "Copy"}
        </button>
      </div>

      <p className="whitespace-pre-line text-sm font-bold leading-7 text-white/68">
        {text}
      </p>
    </div>
  )
}

function SmallCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
      <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
        {title}
      </p>

      <h3 className="mt-2 text-xl font-black tracking-[-0.05em] text-white">
        {value}
      </h3>
    </div>
  )
}

function RuleCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <p className="mb-3 text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
        {title}
      </p>

      <div className="grid gap-2">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-xl border border-white/10 bg-white/[0.055] px-3 py-3 text-sm font-bold leading-6 text-white/62"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
