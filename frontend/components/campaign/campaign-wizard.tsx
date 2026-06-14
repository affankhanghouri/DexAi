"use client"

import { PremiumFinalReview } from "@/components/campaign/premium-final-review"
import {
  PremiumVariantCarousel,
  type PremiumVariantCardData,
} from "@/components/campaign/premium-variant-carousel"
import {
  CampaignWizardFrame,
  PremiumInputWrap,
  WizardCard,
  WizardPrimaryButton,
  WizardSectionTitle,
} from "@/components/campaign/campaign-wizard-frame"
import {
  PremiumAngleCards,
  type PremiumAngleCardData,
} from "@/components/campaign/premium-angle-cards"
import { ProductDNAReveal } from "@/components/campaign/product-dna-reveal"
import { ProductUploadScanner } from "@/components/campaign/product-upload-scanner"
import {
  clearBrandProfileId,
  getBrandProfileId,
} from "@/lib/brand-profile-session"
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
  FileText,
  Gift,
  Globe,
  Layers3,
  Lock,
  Sparkles,
  Zap,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
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

function createPremiumAngleOptions(draft: CampaignDraft): PremiumAngleCardData[] {
  return createAngleOptions(draft).map((angle, index) => ({
    angle_id: angle.id,
    title: angle.title,
    description: angle.description,
    why_it_works: angle.reason,
    buyer_trigger: getBuyerTriggerForAngle(angle.id),
    recommended_for: getRecommendedUseForAngle(angle.id),
    confidence: [0.86, 0.8, 0.82, 0.78][index] || 0.75,
  }))
}

function getBuyerTriggerForAngle(angleId: string) {
  const triggers: Record<string, string> = {
    "premium-look": "Aspiration, quality perception, gift-worthiness, and polished product presentation.",
    "comfort-use": "Daily usefulness, easy fit into routine, and practical buyer confidence.",
    "offer-push": "Urgency, value clarity, and fast WhatsApp ordering behavior.",
    "trust-delivery": "Reliability, risk reduction, and reassurance before purchase.",
  }

  return triggers[angleId] || "Clear buyer motivation connected to the product and brand context."
}

function getRecommendedUseForAngle(angleId: string) {
  const recommendations: Record<string, string> = {
    "premium-look": "Products with strong visuals, clean styling, premium details, or gifting potential.",
    "comfort-use": "Products where everyday practicality, comfort, or repeated use is the strongest reason to buy.",
    "offer-push": "Campaigns built around price, limited-time offers, new arrivals, or fast order conversion.",
    "trust-delivery": "Products where buyers may need proof around quality, sizing, delivery, or seller reliability.",
  }

  return recommendations[angleId] || "Products that need a focused, seller-ready campaign story."
}

export function CampaignUploadStep() {
  const router = useRouter()

  const [isUploading, setIsUploading] = useState(false)
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
        if (!brand) {
          clearBrandProfileId()
          setActiveBrand(null)
          return
        }
        setActiveBrand(brand)
      } catch {
        setActiveBrand(null)
      } finally {
        setIsCheckingBrand(false)
      }
    }

    checkBrand()
  }, [])

  async function handleProductUpload(file: File) {
    setIsUploading(true)

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

      router.push("/dashboard/campaigns/new/details")
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Image upload failed.",
      )
    } finally {
      setIsUploading(false)
    }
  }

  if (isCheckingBrand) {
    return <WizardLoading />
  }

  if (!activeBrand) {
    return (
      <CampaignWizardFrame
        step="upload"
        eyebrow="Brand required"
        title="Brand DNA comes first."
        subtitle="Dhoom needs an active brand so campaigns stay aligned with the store, tone, and Pakistani buyer context."
      >
        <WizardCard className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-orange-500/10 text-orange-200">
            <Globe size={26} />
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-[-0.07em] text-white">
            Setup Brand DNA first
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm font-bold leading-6 text-white/45">
            One public link is enough. Dhoom will reconstruct the brand
            workspace.
          </p>

          <Link
            href="/dashboard/brand-dna"
            className="mt-5 inline-flex wizard-primary-btn"
          >
            Setup Brand DNA
          </Link>
        </WizardCard>
      </CampaignWizardFrame>
    )
  }

  return (
    <CampaignWizardFrame
      step="upload"
      eyebrow="Campaign builder"
      title="Start with your product."
      subtitle="Upload one product image. Dhoom will lock it into the campaign pipeline and prepare Product DNA next."
      isProcessing={isUploading}
      processingTitle="Locking product"
      processingText="Dhoom is saving the product image and creating the campaign draft."
    >
      <WizardSectionTitle
        eyebrow="Product scanner"
        title="Upload the product hero"
        subtitle="This product image becomes the visual anchor for campaign strategy, poster direction, and creative assets."
      />

      <WizardCard className="mb-4">
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
      </WizardCard>

      <ProductUploadScanner
        isProcessing={isUploading}
        onProductLocked={handleProductUpload}
      />
    </CampaignWizardFrame>
  )
}

