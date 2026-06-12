const BRAND_PROFILE_ID_KEY = "dhoom_brand_profile_id"

export function saveBrandProfileId(id: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(BRAND_PROFILE_ID_KEY, id)
}

export function getBrandProfileId() {
  if (typeof window === "undefined") return null
  return localStorage.getItem(BRAND_PROFILE_ID_KEY)
}

export function clearBrandProfileId() {
  if (typeof window === "undefined") return
  localStorage.removeItem(BRAND_PROFILE_ID_KEY)
}