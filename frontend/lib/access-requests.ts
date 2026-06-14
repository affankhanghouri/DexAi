import { supabase } from "@/lib/supabase"

export type AccessRequestInput = {
  whatsappNumber: string
  storeLink: string
  productCategory?: string
  note?: string
}

export async function createAccessRequest(input: AccessRequestInput) {
  const { data, error } = await supabase
    .from("access_requests")
    .insert({
      whatsapp_number: input.whatsappNumber,
      store_link: input.storeLink,
      product_category: input.productCategory || null,
      note: input.note || null,
      source: "landing_page",
      status: "new",
    })
    .select("id")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}