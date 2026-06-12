import { AssetCard } from "@/components/creative-lab/asset-card"

export function CreativeGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <AssetCard title="Poster direction" />
      <AssetCard title="Video concept" />
    </div>
  )
}
