import { supabase } from "@/lib/supabase"

export type AccessRequestInput = {
  whatsappNumber: string
  storeLink: string
  productCategory?: string
  note?: string
  productImageFile?: File | null
}

async function uploadProductImage(file: File) {
  const fileExt = file.name.split(".").pop() || "jpg"
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
  const filePath = `landing-requests/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from("access-request-products")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  const { data } = supabase.storage
    .from("access-request-products")
    .getPublicUrl(filePath)

  return {
    productImagePath: filePath,
    productImageUrl: data.publicUrl,
  }
}

export async function createAccessRequest(input: AccessRequestInput) {
  let productImageUrl: string | null = null
  let productImagePath: string | null = null

  if (input.productImageFile) {
    const uploadResult = await uploadProductImage(input.productImageFile)
    productImageUrl = uploadResult.productImageUrl
    productImagePath = uploadResult.productImagePath
  }

  const { error } = await supabase.from("access_requests").insert({
    whatsapp_number: input.whatsappNumber,
    store_link: input.storeLink,
    product_category: input.productCategory || null,
    note: input.note || null,
    product_image_url: productImageUrl,
    product_image_path: productImagePath,
    source: "landing_page",
    status: "new",
  })

  if (error) {
    throw new Error(error.message)
  }

  return { success: true }
}