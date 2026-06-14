"use client"

import { GhostCommandPanel } from "@/components/shared/ghost-command-panel"
import { ReadyToPostCommandCenter } from "@/components/campaign/ready-to-post-command-center"
import type { CampaignAssetBrief } from "@/lib/campaign-asset-brief"
import type { CampaignGeneratedAsset } from "@/lib/campaign-generated-assets"
import type { CampaignOutput } from "@/lib/campaign-output"
import { motion } from "framer-motion"
import {
  BadgeCheck,
  Brain,
  Check,
  Clipboard,
  FileText,
  ImageIcon,
  MessageCircle,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Wand2,
  Zap,
} from "lucide-react"

export function PremiumCampaignResultView({
  output,
  assetBrief,
  generatedAssets,
  copied,
  isRefining,
  onCopy,
  onGhostRefine,
}: {
  output: CampaignOutput
  assetBrief: CampaignAssetBrief | null
  generatedAssets: CampaignGeneratedAsset[]
  copied: string
  isRefining: boolean
  onCopy: (label: string, text: string) => void
  onGhostRefine: (instruction: string) => Promise<void>
}) {
  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <CampaignResultHero output={output} />

      <ReadyToPostCommandCenter
        output={output}
        assetBrief={assetBrief}
        generatedAssets={generatedAssets}
        copied={copied}
        onCopy={onCopy}
      />

      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <main className="space-y-5">
          <GhostCommandPanel
            title="Ghost Editor"
            subtitle="Tell Dhoom what to change. It will refine the campaign without making you edit everything manually."
            isRunning={isRefining}
            onSubmit={onGhostRefine}
          />

          <CampaignCopySection
            output={output}
            copied={copied}
            onCopy={onCopy}
          />

          <CreativeDirectionSection
            output={output}
            assetBrief={assetBrief}
          />
        </main>

        <aside className="space-y-5">
          <QualityScorePanel output={output} />

          <CampaignRulesPanel output={output} />

          <GeneratedAssetsPanel
            assetBrief={assetBrief}
            generatedAssets={generatedAssets}
          />
        </aside>
      </section>
    </div>
  )
}

function CampaignResultHero({ output }: { output: CampaignOutput }) {
  const score = output.campaignScore || 0
  const qualityStatus = output.qualityStatus || "ready"

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
            <PackageCheck size={14} />
            Campaign pack generated
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-[-0.08em] text-white md:text-6xl">
            {output.campaignHeadline || "Your campaign is ready."}
          </h1>

          <p className="mt-4 max-w-2xl text-sm font-bold leading-7 text-white/55 md:text-base">
            {output.buyerInsight ||
              "Dhoom has prepared the campaign copy, WhatsApp message, creative direction, quality check, and ready-to-use pack."}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <HeroPill tone="lime">Ready to use</HeroPill>
            <HeroPill tone="orange">{qualityStatus}</HeroPill>
            {output.editCount ? (
              <HeroPill tone="white">Edited {output.editCount}x</HeroPill>
            ) : null}
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
          <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-[#d9ff3f]">
            Campaign score
          </p>

          <div className="mt-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-5xl font-black tracking-[-0.08em] text-white">
                {score || "--"}
              </p>

              <p className="mt-1 text-xs font-bold text-white/45">
                Quality gate result
              </p>
            </div>

            <ScoreOrb score={score} />
          </div>
        </div>
      </div>
    </motion.header>
  )
}

function CampaignCopySection({
  output,
  copied,
  onCopy,
}: {
  output: CampaignOutput
  copied: string
  onCopy: (label: string, text: string) => void
}) {
  const storyText = output.storyFlow
    .map((item, index) => `Story ${index + 1}: ${item}`)
    .join("\n")

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <OutputCard
        icon={<FileText size={20} />}
        title="Caption"
        label="Post copy"
        text={output.caption}
        copied={copied === "Caption"}
        onCopy={() => onCopy("Caption", output.caption)}
      />

      <OutputCard
        icon={<MessageCircle size={20} />}
        title="WhatsApp Copy"
        label="Customer message"
        text={output.whatsappCopy}
        copied={copied === "WhatsApp copy"}
        onCopy={() => onCopy("WhatsApp copy", output.whatsappCopy)}
      />

      <OutputCard
        icon={<Target size={20} />}
        title="Offer Idea"
        label="Sales hook"
        text={output.offerIdea || "No offer idea generated."}
        copied={copied === "Offer idea"}
        onCopy={() =>
          onCopy("Offer idea", output.offerIdea || "No offer idea generated.")
        }
      />

      <OutputCard
        icon={<Sparkles size={20} />}
        title="Story Flow"
        label="Story sequence"
        text={storyText || "No story flow generated."}
        copied={copied === "Story flow"}
        onCopy={() => onCopy("Story flow", storyText || "No story flow.")}
      />
    </section>
  )
}

function OutputCard({
  icon,
  title,
  label,
  text,
  copied,
  onCopy,
}: {
  icon: React.ReactNode
  title: string
  label: string
  text: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0d0d13]/90 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.32)]"
    >
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
            {copied ? <Check size={15} /> : <Clipboard size={15} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-orange-300">
          {label}
        </p>

        <h2 className="mt-1 text-2xl font-black tracking-[-0.06em] text-white">
          {title}
        </h2>

        <p className="mt-3 whitespace-pre-line text-sm font-bold leading-7 text-white/58">
          {text}
        </p>
      </div>
    </motion.section>
  )
}