export function CampaignDetailsStep() {
  const router = useRouter()

  const [draft, setDraft] = useState<CampaignDraft | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [analysisError, setAnalysisError] = useState("")
  const [showProductDNAReveal, setShowProductDNAReveal] = useState(false)
  const [revealedDraftId, setRevealedDraftId] = useState<string | null>(null)

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

      setRevealedDraftId(draft.id)
      setShowProductDNAReveal(true)
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
    <>
      <CampaignWizardFrame
        step="details"
        eyebrow="Product DNA"
        title="Tell Dhoom what matters."
        subtitle="Give simple product details. Dhoom will turn them into buyer reasons, objections, positioning, and campaign rules."
        isProcessing={isSaving}
        processingTitle="Building Product DNA"
        processingText="Dhoom is reading the product image, buyer reasons, objections, and campaign positioning."
        sidePanel={
          <div className="space-y-4">
            <div className="rounded-[1.4rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
                <Lock size={22} />
              </div>

              <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
                Product locked
              </p>

              <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-white">
                Ready for Product DNA
              </h3>

              <p className="mt-2 text-sm font-bold leading-6 text-white/52">
                Dhoom will combine this product with Brand DNA to create strong
                campaign angles.
              </p>
            </div>
          </div>
        }
      >
        <WizardSectionTitle
          eyebrow="Product details"
          title="Simple inputs, stronger output"
          subtitle="No marketing essay needed. Just product name, category, price/offer, and a few notes."
        />

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <WizardCard>
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
              <PremiumInputWrap icon={<FileText size={16} />} label="Notes">
                <textarea
                  value={draft.notes || ""}
                  onChange={(event) => updateField("notes", event.target.value)}
                  placeholder="Any product detail, delivery note, size info, or buyer concern..."
                  rows={4}
                  className="w-full resize-none bg-transparent py-3 text-sm font-bold text-white outline-none placeholder:text-white/28"
                />
              </PremiumInputWrap>
            </div>

            {analysisError && (
              <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
                {analysisError}
              </p>
            )}
          </WizardCard>

          <ProductPreview image={draft.productImageUrl || ""} />
        </div>

        <WizardFooter>
          <Link href="/dashboard/campaigns/new" className="wizard-secondary-btn">
            <ArrowLeft size={17} />
            Back
          </Link>

          <WizardPrimaryButton onClick={continueNext} disabled={isSaving}>
            <Sparkles size={17} />
            {isSaving ? "Understanding product..." : "Continue"}
            <ArrowRight size={17} />
          </WizardPrimaryButton>
        </WizardFooter>
      </CampaignWizardFrame>

      {showProductDNAReveal && revealedDraftId && (
        <ProductDNAReveal
          draftId={revealedDraftId}
          onContinue={() => {
            setShowProductDNAReveal(false)
            router.push("/dashboard/campaigns/new/angles")
          }}
          onClose={() => {
            setShowProductDNAReveal(false)
          }}
        />
      )}
    </>
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

  async function handleSelectAngle(angle: PremiumAngleCardData) {
    if (!draft || isSaving) return

    setSelectedId(angle.angle_id)
    setIsSaving(true)

    try {
      await updateCampaignDraft(draft.id, {
        selectedAngleId: angle.angle_id,
        selectedAngleTitle: angle.title,
        selectedAngleDescription: angle.description,
        selectedAngleReason: angle.why_it_works,
      })

      router.push("/dashboard/campaigns/new/variants")
    } finally {
      setIsSaving(false)
    }
  }

  if (!draft) {
    return <WizardLoading />
  }

  const angles = createPremiumAngleOptions(draft)

  return (
    <CampaignWizardFrame
      step="angles"
      eyebrow="Smart angle cards"
      title="Choose the campaign story."
      subtitle="Dhoom generated strategic campaign directions. Pick the one that fits the product and brand mood today."
      isProcessing={isSaving}
      processingTitle="Locking campaign direction"
      processingText="Dhoom is saving this campaign story and preparing creative variants."
      sidePanel={<AngleIntelligencePanel />}
    >
      <WizardSectionTitle
        eyebrow="Campaign angles"
        title="Select one direction"
        subtitle="This is not random copy. Each angle is a different way to make the product desirable."
      />

      <PremiumAngleCards
        angles={angles}
        selectedAngleId={selectedId}
        isSelecting={isSaving}
        onSelect={handleSelectAngle}
      />

      <WizardFooter>
        <Link
          href="/dashboard/campaigns/new/details"
          className="wizard-secondary-btn"
        >
          <ArrowLeft size={17} />
          Back
        </Link>
      </WizardFooter>
    </CampaignWizardFrame>
  )
}

