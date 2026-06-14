import { supabase } from "@/lib/supabase"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

export type CreativeLabBrief = {
  id: string
  outputId: string
  draftId: string

  creativeBriefTitle: string

  posterPrompt: string
  imageGenerationPrompt: string
  posterLayoutDirection: string
  posterTextHierarchy: string[]
  posterDesignRules: string[]

  reelPrompt: string
  videoGenerationPrompt: string
  reelShotList: string[]
  reelSoundDirection: string | null
  reelEditingStyle: string | null

  designerNotes: string[]
  assetRisks: string[]

  confidence: number | null
  status: string | null
  refinementCount: number
  createdAt: string

  productName: string | null
  category: string | null
  productImageUrl: string | null
  selectedAngleTitle: string | null
  selectedVariantName: string | null

  campaignHeadline: string | null
  campaignScore: number | null
}

export type CreativeLabAsset = {
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
  createdAt: string
  updatedAt: string
}

type CreativeLabBriefRow = {
  id: string
  output_id: string
  draft_id: string

  creative_brief_title: string

  poster_prompt: string
  image_generation_prompt: string
  poster_layout_direction: string
  poster_text_hierarchy: string[] | null
  poster_design_rules: string[] | null

  reel_prompt: string
  video_generation_prompt: string
  reel_shot_list: string[] | null
  reel_sound_direction: string | null
  reel_editing_style: string | null

  designer_notes: string[] | null
  asset_risks: string[] | null

  confidence: number | null
  status: string | null
  refinement_count: number | null
  created_at: string

  campaign_drafts:
    | {
        id: string
        brand_profile_id: string | null
        product_name: string | null
        category: string | null
        product_image_url: string | null
        selected_angle_title: string | null
        selected_variant_name: string | null
      }
    | {
        id: string
        brand_profile_id: string | null
        product_name: string | null
        category: string | null
        product_image_url: string | null
        selected_angle_title: string | null
        selected_variant_name: string | null
      }[]
    | null

  campaign_outputs:
    | {
        id: string
        campaign_headline: string | null
        campaign_score: number | null
      }
    | {
        id: string
        campaign_headline: string | null
        campaign_score: number | null
      }[]
    | null
}

type CreativeLabAssetRow = {
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
  created_at: string
  updated_at: string
}

function first<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) return value[0] || null
  return value
}

function mapBrief(row: CreativeLabBriefRow): CreativeLabBrief {
  const draft = first(row.campaign_drafts)
  const output = first(row.campaign_outputs)

  return {
    id: row.id,
    outputId: row.output_id,
    draftId: row.draft_id,

    creativeBriefTitle: row.creative_brief_title,

    posterPrompt: row.poster_prompt,
    imageGenerationPrompt: row.image_generation_prompt,
    posterLayoutDirection: row.poster_layout_direction,
    posterTextHierarchy: row.poster_text_hierarchy || [],
    posterDesignRules: row.poster_design_rules || [],

    reelPrompt: row.reel_prompt,
    videoGenerationPrompt: row.video_generation_prompt,
    reelShotList: row.reel_shot_list || [],
    reelSoundDirection: row.reel_sound_direction,
    reelEditingStyle: row.reel_editing_style,

    designerNotes: row.designer_notes || [],
    assetRisks: row.asset_risks || [],

    confidence: row.confidence,
    status: row.status,
    refinementCount: row.refinement_count || 0,
    createdAt: row.created_at,

    productName: draft?.product_name || null,
    category: draft?.category || null,
    productImageUrl: draft?.product_image_url || null,
    selectedAngleTitle: draft?.selected_angle_title || null,
    selectedVariantName: draft?.selected_variant_name || null,

    campaignHeadline: output?.campaign_headline || null,
    campaignScore: output?.campaign_score || null,
  }
}

function mapAsset(row: CreativeLabAssetRow): CreativeLabAsset {
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
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getCreativeLabBriefs(brandProfileId: string) {
  const { data, error } = await supabase
    .from("campaign_asset_briefs")
    .select(
      `
      id,
      output_id,
      draft_id,

      creative_brief_title,

      poster_prompt,
      image_generation_prompt,
      poster_layout_direction,
      poster_text_hierarchy,
      poster_design_rules,

      reel_prompt,
      video_generation_prompt,
      reel_shot_list,
      reel_sound_direction,
      reel_editing_style,

      designer_notes,
      asset_risks,

      confidence,
      status,
      refinement_count,
      created_at,

      campaign_drafts!inner (
        id,
        brand_profile_id,
        product_name,
        category,
        product_image_url,
        selected_angle_title,
        selected_variant_name
      ),

      campaign_outputs (
        id,
        campaign_headline,
        campaign_score
      )
      `,
    )
    .eq("campaign_drafts.brand_profile_id", brandProfileId)
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)

  return ((data || []) as CreativeLabBriefRow[]).map(mapBrief)
}

export async function getCreativeLabAssets(assetBriefId: string) {
  const { data, error } = await supabase
    .from("campaign_generated_assets")
    .select(
      `
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
      created_at,
      updated_at
      `,
    )
    .eq("asset_brief_id", assetBriefId)
    .order("created_at", { ascending: true })

  if (error) throw new Error(error.message)

  return ((data || []) as CreativeLabAssetRow[]).map(mapAsset)
}

export async function refineCreativeBrief(input: {
  assetBriefId: string
  instruction: string
}) {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/campaign-asset-briefs/refine`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        asset_brief_id: input.assetBriefId,
        refine_instruction: input.instruction,
      }),
    },
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || "Failed to refine creative brief.")
  }

  return response.json()
}

export async function generatePosterAsset(generatedAssetId: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/poster-generation/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      generated_asset_id: generatedAssetId,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || "Failed to generate poster.")
  }

  return response.json()
}