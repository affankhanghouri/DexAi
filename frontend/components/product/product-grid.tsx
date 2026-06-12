import { ProductCard } from "@/components/product/product-card"

export function ProductGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <ProductCard />
    </div>
  )
}
