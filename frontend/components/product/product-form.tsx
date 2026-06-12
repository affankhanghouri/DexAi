import { ProductImageUpload } from "@/components/product/product-image-upload"

export function ProductForm() {
  return (
    <form className="grid gap-4 rounded-lg border border-[#e3d7c7] bg-white p-5">
      <ProductImageUpload />
      <input className="rounded-md border border-[#d8c8b5] p-3" placeholder="Product name" />
      <textarea className="min-h-28 rounded-md border border-[#d8c8b5] p-3" placeholder="Product details" />
    </form>
  )
}
