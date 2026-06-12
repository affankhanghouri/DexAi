import { ProductForm } from "@/components/product/product-form"
import { PageHeader } from "@/components/shared/page-header"

export default function NewProductPage() {
  return (
    <>
      <PageHeader title="Add product" description="Capture product details for campaign generation." />
      <ProductForm />
    </>
  )
}
