"use client"

import { Loader2, Sparkles, Wand2 } from "lucide-react"
import { useState } from "react"

type EnrichmentForm = {
  mostlySell: string
  usualBuyers: string
  productStrength: string
  brandTonePreference: string
  avoidPreference: string
}

const initialForm: EnrichmentForm = {
  mostlySell: "",
  usualBuyers: "",
  productStrength: "",
  brandTonePreference: "",
  avoidPreference: "",
}

export function BrandEnrichmentPanel({
  brandProfileId,
  onEnriched,
}: {
  brandProfileId: string
  onEnriched: () => void
}) {
  const [form, setForm] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const canSubmit = Object.values(form).every((value) => value.trim().length > 0)

  function updateField(key: keyof EnrichmentForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function submitEnrichment() {
    if (!canSubmit || isSubmitting) return

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    if (!backendUrl) {
      setError("Missing NEXT_PUBLIC_BACKEND_URL")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch(`${backendUrl}/api/v1/brand-dna/enrich`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brand_profile_id: brandProfileId,
          mostly_sell: form.mostlySell,
          usual_buyers: form.usualBuyers,
          product_strength: form.productStrength,
          brand_tone_preference: form.brandTonePreference,
          avoid_preference: form.avoidPreference,
        }),
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || "Could not enrich Brand DNA.")
      }

      setForm(initialForm)
      onEnriched()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not enrich Brand DNA.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(217,255,63,0.16),transparent_42%),linear-gradient(315deg,rgba(249,115,22,0.12),transparent_48%)]" />

      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
              Brand enrichment
            </p>

            <h3 className="mt-2 text-3xl font-black tracking-[-0.07em] text-white">
              Add seller context.
            </h3>

            <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-white/52">
              These answers help Dhoom improve the brand profile before campaign
              generation.
            </p>
          </div>

          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
            <Sparkles size={22} />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <EnrichmentField
            label="Mostly sell"
            value={form.mostlySell}
            placeholder="e.g. stitched formal suits and festive wear"
            onChange={(value) => updateField("mostlySell", value)}
          />

          <EnrichmentField
            label="Usual buyers"
            value={form.usualBuyers}
            placeholder="e.g. women buying for office, Eid, and family events"
            onChange={(value) => updateField("usualBuyers", value)}
          />

          <EnrichmentField
            label="Product strength"
            value={form.productStrength}
            placeholder="e.g. premium fabric, clean stitching, fast delivery"
            onChange={(value) => updateField("productStrength", value)}
          />

          <EnrichmentField
            label="Tone preference"
            value={form.brandTonePreference}
            placeholder="e.g. premium, warm, simple Urdu-English mix"
            onChange={(value) => updateField("brandTonePreference", value)}
          />
        </div>

        <div className="mt-3">
          <EnrichmentField
            label="Avoid"
            value={form.avoidPreference}
            placeholder="e.g. overpromising, cheap-looking copy, too much English"
            onChange={(value) => updateField("avoidPreference", value)}
          />
        </div>

        {error && (
          <p className="mt-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold leading-6 text-red-200">
            {error}
          </p>
        )}

        <button
          onClick={submitEnrichment}
          disabled={!canSubmit || isSubmitting}
          className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#d9ff3f] px-5 text-sm font-black text-[#070816] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 size={17} className="animate-spin" />
          ) : (
            <Wand2 size={17} />
          )}
          {isSubmitting ? "Enriching Brand DNA..." : "Enrich Brand DNA"}
        </button>
      </div>
    </section>
  )
}

function EnrichmentField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <span className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-orange-300">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/28"
      />
    </label>
  )
}
