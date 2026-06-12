import { supabase } from "@/lib/supabase"

const CAMPAIGN_DRAFT_ID_KEY = "dhoom_campaign_draft_id"

export type CampaignDraft = {
  id: string

  productImageUrl: string | null
  productImagePath: string | null
  imageName: string | null
  brandProfileId: string | null

  productName: string | null
  category: string | null
  priceOffer: string | null
  buyerAction: string | null
  notes: string | null

  selectedAngleId: string | null
  selectedAngleTitle: string | null
  selectedAngleDescription: string | null
  selectedAngleReason: string | null

  selectedVariantId: string | null
  selectedVariantName: string | null
  selectedVariantDescription: string | null
  selectedVariantVisual: string | null
  selectedVariantCaptionStyle: string | null

  productDnaSummary: string | null
  productVisualNotes: string | null
  productType: string | null
  productFeatures: string[]
  buyerReasons: string[]
  buyerObjections: string[]
  suggestedUseCases: string[]
  productPositioning: string | null
  productConfidence: number | null

  status: string
}

type CampaignDraftRow = {
  id: string

  product_image_url: string | null
  product_image_path: string | null
  image_name: string | null
  brand_profile_id: string | null

  product_name: string | null
  category: string | null
  price_offer: string | null
  buyer_action: string | null
  notes: string | null

  selected_angle_id: string | null
  selected_angle_title: string | null
  selected_angle_description: string | null
  selected_angle_reason: string | null

  selected_variant_id: string | null
  selected_variant_name: string | null
  selected_variant_description: string | null
  selected_variant_visual: string | null
  selected_variant_caption_style: string | null

  product_dna_summary: string | null
  product_visual_notes: string | null
  product_type: string | null
  product_features: string[] | null
  buyer_reasons: string[] | null
  buyer_objections: string[] | null
  suggested_use_cases: string[] | null
  product_positioning: string | null
  product_confidence: number | null

  status: string
}

const selectCampaignDraftFields = `
  id,
  product_image_url,
  product_image_path,
  image_name,
  brand_profile_id,
  product_name,
  category,
  price_offer,
  buyer_action,
  notes,
  selected_angle_id,
  selected_angle_title,
  selected_angle_description,
  selected_angle_reason,
  selected_variant_id,
  selected_variant_name,
  selected_variant_description,
  selected_variant_visual,
  selected_variant_caption_style,
  product_dna_summary,
  product_visual_notes,
  product_type,
  product_features,
  buyer_reasons,
  buyer_objections,
  suggested_use_cases,
  product_positioning,
  product_confidence,
  status
`

function mapCampaignDraft(row: CampaignDraftRow): CampaignDraft {
  return {
    id: row.id,

    productImageUrl: row.product_image_url,
    productImagePath: row.product_image_path,
    imageName: row.image_name,
    brandProfileId: row.brand_profile_id,

    productName: row.product_name,
    category: row.category,
    priceOffer: row.price_offer,
    buyerAction: row.buyer_action,
    notes: row.notes,

    selectedAngleId: row.selected_angle_id,
    selectedAngleTitle: row.selected_angle_title,
    selectedAngleDescription: row.selected_angle_description,
    selectedAngleReason: row.selected_angle_reason,

    selectedVariantId: row.selected_variant_id,
    selectedVariantName: row.selected_variant_name,
    selectedVariantDescription: row.selected_variant_description,
    selectedVariantVisual: row.selected_variant_visual,
    selectedVariantCaptionStyle: row.selected_variant_caption_style,

    productDnaSummary: row.product_dna_summary,
    productVisualNotes: row.product_visual_notes,
    productType: row.product_type,
    productFeatures: row.product_features || [],
    buyerReasons: row.buyer_reasons || [],
    buyerObjections: row.buyer_objections || [],
    suggestedUseCases: row.suggested_use_cases || [],
    productPositioning: row.product_positioning,
    productConfidence: row.product_confidence,

    status: row.status,
  }
}

export async function createCampaignDraft(input: {
  productImageUrl: string
  productImagePath: string
  imageName: string
  brandProfileId?: string | null
}) {
  const { data, error } = await supabase
    .from("campaign_drafts")
    .insert({
      product_image_url: input.productImageUrl,
      product_image_path: input.productImagePath,
      image_name: input.imageName,
      brand_profile_id: input.brandProfileId || null,
      status: "draft",
    })
    .select(selectCampaignDraftFields)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapCampaignDraft(data)
}

export async function getCampaignDraft(id: string) {
  const { data, error } = await supabase
    .from("campaign_drafts")
    .select(selectCampaignDraftFields)
    .eq("id", id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapCampaignDraft(data)
}

export async function updateCampaignDraft(
  id: string,
  update: {
    productName?: string
    category?: string
    priceOffer?: string
    buyerAction?: string
    notes?: string

    selectedAngleId?: string
    selectedAngleTitle?: string
    selectedAngleDescription?: string
    selectedAngleReason?: string

    selectedVariantId?: string
    selectedVariantName?: string
    selectedVariantDescription?: string
    selectedVariantVisual?: string
    selectedVariantCaptionStyle?: string

    status?: string
  },
) {
  const payload = {
    ...(update.productName !== undefined && {
      product_name: update.productName,
    }),
    ...(update.category !== undefined && {
      category: update.category,
    }),
    ...(update.priceOffer !== undefined && {
      price_offer: update.priceOffer,
    }),
    ...(update.buyerAction !== undefined && {
      buyer_action: update.buyerAction,
    }),
    ...(update.notes !== undefined && {
      notes: update.notes,
    }),

    ...(update.selectedAngleId !== undefined && {
      selected_angle_id: update.selectedAngleId,
    }),
    ...(update.selectedAngleTitle !== undefined && {
      selected_angle_title: update.selectedAngleTitle,
    }),
    ...(update.selectedAngleDescription !== undefined && {
      selected_angle_description: update.selectedAngleDescription,
    }),
    ...(update.selectedAngleReason !== undefined && {
      selected_angle_reason: update.selectedAngleReason,
    }),

    ...(update.selectedVariantId !== undefined && {
      selected_variant_id: update.selectedVariantId,
    }),
    ...(update.selectedVariantName !== undefined && {
      selected_variant_name: update.selectedVariantName,
    }),
    ...(update.selectedVariantDescription !== undefined && {
      selected_variant_description: update.selectedVariantDescription,
    }),
    ...(update.selectedVariantVisual !== undefined && {
      selected_variant_visual: update.selectedVariantVisual,
    }),
    ...(update.selectedVariantCaptionStyle !== undefined && {
      selected_variant_caption_style: update.selectedVariantCaptionStyle,
    }),

    ...(update.status !== undefined && {
      status: update.status,
    }),
  }

  const { data, error } = await supabase
    .from("campaign_drafts")
    .update(payload)
    .eq("id", id)
    .select(selectCampaignDraftFields)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapCampaignDraft(data)
}

export function getCampaignDraftId() {
  if (typeof window === "undefined") return null

  return localStorage.getItem(CAMPAIGN_DRAFT_ID_KEY)
}

export function saveCampaignDraftId(id: string) {
  if (typeof window === "undefined") return

  localStorage.setItem(CAMPAIGN_DRAFT_ID_KEY, id)
}

export function clearCampaignDraftId() {
  if (typeof window === "undefined") return

  localStorage.removeItem(CAMPAIGN_DRAFT_ID_KEY)
}