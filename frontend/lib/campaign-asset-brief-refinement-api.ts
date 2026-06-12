export type RefinedCampaignAssetBrief = {
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
  refinementNotes: string[]
}

type RefinedCampaignAssetBriefApi = {
  id: string
  output_id: string
  draft_id: string

  creative_brief_title: string

  poster_prompt: string
  image_generation_prompt: string
  poster_layout_direction: string
  poster_text_hierarchy: string[]
  poster_design_rules: string[]

  reel_prompt: string
  video_generation_prompt: string
  reel_shot_list: string[]
  reel_sound_direction: string | null
  reel_editing_style: string | null

  designer_notes: string[]
  asset_risks: string[]

  confidence: number | null
  status: string

  refinement_count: number
  refinement_notes: string[]
}

function mapRefinedBrief(
  brief: RefinedCampaignAssetBriefApi,
): RefinedCampaignAssetBrief {
  return {
    id: brief.id,
    outputId: brief.output_id,
    draftId: brief.draft_id,

    creativeBriefTitle: brief.creative_brief_title,

    posterPrompt: brief.poster_prompt,
    imageGenerationPrompt: brief.image_generation_prompt,
    posterLayoutDirection: brief.poster_layout_direction,
    posterTextHierarchy: brief.poster_text_hierarchy || [],
    posterDesignRules: brief.poster_design_rules || [],

    reelPrompt: brief.reel_prompt,
    videoGenerationPrompt: brief.video_generation_prompt,
    reelShotList: brief.reel_shot_list || [],
    reelSoundDirection: brief.reel_sound_direction,
    reelEditingStyle: brief.reel_editing_style,

    designerNotes: brief.designer_notes || [],
    assetRisks: brief.asset_risks || [],

    confidence: brief.confidence,
    status: brief.status,

    refinementCount: brief.refinement_count || 0,
    refinementNotes: brief.refinement_notes || [],
  }
}

export async function refineCampaignAssetBrief(input: {
  assetBriefId: string
  refineInstruction: string
}) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  if (!backendUrl) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL")
  }

  const response = await fetch(
    `${backendUrl}/api/v1/campaign-asset-briefs/refine`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        asset_brief_id: input.assetBriefId,
        refine_instruction: input.refineInstruction,
      }),
    },
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || "Could not refine asset brief.")
  }

  return {
    brief: mapRefinedBrief(data.brief as RefinedCampaignAssetBriefApi),
  }
}
