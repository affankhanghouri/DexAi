"use client"

import {
  BadgePercent,
  Camera,
  Check,
  Gift,
  Megaphone,
  Sparkles,
  Upload,
  Wand2,
  Zap,
} from "lucide-react"
import { useState } from "react"

const moments = [
  {
    id: "launch",
    title: "Launch",
    icon: Megaphone,
  },
  {
    id: "eid",
    title: "Eid / Festive",
    icon: Gift,
  },
  {
    id: "offer",
    title: "Offer",
    icon: BadgePercent,
  },
  {
    id: "weekend",
    title: "Weekend",
    icon: Zap,
  },
]

const outputs = [
  "Campaign angle",
  "Caption",
  "WhatsApp copy",
  "Offer idea",
  "Story flow",
  "Poster direction",
]

export function NewCampaignBuilder() {
  const [selectedMoment, setSelectedMoment] = useState("launch")

  return (
    <div className="mx-auto max-w-[1180px] space-y-4">
      {/* SIMPLE PAGE HEADER */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-[-0.07em] text-white md:text-4xl">
            Create campaign
          </h1>
          <p className="mt-2 text-sm font-bold text-white/45">
            Add product details, choose moment, generate output.
          </p>
        </div>

        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-[#d9ff3f] px-5 text-sm font-black text-[#070816] transition hover:scale-[1.02]">
          <Wand2 size={17} />
          Generate
        </button>
      </div>

      <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
        {/* LEFT SIDE */}
        <div className="space-y-4">
          {/* PRODUCT PHOTO */}
          <Card>
            <CardHeader
              step="01"
              title="Product photo"
              icon={<Upload size={18} />}
            />

            <div className="grid gap-4 md:grid-cols-[260px_1fr]">
              <div className="group grid min-h-[260px] place-items-center rounded-2xl border border-dashed border-white/15 bg-white/[0.045] p-4 text-center transition hover:border-[#d9ff3f]/45 hover:bg-white/[0.065]">
                <div>
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.08] text-white/65">
                    <Camera size={23} />
                  </div>

                  <p className="mt-4 text-sm font-black text-white">
                    Upload image
                  </p>

                  <p className="mt-2 text-xs font-bold leading-5 text-white/38">
                    Product photo or catalogue image
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                <Field label="Product name" placeholder="Black embroidered suit" />
                <Field label="Category" placeholder="Fashion, food, shoes..." />
                <Field label="Price / offer" placeholder="Rs. 2,999 / 20% off" />
              </div>
            </div>
          </Card>

          {/* PRODUCT NOTES */}
          <Card>
            <CardHeader
              step="02"
              title="Product details"
              icon={<Sparkles size={18} />}
            />

            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Target buyer" placeholder="Girls, moms, office buyers..." />
              <Field label="Buyer action" placeholder="Order on WhatsApp" />
            </div>

            <div className="mt-3">
              <label className="mb-2 block text-[0.62rem] font-black uppercase tracking-[0.2em] text-white/38">
                Notes
              </label>
              <textarea
                placeholder="Fabric, quality, delivery, size, taste, material, what makes it special..."
                className="min-h-[105px] w-full resize-none rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/25 focus:border-[#d9ff3f]/45"
              />
            </div>
          </Card>
        </div>

        {/* RIGHT SIDE */}
        <aside className="space-y-4 xl:sticky xl:top-[88px] xl:h-fit">
          {/* MOMENT */}
          <Card>
            <CardHeader step="03" title="Moment" icon={<Megaphone size={18} />} />

            <div className="grid grid-cols-2 gap-2">
              {moments.map((moment) => {
                const Icon = moment.icon
                const active = selectedMoment === moment.id

                return (
                  <button
                    key={moment.id}
                    onClick={() => setSelectedMoment(moment.id)}
                    className={`rounded-xl border p-3 text-left transition ${
                      active
                        ? "border-[#d9ff3f]/50 bg-[#d9ff3f] text-[#070816]"
                        : "border-white/10 bg-white/[0.055] text-white hover:border-orange-400/35"
                    }`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <Icon size={17} />
                      {active && <Check size={16} />}
                    </div>

                    <p className="text-sm font-black leading-none">
                      {moment.title}
                    </p>
                  </button>
                )
              })}
            </div>
          </Card>

          {/* OUTPUT */}
          <Card>
            <CardHeader
              step="04"
              title="Output"
              icon={<Wand2 size={18} />}
            />

            <div className="grid gap-2">
              {outputs.map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.055] px-3 py-3"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[#d9ff3f] text-[0.68rem] font-black text-[#070816]">
                    {index + 1}
                  </span>

                  <span className="text-sm font-black text-white/70">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <button className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-[#d9ff3f] text-sm font-black text-[#070816] transition hover:scale-[1.02]">
              <Wand2 size={17} />
              Generate campaign
            </button>
          </Card>
        </aside>
      </section>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-[#0d0d13]/90 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.26)]">
      {children}
    </div>
  )
}

function CardHeader({
  step,
  title,
  icon,
}: {
  step: string
  title: string
  icon: React.ReactNode
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <p className="text-[0.58rem] font-black uppercase tracking-[0.22em] text-orange-300">
          Step {step}
        </p>
        <h2 className="mt-1 text-xl font-black tracking-[-0.055em] text-white">
          {title}
        </h2>
      </div>

      <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#d9ff3f] text-[#070816]">
        {icon}
      </div>
    </div>
  )
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="mb-2 block text-[0.62rem] font-black uppercase tracking-[0.2em] text-white/38">
        {label}
      </label>
      <input
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.055] px-4 text-sm font-bold text-white outline-none placeholder:text-white/25 focus:border-[#d9ff3f]/45"
      />
    </div>
  )
}