export function ProductCard({ name = "Sample product" }: { name?: string }) {
  return <article className="rounded-lg border border-[#e3d7c7] bg-white p-4 text-sm">{name}</article>
}
