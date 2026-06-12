import { GeneratedCaption } from "@/components/campaign/generated-caption"
import { GeneratedPosterDirection } from "@/components/campaign/generated-poster-direction"
import { GeneratedWhatsappCopy } from "@/components/campaign/generated-whatsapp-copy"

export function CampaignOutputPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <GeneratedCaption />
      <GeneratedWhatsappCopy />
      <GeneratedPosterDirection />
    </div>
  )
}
