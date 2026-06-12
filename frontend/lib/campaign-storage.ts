import { supabase } from "@/lib/supabase"

const CAMPAIGN_BUCKET = "campaign-assets"

export async function uploadCampaignProductImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload an image file.")
  }

  const maxSizeInMb = 8
  const maxSizeInBytes = maxSizeInMb * 1024 * 1024

  if (file.size > maxSizeInBytes) {
    throw new Error(`Image must be smaller than ${maxSizeInMb}MB.`)
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "png"
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`
  const path = `product-uploads/${fileName}`

  const { error } = await supabase.storage
    .from(CAMPAIGN_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = supabase.storage.from(CAMPAIGN_BUCKET).getPublicUrl(path)

  return {
    path,
    publicUrl: data.publicUrl,
  }
}