function CreativeDirectionSection({
  output,
  assetBrief,
}: {
  output: CampaignOutput
  assetBrief: CampaignAssetBrief | null
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <DirectionCard
        icon={<ImageIcon size={20} />}
        title="Poster Direction"
        text={output.posterDirection || "No poster direction generated."}
      />

      <DirectionCard
        icon={<Zap size={20} />}
        title="Reel Direction"
        text={output.reelDirection || "No reel direction generated."}
      />

      <DirectionCard
        icon={<Wand2 size={20} />}
        title="Creative Brief"
        text={
          assetBrief?.creativeBriefTitle ||
          "Creative brief will appear after generation."
        }
      />

      <DirectionCard
        icon={<BadgeCheck size={20} />}
        title="Primary CTA"
        text={output.primaryCta || "No CTA generated."}
      />
    </section>
  )
}

function DirectionCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <section className="rounded-[1.45rem] border border-white/10 bg-white/[0.045] p-4">
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-[#d9ff3f] text-[#070816]">
        {icon}
      </div>

      <h3 className="text-2xl font-black tracking-[-0.06em] text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm font-bold leading-7 text-white/52">{text}</p>
    </section>
  )
}

function QualityScorePanel({ output }: { output: CampaignOutput }) {
  const notes = output.qualityNotes || []
  const improvements = output.improvementsApplied || []
  const risks = output.riskFlags || []

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
        <ShieldCheck size={22} />
      </div>

      <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
        Quality gate
      </p>

      <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-white">
        Campaign checked
      </h3>

      <p className="mt-2 text-sm font-bold leading-6 text-white/48">
        Dhoom reviews the campaign for brand fit, product fit, clarity, CTA
        strength, and generic AI smell.
      </p>

      <div className="mt-4 grid gap-3">
        <QualityMiniBlock title="Notes" items={notes} />
        <QualityMiniBlock title="Improvements" items={improvements} />
        <QualityMiniBlock title="Risk flags" items={risks} empty="No major risks found." />
      </div>
    </section>
  )
}

function QualityMiniBlock({
  title,
  items,
  empty = "No items found.",
}: {
  title: string
  items: string[]
  empty?: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
      <p className="text-[0.56rem] font-black uppercase tracking-[0.18em] text-white/35">
        {title}
      </p>

      <div className="mt-2 grid gap-2">
        {items.length === 0 ? (
          <p className="text-xs font-bold leading-5 text-white/38">{empty}</p>
        ) : (
          items.slice(0, 4).map((item) => (
            <div key={item} className="flex gap-2">
              <Check size={14} className="mt-0.5 shrink-0 text-[#d9ff3f]" />
              <p className="text-xs font-bold leading-5 text-white/52">
                {item}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function CampaignRulesPanel({ output }: { output: CampaignOutput }) {
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-orange-400 text-[#070816]">
        <Brain size={22} />
      </div>

      <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
        Campaign rules
      </p>

      <div className="mt-4 grid gap-3">
        <RuleBlock title="Do" items={output.doRules || []} />
        <RuleBlock title="Avoid" items={output.avoidRules || []} />
      </div>
    </section>
  )
}

function RuleBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
      <p className="text-sm font-black text-white">{title}</p>

      <div className="mt-2 grid gap-2">
        {items.length === 0 ? (
          <p className="text-xs font-bold text-white/35">No rules added.</p>
        ) : (
          items.slice(0, 5).map((item) => (
            <div key={item} className="flex gap-2">
              <Check size={14} className="mt-0.5 shrink-0 text-[#d9ff3f]" />
              <p className="text-xs font-bold leading-5 text-white/52">
                {item}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function GeneratedAssetsPanel({
  assetBrief,
  generatedAssets,
}: {
  assetBrief: CampaignAssetBrief | null
  generatedAssets: CampaignGeneratedAsset[]
}) {
  const poster = generatedAssets.find(
    (asset) => asset.assetType === "poster" && asset.assetUrl,
  )

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
        <ImageIcon size={22} />
      </div>

      <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
        Creative assets
      </p>

      <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-white">
        {poster ? "Poster ready" : "Creative Lab ready"}
      </h3>

      <p className="mt-2 text-sm font-bold leading-6 text-white/48">
        {assetBrief
          ? "Poster and reel prompts are prepared in Creative Lab."
          : "Creative brief not found yet."}
      </p>

      {poster?.assetUrl ? (
        <a
          href={poster.assetUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-[#d9ff3f] px-4 text-xs font-black text-[#070816]"
        >
          Open selected poster
        </a>
      ) : (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
          <p className="text-xs font-bold leading-5 text-white/42">
            Generate poster from Creative Lab when ready.
          </p>
        </div>
      )}
    </section>
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

function ScoreOrb({ score }: { score: number }) {
  const normalized = Math.min(Math.max(score || 0, 0), 100)
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
        /100
      </div>
    </div>
  )
}
