import { supabase } from "@/lib/supabase"

export type CampaignAssetBrief = {
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
}

type CampaignAssetBriefRow = {
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
}

function mapCampaignAssetBrief(
  row: CampaignAssetBriefRow,
): CampaignAssetBrief {
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
  }
}

export async function getCampaignAssetBrief(outputId: string) {
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
      status
      `,
    )
    .eq("output_id", outputId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) return null

  return mapCampaignAssetBrief(data as CampaignAssetBriefRow)
}