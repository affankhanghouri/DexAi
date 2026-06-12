import {
  getAllCampaigns,
  type RecentCampaign,
} from "@/lib/campaign-output"
import { supabase } from "@/lib/supabase"

export type CreativeLabAsset = {
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
  status: string
  refinementCount: number
  lastRefinedAt: string | null
  refinementNotes: string[]

  campaign: RecentCampaign
}

type CreativeLabAssetRow = {
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
  status: string
  refinement_count: number | null
  last_refined_at: string | null
  refinement_notes: string[] | null
}

function mapAssetBrief(
  row: CreativeLabAssetRow,
  campaign: RecentCampaign,
): CreativeLabAsset {
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
    lastRefinedAt: row.last_refined_at,
    refinementNotes: row.refinement_notes || [],

    campaign,
  }
}

export async function getCreativeLabAssets(brandProfileId: string) {
  const campaigns = await getAllCampaigns(brandProfileId)

  if (campaigns.length === 0) {
    return []
  }

  const outputIds = campaigns.map((campaign) => campaign.id)

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
      last_refined_at,
      refinement_notes
      `,
    )
    .in("output_id", outputIds)

  if (error) {
    throw new Error(error.message)
  }

  const campaignsByOutputId = new Map(
    campaigns.map((campaign) => [campaign.id, campaign]),
  )

  const assets = (data as CreativeLabAssetRow[])
    .map((row) => {
      const campaign = campaignsByOutputId.get(row.output_id)

      if (!campaign) return null

      return mapAssetBrief(row, campaign)
    })
    .filter(Boolean) as CreativeLabAsset[]

  return assets.sort((a, b) => {
    return (
      new Date(b.campaign.createdAt).getTime() -
      new Date(a.campaign.createdAt).getTime()
    )
  })
}