export function CampaignVariantsStep() {
  const router = useRouter()

  const [draft, setDraft] = useState<CampaignDraft | null>(null)
  const [variants, setVariants] = useState<GeneratedCampaignVariant[]>([])
  const [selectedVariantId, setSelectedVariantId] = useState("")
  const [isGenerating, setIsGenerating] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isRefining, setIsRefining] = useState(false)
  const [refiningVariantId, setRefiningVariantId] = useState("")
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
        setSelectedVariantId(draftData.selectedVariantId || "")

        const generated = await generateCampaignVariants(draftId)
        setVariants(generated.variants)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not generate variants.",
        )
      } finally {
        setIsGenerating(false)
      }
    }

    loadAndGenerateVariants()
  }, [router])

  async function handleSelectVariant(variant: PremiumVariantCardData) {
    if (!draft) return

    setSelectedVariantId(variant.variant_id)
    setIsSaving(true)

    try {
      await updateCampaignDraft(draft.id, {
        selectedVariantId: variant.variant_id,
        selectedVariantName: variant.name,
        selectedVariantDescription: variant.description,
        selectedVariantVisual: variant.visual_direction,
        selectedVariantCaptionStyle: variant.caption_style,
      })

      router.push("/dashboard/campaigns/new/review")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleRefineVariant(variantId: string, instruction: string) {
    if (!draft) return

    setRefiningVariantId(variantId)
    setIsRefining(true)
    setError("")

    try {
      const result = await refineCampaignVariant({
        draftId: draft.id,
        variantId,
        refineInstruction: instruction,
      })

      setVariants((current) =>
        current.map((variant) =>
          variant.variant_id === result.variant.variant_id
            ? result.variant
            : variant,
        ),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not refine variant.")
    } finally {
      setIsRefining(false)
      setRefiningVariantId("")
    }
  }

  if (isGenerating) {
    return (
      <CampaignWizardFrame
        step="variants"
        eyebrow="Variant carousel"
        title="Pick the creative vibe."
        subtitle="Dhoom prepared different execution styles so you can choose instead of designing from scratch."
        isProcessing={isGenerating || isSaving}
        processingTitle={
          isSaving ? "Locking creative vibe" : "Generating creative variants"
        }
        processingText={
          isSaving
            ? "Dhoom is saving this variant and preparing your final campaign pack."
            : "Dhoom is preparing visual direction, caption style, WhatsApp style, and poster layout."
        }
        sidePanel={<VariantIntelligencePanel />}
      >
        <VariantGenerationLoading />
      </CampaignWizardFrame>
    )
  }

  if (!draft) {
    return <WizardLoading />
  }

  return (
    <CampaignWizardFrame
      step="variants"
      eyebrow="Variant carousel"
      title="Pick the creative vibe."
      subtitle="Dhoom prepared different execution styles so you can choose instead of designing from scratch."
      isProcessing={isGenerating || isSaving}
      processingTitle={
        isSaving ? "Locking creative vibe" : "Generating creative variants"
      }
      processingText={
        isSaving
          ? "Dhoom is saving this variant and preparing your final campaign pack."
          : "Dhoom is preparing visual direction, caption style, WhatsApp style, and poster layout."
      }
      sidePanel={<VariantIntelligencePanel />}
    >
      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
          {error}
        </p>
      )}

      <PremiumVariantCarousel
        variants={variants as PremiumVariantCardData[]}
        selectedVariantId={selectedVariantId}
        isSelecting={isSaving}
        isRefining={isRefining}
        refiningVariantId={refiningVariantId}
        onSelect={handleSelectVariant}
        onRefine={handleRefineVariant}
      />

      <WizardFooter>
        <Link
          href="/dashboard/campaigns/new/angles"
          className="wizard-secondary-btn"
        >
          <ArrowLeft size={17} />
          Back
        </Link>
      </WizardFooter>
    </CampaignWizardFrame>
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

  async function handleGenerateFinal() {
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

  if (!draft) {
    return <WizardLoading />
  }

  return (
    <CampaignWizardFrame
      step="review"
      eyebrow="Final campaign"
      title="Review the campaign setup."
      subtitle="Dhoom has the product, angle, and creative vibe. Now it can generate the ready-to-post campaign pack."
      isProcessing={isGenerating}
      processingTitle="Preparing final campaign"
      processingText="Dhoom is generating, quality-checking, polishing, and packaging your campaign."
    >
      <PremiumFinalReview
        draftId={draft.id}
        isGenerating={isGenerating}
        onGenerate={handleGenerateFinal}
      />
    </CampaignWizardFrame>
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
    <PremiumInputWrap icon={<FileText size={16} />} label={label}>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/28"
      />
    </PremiumInputWrap>
  )
}

function ProductPreview({ image }: { image?: string }) {
  return (
    <WizardCard>
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
    </WizardCard>
  )
}

function AngleIntelligencePanel() {
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[1.4rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(217,255,63,0.16),transparent_45%)]" />

        <div className="relative z-10">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
            <Sparkles size={22} />
          </div>

          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
            Angle intelligence
          </p>

          <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-white">
            Choose the campaign story.
          </h3>

          <p className="mt-2 text-sm font-bold leading-6 text-white/52">
            The angle decides what buyer motivation Dhoom should build the
            campaign around.
          </p>
        </div>
      </div>

      <div className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4">
        <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
          Best fit guide
        </p>

        <div className="mt-4 grid gap-3">
          <AngleTip
            icon={<Sparkles size={15} />}
            title="Premium Look"
            text="Use when quality, gifting, or polished presentation should lead."
          />

          <AngleTip
            icon={<Gift size={15} />}
            title="Daily Use"
            text="Use when practical value and regular buyer habits matter most."
          />

          <AngleTip
            icon={<BadgePercent size={15} />}
            title="Offer Push"
            text="Use when price, urgency, or quick WhatsApp orders should lead."
          />

          <AngleTip
            icon={<Zap size={15} />}
            title="Trust + Delivery"
            text="Use when buyers need reassurance before placing an order."
          />
        </div>
      </div>
    </div>
  )
}

