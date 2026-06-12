import { CampaignResult } from "@/components/campaign/campaign-result"

export default async function CampaignResultPage({
  params,
}: {
  params: Promise<{ campaignId: string }>
}) {
  const { campaignId } = await params

  return <CampaignResult campaignId={campaignId} />
}