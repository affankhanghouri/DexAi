import { supabase } from "@/lib/supabase"

export type CampaignGeneratedAsset = {
  id: string
  assetBriefId: string
  outputId: string
  draftId: string

  assetType: string
  assetSlot: string

  title: string
  description: string | null
  sourcePrompt: string
  generationPrompt: string

  assetUrl: string | null
  assetPath: string | null
  thumbnailUrl: string | null

  status: string
  provider: string | null
  generationMetadata: Record<string, unknown>

  createdAt: string
  updatedAt: string
}

type CampaignGeneratedAssetRow = {
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
  generation_metadata: Record<string, unknown> | null

  created_at: string
  updated_at: string
}

function mapGeneratedAsset(
  row: CampaignGeneratedAssetRow,
): CampaignGeneratedAsset {
  return {
    id: row.id,
    assetBriefId: row.asset_brief_id,
    outputId: row.output_id,
    draftId: row.draft_id,

    assetType: row.asset_type,
    assetSlot: row.asset_slot,

    title: row.title,
    description: row.description,
    sourcePrompt: row.source_prompt,
    generationPrompt: row.generation_prompt,

    assetUrl: row.asset_url,
    assetPath: row.asset_path,
    thumbnailUrl: row.thumbnail_url,

    status: row.status,
    provider: row.provider,
    generationMetadata: row.generation_metadata || {},

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

const generatedAssetSelect = `
  id,
  asset_brief_id,
  output_id,
  draft_id,
  asset_type,
  asset_slot,
  title,
  description,
  source_prompt,
  generation_prompt,
  asset_url,
  asset_path,
  thumbnail_url,
  status,
  provider,
  generation_metadata,
  created_at,
  updated_at
`

export async function getGeneratedAssetsForBrief(assetBriefId: string) {
  const { data, error } = await supabase
    .from("campaign_generated_assets")
    .select(generatedAssetSelect)
    .eq("asset_brief_id", assetBriefId)
    .order("created_at", { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return (data as CampaignGeneratedAssetRow[]).map(mapGeneratedAsset)
}

export async function ensureGeneratedAssetSlots(assetBriefId: string) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  if (!backendUrl) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL")
  }

  const response = await fetch(
    `${backendUrl}/api/v1/campaign-generated-assets/create-slots`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        asset_brief_id: assetBriefId,
      }),
    },
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || "Could not create asset slots.")
  }

  return (data.assets as CampaignGeneratedAssetRow[]).map(mapGeneratedAsset)
}
