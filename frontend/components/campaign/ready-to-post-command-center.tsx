"use client"

import {
  buildCampaignExportText,
  downloadTextFile,
} from "@/lib/campaign-export-pack"
import type { CampaignAssetBrief } from "@/lib/campaign-asset-brief"
import type { CampaignGeneratedAsset } from "@/lib/campaign-generated-assets"
import type { CampaignOutput } from "@/lib/campaign-output"
import { motion } from "framer-motion"
import {
  Check,
  Download,
  ExternalLink,
  FileText,
  ImageIcon,
  MessageCircle,
  PackageCheck,
  Sparkles,
  Wand2,
} from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

export function ReadyToPostCommandCenter({
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

  const storyText = output.storyFlow
    .map((item, index) => `Story ${index + 1}: ${item}`)
    .join("\n")

  function downloadExportPack() {
    const safeName =
      output.campaignHeadline
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "dhoom-campaign"

    downloadTextFile(`${safeName}-ready-pack.txt`, exportText)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-[1.8rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.42)] md:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(217,255,63,0.18),transparent_42%),linear-gradient(315deg,rgba(249,115,22,0.14),transparent_46%)]" />

      <div className="relative z-10 grid gap-5 xl:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d9ff3f]/25 bg-black/20 px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
            <PackageCheck size={14} />
            Ready-to-post command center
          </div>

          <h2 className="max-w-3xl text-4xl font-black tracking-[-0.08em] text-white md:text-5xl">
            Your campaign is ready.
            <span className="block bg-gradient-to-r from-orange-300 via-[#d9ff3f] to-white bg-clip-text text-transparent">
              Use it when you&apos;re ready.
            </span>
          </h2>

          <p className="mt-3 max-w-2xl text-sm font-bold leading-7 text-white/55">
            Dhoom has prepared the campaign assets. Copy the caption, WhatsApp
            message, story flow, poster, or full export pack without touching a
            complex editor.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <CommandActionCard
              icon={<FileText size={18} />}
              title="Caption"
              description="Copy Instagram/Facebook caption."
              active={copied === "Caption"}
              onClick={() => onCopy("Caption", output.caption)}
            />

            <CommandActionCard
              icon={<MessageCircle size={18} />}
              title="WhatsApp copy"
              description="Copy customer-ready WhatsApp message."
              active={copied === "WhatsApp copy"}
              onClick={() => onCopy("WhatsApp copy", output.whatsappCopy)}
            />

            <CommandActionCard
              icon={<Sparkles size={18} />}
              title="Story flow"
              description="Copy story slide sequence."
              active={copied === "Story flow"}
              onClick={() => onCopy("Story flow", storyText || "No story flow.")}
            />

            <CommandActionCard
              icon={<PackageCheck size={18} />}
              title="Full pack"
              description="Copy complete campaign package."
              active={copied === "Full export pack"}
              onClick={() => onCopy("Full export pack", exportText)}
            />
          </div>

          <div className="mt-4 flex flex-col gap-2 md:flex-row">
            <button
              onClick={downloadExportPack}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.065] px-5 text-xs font-black text-white/72 transition hover:bg-white/[0.1]"
            >
              <Download size={15} />
              Download ready pack
            </button>

            <Link
              href="/dashboard/creative-lab"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-orange-400/20 bg-orange-500/10 px-5 text-xs font-black text-orange-200 transition hover:bg-orange-500/15"
            >
              <Wand2 size={15} />
              Open Creative Lab
            </Link>

            {selectedPoster?.assetUrl ? (
              <a
                href={selectedPoster.assetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#d9ff3f] px-5 text-xs font-black text-[#070816] transition hover:scale-[1.01]"
              >
                <ExternalLink size={15} />
                Open poster
              </a>
            ) : (
              <Link
                href="/dashboard/creative-lab"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#d9ff3f] px-5 text-xs font-black text-[#070816] transition hover:scale-[1.01]"
              >
                <ImageIcon size={15} />
                Generate poster
              </Link>
            )}
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-white/10 bg-[#070816]/70 p-4">
          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
            Soft usage guide
          </p>

          <div className="mt-4 grid gap-3">
            <UsageHint
              title="Poster"
              value={
                selectedPoster?.assetUrl
                  ? "Visual asset is ready."
                  : "Poster slot is ready in Creative Lab."
              }
            />

            <UsageHint
              title="Caption"
              value="Use for Instagram or Facebook product post."
            />

            <UsageHint
              title="WhatsApp"
              value="Use when replying to interested customers."
            />

            <UsageHint
              title="Story flow"
              value="Use as 3-5 story frames if you need a story version."
            />
          </div>

          <div className="mt-4 rounded-2xl border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
            <p className="text-sm font-black leading-6 text-[#d9ff3f]">
              No schedule. No pressure. Dhoom prepares everything; you choose
              what to use.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

function CommandActionCard({
  icon,
  title,
  description,
  active,
  onClick,
}: {
  icon: ReactNode
  title: string
  description: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-[1.3rem] border border-white/10 bg-white/[0.055] p-4 text-left transition hover:border-[#d9ff3f]/35 hover:bg-white/[0.085]"
    >
      <div className="relative z-10 flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
          {active ? <Check size={18} /> : icon}
        </div>

        <div>
          <h3 className="text-lg font-black tracking-[-0.05em] text-white">
            {active ? "Copied" : title}
          </h3>

          <p className="mt-1 text-xs font-bold leading-5 text-white/45">
            {description}
          </p>
        </div>
      </div>

      <div className="absolute inset-0 translate-x-[-110%] bg-white/10 blur-xl transition group-hover:translate-x-[110%]" />
    </button>
  )
}

function UsageHint({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
      <p className="text-[0.56rem] font-black uppercase tracking-[0.18em] text-white/35">
        {title}
      </p>

      <p className="mt-1 text-sm font-bold leading-6 text-white/60">{value}</p>
    </div>
  )
}
