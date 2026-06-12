import { CampaignMomentPicker } from "@/components/campaign/campaign-moment-picker"
import { ProductUploadBox } from "@/components/campaign/product-upload-box"

export function CampaignForm() {
  return (
    <form className="grid gap-4 rounded-lg border border-[#e3d7c7] bg-white p-5">
      <ProductUploadBox />
      <CampaignMomentPicker />
      <label className="grid gap-2 text-sm font-medium">
        Campaign brief
        <textarea className="min-h-32 rounded-md border border-[#d8c8b5] p-3" placeholder="What should this campaign sell?" />
      </label>
    </form>
  )
}
