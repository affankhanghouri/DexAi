import { supabase } from "@/lib/supabase"

export type CampaignReviewView = {
  id: string
  brandProfileId: string | null

  productName: string | null
  category: string | null
  priceOffer: string | null
  buyerAction: string | null
  notes: string | null
  moment: string | null
  productImageUrl: string | null

  productDnaSummary: string | null
  productPositioning: string | null
  productConfidence: number | null

  selectedAngleId: string | null
  selectedAngleTitle: string | null
  selectedAngleDescription: string | null
  selectedAngleReason: string | null

  selectedVariantId: string | null
  selectedVariantName: string | null
  selectedVariantDescription: string | null
  selectedVariantVisual: string | null
  selectedVariantCaptionStyle: string | null

  status: string | null
}

type CampaignReviewRow = {
  id: string
  brand_profile_id: string | null

  product_name: string | null
  category: string | null
  price_offer: string | null
  buyer_action: string | null
  notes: string | null
  moment: string | null
  product_image_url: string | null

  product_dna_summary: string | null
  product_positioning: string | null
  product_confidence: number | null

  selected_angle_id: string | null
  selected_angle_title: string | null
  selected_angle_description: string | null
  selected_angle_reason: string | null

  selected_variant_id: string | null
  selected_variant_name: string | null
  selected_variant_description: string | null
  selected_variant_visual: string | null
  selected_variant_caption_style: string | null

  status: string | null
}

function mapCampaignReview(row: CampaignReviewRow): CampaignReviewView {
  return {
    id: row.id,
    brandProfileId: row.brand_profile_id,

    productName: row.product_name,
    category: row.category,
    priceOffer: row.price_offer,
    buyerAction: row.buyer_action,
    notes: row.notes,
    moment: row.moment,
    productImageUrl: row.product_image_url,

    productDnaSummary: row.product_dna_summary,
    productPositioning: row.product_positioning,
    productConfidence: row.product_confidence,

    selectedAngleId: row.selected_angle_id,
    selectedAngleTitle: row.selected_angle_title,
    selectedAngleDescription: row.selected_angle_description,
    selectedAngleReason: row.selected_angle_reason,

    selectedVariantId: row.selected_variant_id,
    selectedVariantName: row.selected_variant_name,
    selectedVariantDescription: row.selected_variant_description,
    selectedVariantVisual: row.selected_variant_visual,
    selectedVariantCaptionStyle: row.selected_variant_caption_style,

    status: row.status,
  }
}

export async function getCampaignReviewView(draftId: string) {
  const { data, error } = await supabase
    .from("campaign_drafts")
    .select(
      `
      id,
      brand_profile_id,

      product_name,
      category,
      price_offer,
      buyer_action,
      notes,
      moment,
      product_image_url,

      product_dna_summary,
      product_positioning,
      product_confidence,

      selected_angle_id,
      selected_angle_title,
      selected_angle_description,
      selected_angle_reason,

      selected_variant_id,
      selected_variant_name,
      selected_variant_description,
      selected_variant_visual,
      selected_variant_caption_style,

      status
      `,
    )
    .eq("id", draftId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapCampaignReview(data as CampaignReviewRow)
}