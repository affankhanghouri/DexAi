export type BrandSourceType =
  | "auto"
  | "website"
  | "instagram"
  | "facebook"
  | "shopify"
  | "daraz"

export type BrandDNAResponse = {
  id: string
  source_url: string
  source_type: string
  dna: {
    brand_name: string
    business_type: string
    category: string
    summary: string
    target_audience: string
    tone: string
    visual_style: string
    price_positioning: string
    pakistani_market_context: Record<string, unknown>
    selling_points: string[]
    trust_signals: string[]
    weaknesses: string[]
    campaign_rules: {
      do?: string[]
      avoid?: string[]
      best_campaign_angles?: string[]
      poster_rules?: string[]
      caption_rules?: string[]
    }
    angle_strategy: Record<string, unknown>
    content_language_strategy: Record<string, unknown>
    raw_context: string
    confidence: number
  }
}

export async function analyzeBrandDNA(
  websiteUrl: string,
  sourceType: BrandSourceType = "auto",
) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  if (!backendUrl) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL")
  }

  const response = await fetch(`${backendUrl}/api/v1/brand-dna/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      website_url: websiteUrl,
      source_type: sourceType,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || "Brand DNA analysis failed.")
  }

  return data as BrandDNAResponse
}