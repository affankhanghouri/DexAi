"use client"

import { getBrandProfileId } from "@/lib/brand-profile-session"
import { getBrandProfile, type BrandProfile } from "@/lib/brand-profile"
import { uploadCampaignProductImage } from "@/lib/campaign-storage"
import {
  clearCampaignDraftId,
  createCampaignDraft,
  getCampaignDraft,
  getCampaignDraftId,
  saveCampaignDraftId,
  updateCampaignDraft,
  type CampaignDraft,
} from "@/lib/campaign-draft"
import { analyzeProductDNA } from "@/lib/product-dna-api"
import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  Camera,
  Check,
  Gift,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import {
  generateCampaignVariants,
  refineCampaignVariant,
  type GeneratedCampaignVariant,
} from "@/lib/campaign-variant-api"

import { generateFinalCampaign } from "@/lib/final-campaign-api"

type AngleOption = {
  id: string
  title: string
  description: string
  reason: string
  icon: ReactNode
}

function createAngleOptions(draft: CampaignDraft): AngleOption[] {
  const category = draft.category || "product"
  const offer = draft.priceOffer || "offer"

  return [
    {
      id: "premium-look",
      title: "Premium Look",
      description: `Position this ${category} as high-quality and worth buying.`,
      reason: "Best when the product looks better than average.",
      icon: <Sparkles size={20} />,
    },
    {
      id: "comfort-use",
      title: "Daily Use",
      description: `Show why this ${category} fits everyday life.`,
      reason: "Best when buyer wants practical value.",
      icon: <Gift size={20} />,
    },
    {
      id: "offer-push",
      title: "Offer Push",
      description: `Make ${offer} feel urgent and easy to claim.`,
      reason: "Best when seller wants fast WhatsApp orders.",
      icon: <BadgePercent size={20} />,
    },
    {
      id: "trust-delivery",
      title: "Trust + Delivery",
      description: "Focus on reliability, easy ordering, and smooth delivery.",
      reason: "Best for small sellers building buyer confidence.",
      icon: <Zap size={20} />,
    },
  ]
}

