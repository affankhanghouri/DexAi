import { supabase } from "@/lib/supabase"

export type CampaignLibraryItem = {
  id: string
  draftId: string | null

  campaignHeadline: string | null
  campaignAngle: string | null
  status: string | null

  campaignScore: number | null
  qualityStatus: string | null
  editCount: number

  productName: string | null
  category: string | null
  productImageUrl: string | null

  selectedAngleTitle: string | null
  selectedVariantName: string | null

  createdAt: string
}

type CampaignLibraryRow = {
  id: string
  draft_id: string | null

  campaign_headline: string | null
  campaign_angle: string | null
  status: string | null

  campaign_score: number | null
  quality_status: string | null
  edit_count: number | null

  created_at: string

  campaign_drafts:
    | {
        id: string
        product_name: string | null
        category: string | null
        product_image_url: string | null
        selected_angle_title: string | null
        selected_variant_name: string | null
        brand_profile_id: string | null
      }
    | {
        id: string
        product_name: string | null
        category: string | null
        product_image_url: string | null
        selected_angle_title: string | null
        selected_variant_name: string | null
        brand_profile_id: string | null
      }[]
    | null
}

function normalizeDraft(row: CampaignLibraryRow) {
  if (Array.isArray(row.campaign_drafts)) {
    return row.campaign_drafts[0] || null
  }

  return row.campaign_drafts
}

function mapCampaignLibraryItem(row: CampaignLibraryRow): CampaignLibraryItem {
  const draft = normalizeDraft(row)

  return {
    id: row.id,
    draftId: row.draft_id,

    campaignHeadline: row.campaign_headline,
    campaignAngle: row.campaign_angle,
    status: row.status,

    campaignScore: row.campaign_score,
    qualityStatus: row.quality_status,
    editCount: row.edit_count || 0,

    productName: draft?.product_name || null,
    category: draft?.category || null,
    productImageUrl: draft?.product_image_url || null,

    selectedAngleTitle: draft?.selected_angle_title || null,
    selectedVariantName: draft?.selected_variant_name || null,

    createdAt: row.created_at,
  }
}

export async function getCampaignLibraryItems(brandProfileId: string) {
  const { data, error } = await supabase
    .from("campaign_outputs")
    .select(
      `
      id,
      draft_id,
      campaign_headline,
      campaign_angle,
      status,
      campaign_score,
      quality_status,
      edit_count,
      created_at,
      campaign_drafts!inner (
        id,
        brand_profile_id,
        product_name,
        category,
        product_image_url,
        selected_angle_title,
        selected_variant_name
      )
      `,
    )
    .eq("campaign_drafts.brand_profile_id", brandProfileId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return ((data || []) as CampaignLibraryRow[]).map(mapCampaignLibraryItem)
}