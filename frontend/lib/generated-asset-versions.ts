export type GeneratedAssetVersion = {
  id: string
  generatedAssetId: string
  assetBriefId: string
  outputId: string
  draftId: string

  versionNumber: number

  assetUrl: string
  assetPath: string
  thumbnailUrl: string | null

  sourcePrompt: string
  generationPrompt: string

  provider: string | null
  generationMetadata: Record<string, unknown>

  isSelected: boolean
}

type GeneratedAssetVersionApi = {
  id: string
  generated_asset_id: string
  asset_brief_id: string
  output_id: string
  draft_id: string

  version_number: number

  asset_url: string
  asset_path: string
  thumbnail_url: string | null

  source_prompt: string
  generation_prompt: string

  provider: string | null
  generation_metadata: Record<string, unknown>

  is_selected: boolean
}

function mapVersion(version: GeneratedAssetVersionApi): GeneratedAssetVersion {
  return {
    id: version.id,
    generatedAssetId: version.generated_asset_id,
    assetBriefId: version.asset_brief_id,
    outputId: version.output_id,
    draftId: version.draft_id,

    versionNumber: version.version_number,

    assetUrl: version.asset_url,
    assetPath: version.asset_path,
    thumbnailUrl: version.thumbnail_url,

    sourcePrompt: version.source_prompt,
    generationPrompt: version.generation_prompt,

    provider: version.provider,
    generationMetadata: version.generation_metadata || {},

    isSelected: version.is_selected,
  }
}

export async function getGeneratedAssetVersions(generatedAssetId: string) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  if (!backendUrl) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL")
  }

  const response = await fetch(
    `${backendUrl}/api/v1/campaign-generated-assets/${generatedAssetId}/versions`,
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || "Could not load asset versions.")
  }

  return (data.versions as GeneratedAssetVersionApi[]).map(mapVersion)
}

export async function selectGeneratedAssetVersion(versionId: string) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  if (!backendUrl) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL")
  }

  const response = await fetch(
    `${backendUrl}/api/v1/campaign-generated-assets/select-version`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version_id: versionId,
      }),
    },
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || "Could not select asset version.")
  }

  return mapVersion(data.version as GeneratedAssetVersionApi)
}
