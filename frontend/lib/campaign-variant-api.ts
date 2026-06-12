export type GeneratedCampaignVariant = {
  variant_id: string
  name: string
  description: string
  visual_direction: string
  caption_style: string
  whatsapp_style: string
  poster_layout: string
  why_it_fits: string
  confidence: number
  refinement_count: number
  is_refined: boolean
}

export type GenerateCampaignVariantsResponse = {
  draft_id: string
  brand_profile_id: string | null
  selected_angle_id: string | null
  variants: GeneratedCampaignVariant[]
}

export async function generateCampaignVariants(draftId: string) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  if (!backendUrl) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL")
  }

  const response = await fetch(
    `${backendUrl}/api/v1/campaign-variants/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        draft_id: draftId,
      }),
    },
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || "Could not generate variants.")
  }

  return data as GenerateCampaignVariantsResponse
}

export async function refineCampaignVariant(input: {
  draftId: string
  variantId: string
  refineInstruction: string
}) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  if (!backendUrl) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL")
  }

  const response = await fetch(`${backendUrl}/api/v1/campaign-variants/refine`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      draft_id: input.draftId,
      variant_id: input.variantId,
      refine_instruction: input.refineInstruction,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || "Could not refine variant.")
  }

  return data as {
    draft_id: string
    variant: GeneratedCampaignVariant
  }
}