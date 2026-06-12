export type GhostEditedCampaignOutput = {
  id: string

  campaignHeadline: string
  campaignAngle: string
  buyerInsight: string

  caption: string
  whatsappCopy: string
  offerIdea: string
  storyFlow: string[]

  posterDirection: string
  reelDirection: string
  primaryCta: string

  doRules: string[]
  avoidRules: string[]

  confidence: number | null

  campaignScore: number | null
  qualityStatus: string | null
  qualityNotes: string[]
  improvementsApplied: string[]
  riskFlags: string[]

  editCount: number
  editNotes: string[]
}

type GhostEditedCampaignOutputApi = {
  id: string

  campaign_headline: string
  campaign_angle: string
  buyer_insight: string

  caption: string
  whatsapp_copy: string
  offer_idea: string
  story_flow: string[]

  poster_direction: string
  reel_direction: string
  primary_cta: string

  do_rules: string[]
  avoid_rules: string[]

  confidence: number | null

  campaign_score: number | null
  quality_status: string | null
  quality_notes: string[]
  improvements_applied: string[]
  risk_flags: string[]

  edit_count: number
  edit_notes: string[]
}

function mapOutput(output: GhostEditedCampaignOutputApi): GhostEditedCampaignOutput {
  return {
    id: output.id,

    campaignHeadline: output.campaign_headline,
    campaignAngle: output.campaign_angle,
    buyerInsight: output.buyer_insight,

    caption: output.caption,
    whatsappCopy: output.whatsapp_copy,
    offerIdea: output.offer_idea,
    storyFlow: output.story_flow || [],

    posterDirection: output.poster_direction,
    reelDirection: output.reel_direction,
    primaryCta: output.primary_cta,

    doRules: output.do_rules || [],
    avoidRules: output.avoid_rules || [],

    confidence: output.confidence,

    campaignScore: output.campaign_score,
    qualityStatus: output.quality_status,
    qualityNotes: output.quality_notes || [],
    improvementsApplied: output.improvements_applied || [],
    riskFlags: output.risk_flags || [],

    editCount: output.edit_count || 0,
    editNotes: output.edit_notes || [],
  }
}

export async function refineCampaignWithGhostEditor(input: {
  campaignOutputId: string
  instruction: string
}) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  if (!backendUrl) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL")
  }

  const response = await fetch(`${backendUrl}/api/v1/ghost-editor/campaign/refine`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      campaign_output_id: input.campaignOutputId,
      instruction: input.instruction,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || "Could not refine campaign.")
  }

  return {
    output: mapOutput(data.output as GhostEditedCampaignOutputApi),
    actionSummary: data.action_summary as string,
    changedFields: data.changed_fields as string[],
  }
}
