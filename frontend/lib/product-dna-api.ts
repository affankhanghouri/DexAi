export type ProductDNAResponse = {
  draft_id: string
  product_dna: {
    product_type: string
    product_dna_summary: string
    product_visual_notes: string
    product_features: string[]
    buyer_reasons: string[]
    buyer_objections: string[]
    suggested_use_cases: string[]
    product_positioning: string
    campaign_implications: {
      best_angle_direction: string
      best_visual_direction: string
      best_caption_direction: string
      best_whatsapp_direction: string
      avoid_in_campaign: string[]
    }
    confidence: number
  }
}

export async function analyzeProductDNA(draftId: string) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  if (!backendUrl) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL")
  }

  const response = await fetch(`${backendUrl}/api/v1/product-dna/analyze`, {
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
    throw new Error(data.detail || "Could not analyze product DNA.")
  }

  return data as ProductDNAResponse
}