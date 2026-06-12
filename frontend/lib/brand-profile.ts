import { supabase } from "@/lib/supabase"

export type BrandProfile = {
  id: string
  sourceUrl: string
  brandName: string | null
  businessType: string | null
  category: string | null
  summary: string | null
  targetAudience: string | null
  tone: string | null
  visualStyle: string | null
  pricePositioning: string | null
  sellingPoints: string[]
  trustSignals: string[]
  weaknesses: string[]
  campaignRules: Record<string, unknown>
  pakistaniMarketContext: Record<string, unknown>
  angleStrategy: Record<string, unknown>
  contentLanguageStrategy: Record<string, unknown>
  confidence: number | null
  status: string
  sourceType: string | null
  sourcePlatform: string | null
  createdAt: string
}

type BrandProfileRow = {
  id: string
  source_url: string
  brand_name: string | null
  business_type: string | null
  category: string | null
  summary: string | null
  target_audience: string | null
  tone: string | null
  visual_style: string | null
  price_positioning: string | null
  selling_points: string[] | null
  trust_signals: string[] | null
  weaknesses: string[] | null
  campaign_rules: Record<string, unknown> | null
  pakistani_market_context: Record<string, unknown> | null
  angle_strategy: Record<string, unknown> | null
  content_language_strategy: Record<string, unknown> | null
  confidence: number | null
  status: string
  source_type: string | null
  source_platform: string | null
  created_at: string
}

const brandProfileSelect = `
  id,
  source_url,
  brand_name,
  business_type,
  category,
  summary,
  target_audience,
  tone,
  visual_style,
  price_positioning,
  selling_points,
  trust_signals,
  weaknesses,
  campaign_rules,
  pakistani_market_context,
  angle_strategy,
  content_language_strategy,
  confidence,
  status,
  source_type,
  source_platform,
  created_at
`

function mapBrandProfile(row: BrandProfileRow): BrandProfile {
  return {
    id: row.id,
    sourceUrl: row.source_url,
    brandName: row.brand_name,
    businessType: row.business_type,
    category: row.category,
    summary: row.summary,
    targetAudience: row.target_audience,
    tone: row.tone,
    visualStyle: row.visual_style,
    pricePositioning: row.price_positioning,
    sellingPoints: row.selling_points || [],
    trustSignals: row.trust_signals || [],
    weaknesses: row.weaknesses || [],
    campaignRules: row.campaign_rules || {},
    pakistaniMarketContext: row.pakistani_market_context || {},
    angleStrategy: row.angle_strategy || {},
    contentLanguageStrategy: row.content_language_strategy || {},
    confidence: row.confidence,
    status: row.status,
    sourceType: row.source_type,
    sourcePlatform: row.source_platform,
    createdAt: row.created_at,
  }
}

export async function getBrandProfile(id: string) {
  const { data, error } = await supabase
    .from("brand_profiles")
    .select(brandProfileSelect)
    .eq("id", id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapBrandProfile(data as BrandProfileRow)
}

export async function getAllBrandProfiles() {
  const { data, error } = await supabase
    .from("brand_profiles")
    .select(brandProfileSelect)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data as BrandProfileRow[]).map(mapBrandProfile)
}