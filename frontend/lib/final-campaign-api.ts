export type FinalCampaignApiOutput = {
  id: string
  draft_id: string

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

  confidence: number
  campaign_score: number | null
  quality_status: string | null
  quality_notes: string[]
  improvements_applied: string[]
  risk_flags: string[]
  status: string
}

export async function generateFinalCampaign(draftId: string) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  if (!backendUrl) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL")
  }

  const response = await fetch(`${backendUrl}/api/v1/campaigns/generate-final`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      draft_id: draftId,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || "Could not generate final campaign.")
  }

  return data as {
    output: FinalCampaignApiOutput
  }
}
