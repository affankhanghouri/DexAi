import { AudiencePicker } from "@/components/brand-dna/audience-picker"
import { BrandSummaryCard } from "@/components/brand-dna/brand-summary-card"
import { BrandTonePicker } from "@/components/brand-dna/brand-tone-picker"

export function BrandDnaForm() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <form className="grid gap-4 rounded-lg border border-[#e3d7c7] bg-white p-5">
        <BrandTonePicker />
        <AudiencePicker />
      </form>
      <BrandSummaryCard />
    </div>
  )
}
