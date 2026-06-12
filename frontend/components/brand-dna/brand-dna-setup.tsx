"use client"

import { ZeroFormBrandIntake } from "@/components/brand-dna/zero-form-brand-intake"
import { getAllBrandProfiles, type BrandProfile } from "@/lib/brand-profile"
import {
  getBrandProfileId,
  saveBrandProfileId,
} from "@/lib/brand-profile-session"
import {
  ArrowRight,
  Check,
  Globe,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

export function BrandDnaSetup() {
  const [brands, setBrands] = useState<BrandProfile[]>([])
  const [activeBrandId, setActiveBrandId] = useState<string | null>(null)
  const [isFetchingBrands, setIsFetchingBrands] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const activeBrand = useMemo(() => {
    return brands.find((brand) => brand.id === activeBrandId) || null
  }, [brands, activeBrandId])

  useEffect(() => {
    async function loadBrands() {
      setIsFetchingBrands(true)

      try {
        const savedActiveId = getBrandProfileId()
        setActiveBrandId(savedActiveId)

        const data = await getAllBrandProfiles()
        setBrands(data)

        if (!savedActiveId && data.length > 0) {
          setActiveBrand(data[0])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsFetchingBrands(false)
      }
    }

    loadBrands()
  }, [refreshKey])

  function setActiveBrand(brand: BrandProfile) {
    saveBrandProfileId(brand.id)
    setActiveBrandId(brand.id)
  }

  return (
    <div className="mx-auto max-w-[1120px] space-y-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-[-0.07em] text-white md:text-4xl">
            Brand Workspace
          </h1>
          <p className="mt-2 text-sm font-bold text-white/45">
            Choose the brand brain Dhoom should use for campaigns.
          </p>
        </div>

        {activeBrand && (
          <Link href="/dashboard/campaigns/new" className="wizard-primary-btn">
            Create campaign
            <ArrowRight size={17} />
          </Link>
        )}
      </div>

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <ActiveBrandPanel brand={activeBrand} />

          <ZeroFormBrandIntake
            onBrandReady={() => {
              setRefreshKey((current) => current + 1)
            }}
          />
        </div>

        <aside className="space-y-4">
          <section className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
                  Saved brands
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.06em] text-white">
                  Brand profiles
                </h2>
              </div>

              <span className="rounded-full bg-white/[0.06] px-3 py-2 text-xs font-black text-white/55">
                {brands.length}
              </span>
            </div>

            {isFetchingBrands ? (
              <p className="rounded-xl border border-white/10 bg-white/[0.045] px-4 py-4 text-sm font-bold text-white/45">
                Loading brands...
              </p>
            ) : brands.length === 0 ? (
              <EmptyBrandState />
            ) : (
              <div className="grid gap-3">
                {brands.map((brand) => (
                  <BrandProfileCard
                    key={brand.id}
                    brand={brand}
                    active={brand.id === activeBrandId}
                    onSetActive={() => setActiveBrand(brand)}
                  />
                ))}
              </div>
            )}
          </section>
        </aside>
      </section>
    </div>
  )
}

function ActiveBrandPanel({ brand }: { brand: BrandProfile | null }) {
  if (!brand) {
    return (
      <div className="rounded-[1.4rem] border border-orange-400/25 bg-orange-500/10 p-4">
        <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
          No active brand
        </p>

        <h2 className="mt-2 text-3xl font-black tracking-[-0.07em] text-white">
          Setup Brand DNA first
        </h2>

        <p className="mt-2 max-w-xl text-sm font-bold leading-6 text-white/55">
          Dhoom campaigns need an active brand brain so every angle, variant,
          caption, and poster direction follows the same identity.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4">
      <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
        Active Brand DNA
      </p>

      <div className="mt-3 flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <h2 className="text-3xl font-black tracking-[-0.07em] text-white">
            {brand.brandName || "Untitled brand"}
          </h2>

          <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-white/45">
            <span>{brand.category || "No category"}</span>
            <span>•</span>
            <span>{brand.pricePositioning || "No pricing"}</span>
            <span>•</span>
            <span>{Math.round((brand.confidence || 0) * 100)}% confidence</span>
          </div>

          <p className="mt-4 max-w-2xl text-sm font-bold leading-7 text-white/62">
            {brand.summary || "No summary available."}
          </p>
        </div>

        <Link href="/dashboard/campaigns/new" className="wizard-primary-btn">
          <Plus size={17} />
          New campaign
        </Link>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <MiniInfo label="Tone" value={brand.tone || "—"} />
        <MiniInfo label="Audience" value={brand.targetAudience || "—"} />
        <MiniInfo label="Visual style" value={brand.visualStyle || "—"} />
      </div>
    </div>
  )
}

function BrandProfileCard({
  brand,
  active,
  onSetActive,
}: {
  brand: BrandProfile
  active: boolean
  onSetActive: () => void
}) {
  return (
    <div
      className={`rounded-[1.2rem] border p-4 transition ${
        active
          ? "border-[#d9ff3f]/45 bg-[#d9ff3f]/10"
          : "border-white/10 bg-white/[0.045] hover:border-orange-400/30"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-black tracking-[-0.05em] text-white">
            {brand.brandName || "Untitled brand"}
          </h3>

          <p className="mt-1 truncate text-xs font-bold text-white/42">
            {brand.category || "No category"}
          </p>
        </div>

        {active && (
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#d9ff3f] text-[#070816]">
            <Check size={15} />
          </span>
        )}
      </div>

      <p className="mt-3 line-clamp-2 text-xs font-bold leading-5 text-white/48">
        {brand.summary || "No summary."}
      </p>

      <button
        onClick={onSetActive}
        className={`mt-4 h-10 w-full rounded-xl text-xs font-black transition ${
          active
            ? "bg-[#d9ff3f] text-[#070816]"
            : "bg-white/[0.07] text-white/70 hover:bg-white/[0.1]"
        }`}
      >
        {active ? "Active" : "Set active"}
      </button>
    </div>
  )
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.055] p-3">
      <p className="text-[0.56rem] font-black uppercase tracking-[0.18em] text-white/32">
        {label}
      </p>

      <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-white/62">
        {value}
      </p>
    </div>
  )
}

function EmptyBrandState() {
  return (
    <div className="rounded-[1.2rem] border border-dashed border-white/15 bg-white/[0.035] p-5 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.07] text-white/50">
        <Globe size={22} />
      </div>

      <h3 className="mt-4 text-xl font-black tracking-[-0.05em] text-white">
        No brands yet
      </h3>

      <p className="mt-2 text-sm font-bold leading-6 text-white/42">
        Analyze a store link to create your first Brand DNA.
      </p>
    </div>
  )
}