function AngleTip({
  icon,
  title,
  text,
}: {
  icon: ReactNode
  title: string
  text: string
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#d9ff3f] text-[#070816]">
        {icon}
      </div>

      <div>
        <p className="text-sm font-black text-white">{title}</p>
        <p className="mt-1 text-xs font-bold leading-5 text-white/42">{text}</p>
      </div>
    </div>
  )
}

function VariantIntelligencePanel() {
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[1.4rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(217,255,63,0.16),transparent_45%)]" />

        <div className="relative z-10">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
            <Layers3 size={22} />
          </div>

          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
            Variant intelligence
          </p>

          <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-white">
            Choose the vibe, not every pixel.
          </h3>

          <p className="mt-2 text-sm font-bold leading-6 text-white/52">
            Dhoom gives you professional creative directions. You only choose
            what matches your brand today.
          </p>
        </div>
      </div>

      <div className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4">
        <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
          How to choose
        </p>

        <div className="mt-4 grid gap-3">
          <VariantTip
            title="Minimal / Premium"
            text="Best for elegant products, cleaner brands, and higher perceived value."
          />

          <VariantTip
            title="Bold / Sales Ad"
            text="Best for offers, fast attention, and products with a strong value hook."
          />

          <VariantTip
            title="Story / Lifestyle"
            text="Best when the buyer needs to imagine using the product in real life."
          />
        </div>
      </div>

      <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.045] p-4">
        <p className="text-sm font-black leading-6 text-white/62">
          You can refine the creative vibe before selecting it.
        </p>
      </div>
    </div>
  )
}

function VariantTip({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
      <p className="text-sm font-black text-white">{title}</p>
      <p className="mt-1 text-xs font-bold leading-5 text-white/42">{text}</p>
    </div>
  )
}

function VariantGenerationLoading() {
  return (
    <div className="grid min-h-[420px] place-items-center rounded-[1.5rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-6 text-center">
      <div>
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.08, 1],
          }}
          transition={{
            rotate: { duration: 2.4, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.2, repeat: Infinity },
          }}
          className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]"
        >
          <Layers3 size={28} />
        </motion.div>

        <h2 className="mt-5 text-4xl font-black tracking-[-0.08em] text-white">
          Creating Creative Variants...
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm font-bold leading-7 text-white/52">
          Dhoom is preparing different visual directions, caption styles, and
          WhatsApp styles for this campaign.
        </p>

        <div className="mx-auto mt-6 h-2 max-w-sm overflow-hidden rounded-full bg-white/[0.08]">
          <motion.div
            animate={{ x: ["-100%", "260%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="h-full w-1/3 rounded-full bg-gradient-to-r from-orange-500 to-[#d9ff3f]"
          />
        </div>
      </div>
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
