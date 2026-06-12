import { supabase } from "@/lib/supabase"

export type CampaignOutput = {
  id: string
  draftId: string

  campaignHeadline: string | null
  campaignAngle: string
  buyerInsight: string | null

  caption: string
  whatsappCopy: string
  offerIdea: string
  storyFlow: string[]

  posterDirection: string
  reelDirection: string | null
  primaryCta: string | null

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
  status: string
}

type CampaignOutputRow = {
  id: string
  draft_id: string

  campaign_headline: string | null
  campaign_angle: string
  buyer_insight: string | null

  caption: string
  whatsapp_copy: string
  offer_idea: string
  story_flow: string[] | null

  poster_direction: string
  reel_direction: string | null
  primary_cta: string | null

  do_rules: string[] | null
  avoid_rules: string[] | null

  confidence: number | null
  campaign_score: number | null
  quality_status: string | null
  quality_notes: string[] | null
  improvements_applied: string[] | null
  risk_flags: string[] | null
  edit_count: number | null
  edit_notes: string[] | null
  status: string
}

function mapCampaignOutput(row: CampaignOutputRow): CampaignOutput {
  return {
    id: row.id,
    draftId: row.draft_id,

    campaignHeadline: row.campaign_headline,
    campaignAngle: row.campaign_angle,
    buyerInsight: row.buyer_insight,

    caption: row.caption,
    whatsappCopy: row.whatsapp_copy,
    offerIdea: row.offer_idea,
    storyFlow: row.story_flow || [],

    posterDirection: row.poster_direction,
    reelDirection: row.reel_direction,
    primaryCta: row.primary_cta,

    doRules: row.do_rules || [],
    avoidRules: row.avoid_rules || [],

    confidence: row.confidence,
    campaignScore: row.campaign_score,
    qualityStatus: row.quality_status,
    qualityNotes: row.quality_notes || [],
    improvementsApplied: row.improvements_applied || [],
    riskFlags: row.risk_flags || [],
    editCount: row.edit_count || 0,
    editNotes: row.edit_notes || [],
    status: row.status,
  }
}

export async function getCampaignOutput(id: string) {
  const { data, error } = await supabase
    .from("campaign_outputs")
    .select(
      `
      id,
      draft_id,
      campaign_headline,
      campaign_angle,
      buyer_insight,
      caption,
      whatsapp_copy,
      offer_idea,
      story_flow,
      poster_direction,
      reel_direction,
      primary_cta,
      do_rules,
      avoid_rules,
      confidence,
      campaign_score,
      quality_status,
      quality_notes,
      improvements_applied,
      risk_flags,
      edit_count,
      edit_notes,
      status
      `,
    )
    .eq("id", id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapCampaignOutput(data as CampaignOutputRow)
}

export type RecentCampaign = {
  id: string
  draftId: string
  brandProfileId: string | null
  productName: string | null
  category: string | null
  selectedAngleTitle: string | null
  selectedVariantName: string | null
  status: string
  createdAt: string
}

type RecentCampaignRow = {
  id: string
  draft_id: string
  status: string
  created_at: string
  campaign_drafts:
    | {
        brand_profile_id: string | null
        product_name: string | null
        category: string | null
        selected_angle_title: string | null
        selected_variant_name: string | null
      }
    | {
        brand_profile_id: string | null
        product_name: string | null
        category: string | null
        selected_angle_title: string | null
        selected_variant_name: string | null
      }[]
    | null
}

function mapRecentCampaign(row: RecentCampaignRow): RecentCampaign {
  const draft = Array.isArray(row.campaign_drafts)
    ? row.campaign_drafts[0] || null
    : row.campaign_drafts

  return {
    id: row.id,
    draftId: row.draft_id,
    brandProfileId: draft?.brand_profile_id || null,
    productName: draft?.product_name || null,
    category: draft?.category || null,
    selectedAngleTitle: draft?.selected_angle_title || null,
    selectedVariantName: draft?.selected_variant_name || null,
    status: row.status,
    createdAt: row.created_at,
  }
}

function buildCampaignListQuery() {
  return supabase.from("campaign_outputs").select(
    `
    id,
    draft_id,
    status,
    created_at,
    campaign_drafts!inner (
      brand_profile_id,
      product_name,
      category,
      selected_angle_title,
      selected_variant_name
    )
    `,
  )
}

export async function getRecentCampaigns(brandProfileId?: string | null) {
  let query = buildCampaignListQuery()
    .order("created_at", { ascending: false })
    .limit(6)

  if (brandProfileId) {
    query = query.eq("campaign_drafts.brand_profile_id", brandProfileId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return (data as RecentCampaignRow[]).map(mapRecentCampaign)
}

export async function getAllCampaigns(brandProfileId?: string | null) {
  let query = buildCampaignListQuery().order("created_at", { ascending: false })

  if (brandProfileId) {
    query = query.eq("campaign_drafts.brand_profile_id", brandProfileId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return (data as RecentCampaignRow[]).map(mapRecentCampaign)
}