export function CampaignUploadStep() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const [preview, setPreview] = useState("")
  const [imageName, setImageName] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [activeBrand, setActiveBrand] = useState<BrandProfile | null>(null)
  const [isCheckingBrand, setIsCheckingBrand] = useState(true)


  useEffect(() => {
    async function checkBrand() {
      const brandId = getBrandProfileId()

      if (!brandId) {
        setIsCheckingBrand(false)
        return
      }

      try {
        const brand = await getBrandProfile(brandId)
        setActiveBrand(brand)
      } catch {
        setActiveBrand(null)
      } finally {
        setIsCheckingBrand(false)
      }
    }

    checkBrand()
  }, [])

  async function handleFile(file?: File) {
    if (!file) return

    setUploadError("")
    setIsUploading(true)

    const localPreview = URL.createObjectURL(file)
    setPreview(localPreview)
    setImageName(file.name)

    try {
      const uploaded = await uploadCampaignProductImage(file)
      const brandProfileId = getBrandProfileId()

      const draft = await createCampaignDraft({
        productImageUrl: uploaded.publicUrl,
        productImagePath: uploaded.path,
        imageName: file.name,
        brandProfileId,
      })

      saveCampaignDraftId(draft.id)

      setPreview(draft.productImageUrl || "")
      setImageName(draft.imageName || file.name)
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Image upload failed.",
      )
      setPreview("")
      setImageName("")
    } finally {
      setIsUploading(false)
    }
  }
  function continueNext() {
    const draftId = getCampaignDraftId()

    if (!draftId || !preview || isUploading) return

    router.push("/dashboard/campaigns/new/details")
  }

  if (isCheckingBrand) {
    return <WizardLoading />
  }

  if (!activeBrand) {
    return (
      <WizardFrame
        step="00"
        title="Setup Brand DNA first"
        subtitle="Dhoom needs your active brand before creating campaigns."
      >
        <div className="rounded-[1.4rem] border border-orange-400/25 bg-orange-500/10 p-5">
          <p className="text-sm font-bold leading-7 text-white/62">
            Campaigns should follow your brand tone, audience, trust signals,
            Pakistani market context, and campaign rules. Setup Brand DNA once,
            then every product campaign will use it.
          </p>

          <Link
            href="/dashboard/brand-dna"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-[#d9ff3f] px-5 text-sm font-black text-[#070816]"
          >
            Setup Brand DNA
          </Link>
        </div>
      </WizardFrame>
    )
  }

  return (
    <WizardFrame
      step="01"
      title="Upload product"
      subtitle="Start with one product image."
    >
      <div className="rounded-[1.2rem] border border-white/10 bg-[#0d0d13]/90 p-4">
        <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
          Active Brand DNA
        </p>

        <div className="mt-2 flex flex-col justify-between gap-2 md:flex-row md:items-center">
          <div>
            <h3 className="text-xl font-black tracking-[-0.05em] text-white">
              {activeBrand.brandName || "Untitled brand"}
            </h3>

            <p className="mt-1 text-sm font-bold text-white/45">
              {activeBrand.category || "No category"} •{" "}
              {activeBrand.tone || "No tone"}
            </p>
          </div>

          <Link
            href="/dashboard/brand-dna"
            className="text-xs font-black uppercase tracking-[0.18em] text-[#d9ff3f]"
          >
            Change brand
          </Link>
        </div>
      </div>

      <div className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="group relative grid min-h-[360px] w-full place-items-center overflow-hidden rounded-[1.2rem] border border-dashed border-white/15 bg-white/[0.045] p-4 text-center transition hover:border-[#d9ff3f]/45 hover:bg-white/[0.065] disabled:cursor-wait disabled:opacity-70"
        >
          {preview ? (
            <img
              src={preview}
              alt="Product preview"
              className="max-h-[330px] w-full rounded-[1rem] object-contain"
            />
          ) : (
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/[0.08] text-white/65">
                <Camera size={26} />
              </div>

              <p className="mt-4 text-lg font-black text-white">
                Choose product photo
              </p>

              <p className="mt-2 text-sm font-bold text-white/40">
                Product image, catalogue photo, or WhatsApp product picture.
              </p>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 grid place-items-center bg-[#050611]/70 backdrop-blur-sm">
              <p className="rounded-full bg-[#d9ff3f] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#070816]">
                Uploading...
              </p>
            </div>
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />

        {imageName && (
          <p className="mt-3 text-sm font-bold text-white/45">
            Selected: {imageName}
          </p>
        )}

        {uploadError && (
          <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
            {uploadError}
          </p>
        )}
      </div>
      <WizardFooter>
        <Link href="/dashboard" className="wizard-secondary-btn">
          Cancel
        </Link>
        <button
          onClick={continueNext}
          disabled={!preview || isUploading}
          className="wizard-primary-btn disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
          <ArrowRight size={17} />
        </button>
      </WizardFooter>
    </WizardFrame>
  )
}

export function CampaignDetailsStep() {
  const router = useRouter()

  const [draft, setDraft] = useState<CampaignDraft | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [analysisError, setAnalysisError] = useState("")

  useEffect(() => {
    async function loadDraft() {
      const draftId = getCampaignDraftId()

      if (!draftId) {
        router.push("/dashboard/campaigns/new")
        return
      }

      const data = await getCampaignDraft(draftId)
      setDraft(data)
    }

    loadDraft()
  }, [router])

  function updateField(key: keyof CampaignDraft, value: string) {
    setDraft((current) => {
      if (!current) return current
      return { ...current, [key]: value }
    })
  }

  async function continueNext() {
    if (!draft) return

    setAnalysisError("")
    setIsSaving(true)

    try {
      await updateCampaignDraft(draft.id, {
        productName: draft.productName || "",
        category: draft.category || "",
        priceOffer: draft.priceOffer || "",
        buyerAction: draft.buyerAction || "",
        notes: draft.notes || "",
      })

      await analyzeProductDNA(draft.id)

      router.push("/dashboard/campaigns/new/angles")
    } catch (error) {
      setAnalysisError(
        error instanceof Error
          ? error.message
          : "Could not understand product DNA.",
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (!draft) {
    return <WizardLoading />
  }

  return (
    <WizardFrame
      step="02"
      title="Product details"
      subtitle="Add the basic selling information."
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Field
              label="Product name"
              placeholder="Black embroidered suit"
              value={draft.productName || ""}
              onChange={(value) => updateField("productName", value)}
            />

            <Field
              label="Category"
              placeholder="Fashion, food, shoes..."
              value={draft.category || ""}
              onChange={(value) => updateField("category", value)}
            />

            <Field
              label="Price / offer"
              placeholder="Rs. 2,999 / 20% off"
              value={draft.priceOffer || ""}
              onChange={(value) => updateField("priceOffer", value)}
            />

            <Field
              label="Buyer action"
              placeholder="Order on WhatsApp"
              value={draft.buyerAction || ""}
              onChange={(value) => updateField("buyerAction", value)}
            />
          </div>

          <div className="mt-3">
            <label className="mb-2 block text-[0.62rem] font-black uppercase tracking-[0.2em] text-white/38">
              Notes
            </label>

            <textarea
              value={draft.notes || ""}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Quality, delivery, size, taste, material, what makes it special..."
              className="min-h-[120px] w-full resize-none rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/25 focus:border-[#d9ff3f]/45"
            />
          </div>

          {analysisError && (
            <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
              {analysisError}
            </p>
          )}
        </div>

        <ProductPreview image={draft.productImageUrl || ""} />
      </div>

      <WizardFooter>
        <Link href="/dashboard/campaigns/new" className="wizard-secondary-btn">
          <ArrowLeft size={17} />
          Back
        </Link>

        <button
          onClick={continueNext}
          disabled={isSaving}
          className="wizard-primary-btn disabled:cursor-wait disabled:opacity-50"
        >
          {isSaving ? "Understanding product..." : "Continue"}
          <ArrowRight size={17} />
        </button>
      </WizardFooter>
    </WizardFrame>
  )
}

export function CampaignAnglesStep() {
  const router = useRouter()

  const [draft, setDraft] = useState<CampaignDraft | null>(null)
  const [selectedId, setSelectedId] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function loadDraft() {
      const draftId = getCampaignDraftId()

      if (!draftId) {
        router.push("/dashboard/campaigns/new")
        return
      }

      const data = await getCampaignDraft(draftId)
      setDraft(data)
      setSelectedId(data.selectedAngleId || "")
    }

    loadDraft()
  }, [router])

  async function continueNext() {
    if (!draft || !selectedId) return

    const selected = createAngleOptions(draft).find(
      (angle) => angle.id === selectedId,
    )

    if (!selected) return

    setIsSaving(true)

    await updateCampaignDraft(draft.id, {
      selectedAngleId: selected.id,
      selectedAngleTitle: selected.title,
      selectedAngleDescription: selected.description,
      selectedAngleReason: selected.reason,
    })

    setIsSaving(false)
    router.push("/dashboard/campaigns/new/variants")
  }

  if (!draft) {
    return <WizardLoading />
  }

  const angles = createAngleOptions(draft)

  return (
    <WizardFrame
      step="03"
      title="Choose angle"
      subtitle="Select the selling direction."
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {angles.map((angle) => {
          const active = selectedId === angle.id

          return (
            <button
              key={angle.id}
              onClick={() => setSelectedId(angle.id)}
              className={`rounded-[1.3rem] border p-4 text-left transition ${
                active
                  ? "border-[#d9ff3f]/50 bg-[#d9ff3f] text-[#070816]"
                  : "border-white/10 bg-[#0d0d13]/90 text-white hover:border-orange-400/35"
              }`}
            >
              <div className="mb-8 flex items-center justify-between">
                {angle.icon}
                {active && <Check size={18} />}
              </div>

              <h3 className="text-xl font-black leading-none tracking-[-0.05em]">
                {angle.title}
              </h3>

              <p
                className={`mt-3 text-sm font-bold leading-6 ${
                  active ? "text-[#070816]/65" : "text-white/45"
                }`}
              >
                {angle.description}
              </p>

              <p
                className={`mt-4 text-xs font-black uppercase tracking-[0.16em] ${
                  active ? "text-[#070816]/55" : "text-orange-300"
                }`}
              >
                {angle.reason}
              </p>
            </button>
          )
        })}
      </div>

      <WizardFooter>
        <Link
          href="/dashboard/campaigns/new/details"
          className="wizard-secondary-btn"
        >
          <ArrowLeft size={17} />
          Back
        </Link>

        <button
          onClick={continueNext}
          disabled={!selectedId || isSaving}
          className="wizard-primary-btn disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSaving ? "Saving..." : "Continue"}
          <ArrowRight size={17} />
        </button>
      </WizardFooter>
    </WizardFrame>
  )
}

export function CampaignVariantsStep() {
  const router = useRouter()

  const [draft, setDraft] = useState<CampaignDraft | null>(null)
  const [variants, setVariants] = useState<GeneratedCampaignVariant[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [refiningId, setRefiningId] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadAndGenerateVariants() {
      const draftId = getCampaignDraftId()

      if (!draftId) {
        router.push("/dashboard/campaigns/new")
        return
      }

      try {
        const draftData = await getCampaignDraft(draftId)
        setDraft(draftData)
        setSelectedId(draftData.selectedVariantId || "")

        const generated = await generateCampaignVariants(draftId)
        setVariants(generated.variants)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not generate variants.",
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadAndGenerateVariants()
  }, [router])

  async function handleRefine(variantId: string, instruction: string) {
    if (!draft) return

    setRefiningId(variantId)
    setError("")

    try {
      const result = await refineCampaignVariant({
        draftId: draft.id,
        variantId,
        refineInstruction: instruction,
      })

      setVariants((current) =>
        current.map((item) =>
          item.variant_id === result.variant.variant_id ? result.variant : item,
        ),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not refine variant.")
    } finally {
      setRefiningId("")
    }
  }

  async function continueNext() {
    if (!draft || !selectedId) return

    const selected = variants.find((variant) => variant.variant_id === selectedId)

    if (!selected) return

    setIsSaving(true)

    await updateCampaignDraft(draft.id, {
      selectedVariantId: selected.variant_id,
      selectedVariantName: selected.name,
      selectedVariantDescription: selected.description,
      selectedVariantVisual: selected.visual_direction,
      selectedVariantCaptionStyle: selected.caption_style,
    })

    setIsSaving(false)
    router.push("/dashboard/campaigns/new/review")
  }

  if (isLoading) {
    return (
      <WizardFrame
        step="04"
        title="Generating variants"
        subtitle="Dhoom is creating campaign styles for your selected angle."
      >
        <div className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-300">
            Creating variant carousel...
          </p>
        </div>
      </WizardFrame>
    )
  }

  if (!draft) {
    return <WizardLoading />
  }

  return (
    <WizardFrame
      step="04"
      title="Choose variant"
      subtitle="Pick the campaign style."
    >
      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
          {error}
        </p>
      )}

      <div className="grid gap-3 lg:grid-cols-3">
        {variants.map((variant) => {
          const selected = selectedId === variant.variant_id
          const isRefining = refiningId === variant.variant_id

          return (
            <div
              key={variant.variant_id}
              className={`rounded-[1.3rem] border p-4 transition ${
                selected
                  ? "border-[#d9ff3f]/50 bg-[#d9ff3f] text-[#070816]"
                  : "border-white/10 bg-[#0d0d13]/90 text-white"
              }`}
            >
              <div className="mb-6 flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-2 text-[0.58rem] font-black uppercase tracking-[0.16em] ${
                    selected
                      ? "bg-[#070816] text-[#d9ff3f]"
                      : "bg-white/[0.06] text-orange-300"
                  }`}
                >
                  {Math.round(variant.confidence * 100)}%
                </span>

                {selected && <Check size={18} />}
              </div>

              <h3 className="text-2xl font-black leading-none tracking-[-0.06em]">
                {variant.name}
              </h3>

              <p
                className={`mt-3 text-sm font-bold leading-6 ${
                  selected ? "text-[#070816]/65" : "text-white/45"
                }`}
              >
                {variant.description}
              </p>

              <VariantDetailBlock
                selected={selected}
                label="Visual"
                value={variant.visual_direction}
              />

              <VariantDetailBlock
                selected={selected}
                label="Caption"
                value={variant.caption_style}
              />

              <VariantDetailBlock
                selected={selected}
                label="Poster"
                value={variant.poster_layout}
              />

              <div
                className={`mt-4 rounded-xl border p-3 ${
                  selected
                    ? "border-[#070816]/10 bg-[#070816]/10"
                    : "border-white/10 bg-white/[0.045]"
                }`}
              >
                <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] opacity-60">
                  Why it fits
                </p>
                <p className="mt-2 text-xs font-bold leading-5 opacity-80">
                  {variant.why_it_fits}
                </p>
              </div>

              {variant.is_refined && (
                <p
                  className={`mt-3 text-[0.58rem] font-black uppercase tracking-[0.16em] ${
                    selected ? "text-[#070816]/55" : "text-[#d9ff3f]"
                  }`}
                >
                  Refined {variant.refinement_count}x
                </p>
              )}

              <div className="mt-4 grid gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      handleRefine(
                        variant.variant_id,
                        "Make it more premium, cleaner, and less cluttered.",
                      )
                    }
                    disabled={!!refiningId}
                    className={`h-10 rounded-xl text-xs font-black transition disabled:cursor-wait disabled:opacity-50 ${
                      selected
                        ? "bg-[#070816]/10 text-[#070816]"
                        : "bg-white/[0.07] text-white/70 hover:bg-white/[0.1]"
                    }`}
                  >
                    {isRefining ? "Refining..." : "More premium"}
                  </button>

                  <button
                    onClick={() =>
                      handleRefine(
                        variant.variant_id,
                        "Make it more direct, urgent, and WhatsApp-order focused.",
                      )
                    }
                    disabled={!!refiningId}
                    className={`h-10 rounded-xl text-xs font-black transition disabled:cursor-wait disabled:opacity-50 ${
                      selected
                        ? "bg-[#070816]/10 text-[#070816]"
                        : "bg-white/[0.07] text-white/70 hover:bg-white/[0.1]"
                    }`}
                  >
                    More direct
                  </button>
                </div>

                <button
                  onClick={() => setSelectedId(variant.variant_id)}
                  className={`h-11 rounded-xl text-xs font-black transition ${
                    selected
                      ? "bg-[#070816] text-[#d9ff3f]"
                      : "bg-[#d9ff3f] text-[#070816]"
                  }`}
                >
                  {selected ? "Selected" : "Choose"}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <WizardFooter>
        <Link
          href="/dashboard/campaigns/new/angles"
          className="wizard-secondary-btn"
        >
          <ArrowLeft size={17} />
          Back
        </Link>

        <button
          onClick={continueNext}
          disabled={!selectedId || isSaving}
          className="wizard-primary-btn disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSaving ? "Saving..." : "Review"}
          <ArrowRight size={17} />
        </button>
      </WizardFooter>
    </WizardFrame>
  )
}

export function CampaignReviewStep() {
  const router = useRouter()

  const [draft, setDraft] = useState<CampaignDraft | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    async function loadDraft() {
      const draftId = getCampaignDraftId()

      if (!draftId) {
        router.push("/dashboard/campaigns/new")
        return
      }

      const data = await getCampaignDraft(draftId)
      setDraft(data)
    }

    loadDraft()
  }, [router])

 async function generateCampaign() {
  if (!draft) return

  setIsGenerating(true)

  try {
    const result = await generateFinalCampaign(draft.id)

    clearCampaignDraftId()

    router.push(`/dashboard/campaigns/${result.output.id}`)
  } finally {
    setIsGenerating(false)
  }
}

  function startOver() {
    clearCampaignDraftId()
    router.push("/dashboard/campaigns/new")
  }

  if (!draft) {
    return <WizardLoading />
  }

  return (
    <WizardFrame
      step="05"
      title="Review"
      subtitle="Check the selected direction."
    >
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <ProductPreview image={draft.productImageUrl || ""} />

        <div className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <SummaryItem label="Product" value={draft.productName || "—"} />
            <SummaryItem label="Category" value={draft.category || "—"} />
            <SummaryItem label="Price / offer" value={draft.priceOffer || "—"} />
            <SummaryItem label="Angle" value={draft.selectedAngleTitle || "—"} />
            <SummaryItem
              label="Variant"
              value={draft.selectedVariantName || "—"}
            />
            <SummaryItem label="Action" value={draft.buyerAction || "—"} />
          </div>

          <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.055] p-4">
            <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-white/38">
              Direction
            </p>

            <p className="mt-2 text-sm font-bold leading-6 text-white/65">
              {draft.selectedVariantVisual || "No variant selected."}
            </p>
          </div>
        </div>
      </div>

      <WizardFooter>
        <button onClick={startOver} className="wizard-secondary-btn">
          Start over
        </button>

        <button
          onClick={generateCampaign}
          disabled={isGenerating}
          className="wizard-primary-btn disabled:cursor-wait disabled:opacity-50"
        >
          <Wand2 size={17} />
          {isGenerating ? "Generating..." : "Generate"}
        </button>
      </WizardFooter>
    </WizardFrame>
  )
}

function WizardFrame({
  step,
  title,
  subtitle,
  children,
}: {
  step: string
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <div className="mx-auto max-w-[1120px] space-y-4">
      <div>
        <p className="text-[0.62rem] font-black uppercase tracking-[0.26em] text-orange-300">
          Step {step}
        </p>

        <h1 className="mt-1 text-3xl font-black tracking-[-0.07em] text-white md:text-4xl">
          {title}
        </h1>

        <p className="mt-2 text-sm font-bold text-white/45">{subtitle}</p>
      </div>

      {children}
    </div>
  )
}

function WizardFooter({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-[1.2rem] border border-white/10 bg-[#0d0d13]/90 p-3">
      {children}
    </div>
  )
}

function Field({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="mb-2 block text-[0.62rem] font-black uppercase tracking-[0.2em] text-white/38">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.055] px-4 text-sm font-bold text-white outline-none placeholder:text-white/25 focus:border-[#d9ff3f]/45"
      />
    </div>
  )
}

function ProductPreview({ image }: { image?: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <p className="mb-3 text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
        Product
      </p>

      <div className="grid min-h-[280px] place-items-center overflow-hidden rounded-xl bg-white/[0.045]">
        {image ? (
          <img
            src={image}
            alt="Product preview"
            className="max-h-[260px] w-full object-contain"
          />
        ) : (
          <Camera size={32} className="text-white/25" />
        )}
      </div>
    </div>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.055] p-4">
      <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-sm font-black text-white">{value}</p>
    </div>
  )
}

function VariantDetailBlock({
  selected,
  label,
  value,
}: {
  selected: boolean
  label: string
  value: string
}) {
  return (
    <div
      className={`mt-3 rounded-xl border p-3 ${
        selected
          ? "border-[#070816]/10 bg-[#070816]/10"
          : "border-white/10 bg-white/[0.045]"
      }`}
    >
      <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] opacity-60">
        {label}
      </p>

      <p className="mt-2 text-xs font-bold leading-5 opacity-80">{value}</p>
    </div>
  )
}
function WizardLoading() {
  return (
    <div className="mx-auto max-w-[1120px] rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-8 text-white">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-300">
        Loading...
      </p>
    </div>
  )
}
