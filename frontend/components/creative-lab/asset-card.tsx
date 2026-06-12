export function AssetCard({ title = "Generated asset" }: { title?: string }) {
  return <article className="rounded-lg border border-[#e3d7c7] bg-white p-4 text-sm">{title}</article>
}
