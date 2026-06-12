import type { CampaignAssetBrief } from "@/lib/campaign-asset-brief"
import type { CampaignGeneratedAsset } from "@/lib/campaign-generated-assets"
import type { CampaignOutput } from "@/lib/campaign-output"

export function buildCampaignExportText(input: {
  output: CampaignOutput
  assetBrief: CampaignAssetBrief | null
  generatedAssets: CampaignGeneratedAsset[]
}) {
  const { output, assetBrief, generatedAssets } = input

  const selectedPoster = generatedAssets.find(
    (asset) => asset.assetType === "poster" && asset.assetUrl,
  )

  const selectedReel = generatedAssets.find(
    (asset) => asset.assetType === "reel" && asset.assetUrl,
  )

  const storyFlow = output.storyFlow
    .map((item, index) => `${index + 1}. ${item}`)
    .join("\n")

  const doRules = output.doRules.map((item) => `- ${item}`).join("\n")
  const avoidRules = output.avoidRules.map((item) => `- ${item}`).join("\n")

  const posterDesignRules =
    assetBrief?.posterDesignRules.map((item) => `- ${item}`).join("\n") || ""

  const reelShotList =
    assetBrief?.reelShotList
      .map((item, index) => `${index + 1}. ${item}`)
      .join("\n") || ""

  return `
DHOOM AI CAMPAIGN EXPORT PACK
==============================

CAMPAIGN HEADLINE
${output.campaignHeadline || "Untitled campaign"}

QUALITY SCORE
${output.campaignScore ?? "N/A"}/100
Status: ${output.qualityStatus || "checked"}

CAMPAIGN ANGLE
${output.campaignAngle}

BUYER INSIGHT
${output.buyerInsight || "N/A"}

PRIMARY CTA
${output.primaryCta || "Message to order"}

OFFER IDEA
${output.offerIdea}

INSTAGRAM / FACEBOOK CAPTION
${output.caption}

WHATSAPP COPY
${output.whatsappCopy}

STORY FLOW
${storyFlow || "N/A"}

POSTER LINK
${selectedPoster?.assetUrl || "No poster generated yet"}

REEL LINK
${selectedReel?.assetUrl || "No reel generated yet"}

POSTER DIRECTION
${output.posterDirection}

REEL DIRECTION
${output.reelDirection || "N/A"}

POSTER PROMPT
${assetBrief?.posterPrompt || "No poster prompt available."}

IMAGE GENERATION PROMPT
${assetBrief?.imageGenerationPrompt || "No image generation prompt available."}

POSTER DESIGN RULES
${posterDesignRules || "N/A"}

REEL PROMPT
${assetBrief?.reelPrompt || "No reel prompt available."}

VIDEO GENERATION PROMPT
${assetBrief?.videoGenerationPrompt || "No video generation prompt available."}

REEL SHOT LIST
${reelShotList || "N/A"}

DO RULES
${doRules || "N/A"}

AVOID RULES
${avoidRules || "N/A"}

Dhoom AI Export Pack
`.trim()
}

export function downloadTextFile(fileName: string, text: string) {
  const blob = new Blob([text], {
    type: "text/plain;charset=utf-8",
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
