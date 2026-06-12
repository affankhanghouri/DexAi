import type { CampaignGeneratedAsset } from "@/lib/campaign-generated-assets"

type GeneratedPosterAssetApi = {
  id: string
  asset_brief_id: string
  output_id: string
  draft_id: string

  asset_type: string
  asset_slot: string

  title: string
  description: string | null

  source_prompt: string
  generation_prompt: string

  asset_url: string | null
  asset_path: string | null
  thumbnail_url: string | null

  status: string
  provider: string | null
  generation_metadata: Record<string, unknown>
}

function mapGeneratedPosterAsset(
  asset: GeneratedPosterAssetApi,
): CampaignGeneratedAsset {
  const now = new Date().toISOString()

  return {
    id: asset.id,
    assetBriefId: asset.asset_brief_id,
    outputId: asset.output_id,
    draftId: asset.draft_id,

    assetType: asset.asset_type,
    assetSlot: asset.asset_slot,

    title: asset.title,
    description: asset.description,

    sourcePrompt: asset.source_prompt,
    generationPrompt: asset.generation_prompt,

    assetUrl: asset.asset_url,
    assetPath: asset.asset_path,
    thumbnailUrl: asset.thumbnail_url,

    status: asset.status,
    provider: asset.provider,
    generationMetadata: asset.generation_metadata || {},

    createdAt: now,
    updatedAt: now,
  }
}

export async function generatePosterAsset(generatedAssetId: string) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  if (!backendUrl) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL")
  }

  const response = await fetch(`${backendUrl}/api/v1/poster-generation/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      generated_asset_id: generatedAssetId,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || "Could not generate poster.")
  }

  return {
    asset: mapGeneratedPosterAsset(data.asset as GeneratedPosterAssetApi),
  }
}
