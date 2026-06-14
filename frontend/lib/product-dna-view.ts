import { supabase } from "@/lib/supabase"

export type ProductDNAView = {
  id: string

  productName: string | null
  category: string | null
  priceOffer: string | null
  buyerAction: string | null
  notes: string | null
  moment: string | null
  productImageUrl: string | null

  productDnaSummary: string | null
  productVisualNotes: string | null
  productType: string | null
  productFeatures: string[]
  buyerReasons: string[]
  buyerObjections: string[]
  suggestedUseCases: string[]
  productPositioning: string | null
  productConfidence: number | null
}

type ProductDNARow = {
  id: string

  product_name: string | null
  category: string | null
  price_offer: string | null
  buyer_action: string | null
  notes: string | null
  moment: string | null
  product_image_url: string | null

  product_dna_summary: string | null
  product_visual_notes: string | null
  product_type: string | null
  product_features: string[] | null
  buyer_reasons: string[] | null
  buyer_objections: string[] | null
  suggested_use_cases: string[] | null
  product_positioning: string | null
  product_confidence: number | null
}

function mapProductDNA(row: ProductDNARow): ProductDNAView {
  return {
    id: row.id,

    productName: row.product_name,
    category: row.category,
    priceOffer: row.price_offer,
    buyerAction: row.buyer_action,
    notes: row.notes,
    moment: row.moment,
    productImageUrl: row.product_image_url,

    productDnaSummary: row.product_dna_summary,
    productVisualNotes: row.product_visual_notes,
    productType: row.product_type,
    productFeatures: row.product_features || [],
    buyerReasons: row.buyer_reasons || [],
    buyerObjections: row.buyer_objections || [],
    suggestedUseCases: row.suggested_use_cases || [],
    productPositioning: row.product_positioning,
    productConfidence: row.product_confidence,
  }
}

export async function getProductDNAView(draftId: string) {
  const { data, error } = await supabase
    .from("campaign_drafts")
    .select(
      `
      id,
      product_name,
      category,
      price_offer,
      buyer_action,
      notes,
      moment,
      product_image_url,
      product_dna_summary,
      product_visual_notes,
      product_type,
      product_features,
      buyer_reasons,
      buyer_objections,
      suggested_use_cases,
      product_positioning,
      product_confidence
      `,
    )
    .eq("id", draftId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapProductDNA(data as ProductDNARow)
}
