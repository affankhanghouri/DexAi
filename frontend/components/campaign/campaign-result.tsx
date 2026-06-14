"use client"

import { PremiumCampaignResultView } from "@/components/campaign/premium-campaign-result-view"
import { getCampaignAssetBrief, type CampaignAssetBrief } from "@/lib/campaign-asset-brief"
import { refineCampaignWithGhostEditor } from "@/lib/campaign-ghost-editor-api"
import {
  getGeneratedAssetsForBrief,
  type CampaignGeneratedAsset,
} from "@/lib/campaign-generated-assets"
import { getCampaignOutput, type CampaignOutput } from "@/lib/campaign-output"
import {
  RefreshCw,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"

export function CampaignResult({ campaignId }: { campaignId: string }) {
  const [output, setOutput] = useState<CampaignOutput | null>(null)
  const [assetBrief, setAssetBrief] = useState<CampaignAssetBrief | null>(null)
  const [generatedAssets, setGeneratedAssets] = useState<CampaignGeneratedAsset[]>([])
  const [copied, setCopied] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefining, setIsRefining] = useState(false)

  const getResultData = useCallback(async () => {
    const data = await getCampaignOutput(campaignId)
    const brief = await getCampaignAssetBrief(data.id)
    const assets = brief ? await getGeneratedAssetsForBrief(brief.id) : []

    return { data, brief, assets }
  }, [campaignId])

  const loadOutput = useCallback(async () => {
    const { data, brief, assets } = await getResultData()

    setOutput(data)
    setAssetBrief(brief)
    setGeneratedAssets(assets)
  }, [getResultData])

  useEffect(() => {
    let isMounted = true

    async function loadInitialOutput() {
      const { data, brief, assets } = await getResultData()

      if (!isMounted) return

      setOutput(data)
      setAssetBrief(brief)
      setGeneratedAssets(assets)
      setIsLoading(false)
    }

    void loadInitialOutput()

    return () => {
      isMounted = false
    }
  }, [getResultData])

  async function copyText(label: string, text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(label)

    setTimeout(() => {
      setCopied("")
    }, 1200)
  }

  async function handleGhostRefine(instruction: string) {
    if (!output) return

    setIsRefining(true)

    try {
      await refineCampaignWithGhostEditor({
        campaignOutputId: output.id,
        instruction,
      })

      await loadOutput()
    } finally {
      setIsRefining(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto grid min-h-[520px] max-w-[1180px] place-items-center rounded-[1.8rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-6 text-center">
        <div>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
            <RefreshCw size={28} className="animate-spin" />
          </div>

          <h1 className="mt-5 text-4xl font-black tracking-[-0.08em] text-white">
            Loading campaign pack...
          </h1>

          <p className="mt-3 text-sm font-bold text-white/45">
            Dhoom is opening your ready-to-post campaign command center.
          </p>
        </div>
      </div>
    )
  }

  if (!output) return null

  return (
    <PremiumCampaignResultView
      output={output}
      assetBrief={assetBrief}
      generatedAssets={generatedAssets}
      copied={copied}
      isRefining={isRefining}
      onCopy={copyText}
      onGhostRefine={handleGhostRefine}
    />
  )
}
