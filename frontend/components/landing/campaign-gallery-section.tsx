"use client"

import { useEffect, useRef, useState } from "react"

const moments = [
  {
    badge: "SEASONAL DROP",
    title: "Seasonal demand",
    line: "Turn one outfit into a reason to buy now.",
    chips: ["Festive hook", "Urgency", "Poster direction"],
  },
  {
    badge: "FOOD PUSH",
    title: "Craving moment",
    line: "Make a normal food item feel instantly order-worthy.",
    chips: ["Craving angle", "Offer idea", "Message copy"],
  },
  {
    badge: "LAUNCH",
    title: "Product reveal",
    line: "Introduce new products with energy, story, and desire.",
    chips: ["Launch story", "Audience angle", "Caption hook"],
  },
  {
    badge: "GIFTING",
    title: "Gift appeal",
    line: "Turn simple items into emotional buying moments.",
    chips: ["Gift angle", "Buyer reason", "Story flow"],
  },
  {
    badge: "BEAUTY",
    title: "Result story",
    line: "Make beauty and lifestyle products feel believable.",
    chips: ["Benefit hook", "Trust angle", "Creative brief"],
  },
  {
    badge: "SALE MOMENT",
    title: "Offer energy",
    line: "Make discounts feel like a campaign, not a desperate sale.",
    chips: ["Offer frame", "Urgency", "Conversion copy"],
  },
]

export function CampaignGallerySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const scrolled = -rect.top

      setProgress(Math.max(0, Math.min(1, scrolled / total)))
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const translate = progress * -50

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[280vh] overflow-visible bg-[#fbf7ff]"
    >
      <div className="sticky top-0 flex min-h-screen flex-col justify-center overflow-hidden py-10 md:py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(212,175,55,0.12),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(168,85,247,0.12),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(20,184,166,0.1),transparent_38%)]" />

        <div className="relative z-10 mx-auto mb-7 max-w-[920px] px-5 text-center">
          <p className="mx-auto mb-3 w-fit rounded-full border border-purple-700/20 bg-purple-700/5 px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.3em] text-purple-700">
            DEX AI Moment Engine
          </p>

          <h2 className="moment-gallery-title dhoom-luxe-heading-dark text-[clamp(2.2rem,4vw,4.25rem)]">
            One product.
            <br />
            Many <span>DEX AI</span> moments.
          </h2>

          <p className="mx-auto mt-4 max-w-[560px] text-sm font-bold leading-6 text-slate-500 md:text-[0.95rem]">
            DEX AI finds the right campaign moment, the right selling angle, and
            the creative direction your product needs.
          </p>
        </div>

        <div className="relative z-10 pb-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 bg-gradient-to-r from-[#fbf7ff] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 bg-gradient-to-l from-[#fbf7ff] to-transparent" />

          <div
            className="flex w-max gap-5 px-6 will-change-transform md:px-16"
            style={{
              transform: `translateX(${translate}%)`,
            }}
          >
            {[...moments, ...moments].map((item, index) => (
              <MomentCard key={`${item.badge}-${index}`} item={item} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .moment-gallery-title {
          text-shadow:
            0 0 0 rgba(0, 0, 0, 0),
            0 20px 80px rgba(124, 58, 237, 0.10);
          animation: momentTitleEnter 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes momentTitleEnter {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.98);
            filter: blur(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
      `}</style>
    </section>
  )
}

function MomentCard({
  item,
}: {
  item: {
    badge: string
    title: string
    line: string
    chips: string[]
  }
}) {
  return (
    <article className="group relative h-[22rem] w-[19rem] shrink-0 overflow-hidden rounded-[2rem] border border-white/70 bg-[#070816] p-5 shadow-[0_28px_80px_rgba(15,23,42,0.18)] md:h-[23rem] md:w-[22rem]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(217,255,63,0.34),transparent_30%),radial-gradient(circle_at_88%_20%,rgba(236,72,153,0.38),transparent_34%),radial-gradient(circle_at_55%_100%,rgba(20,184,166,0.35),transparent_38%),linear-gradient(135deg,#070816,#3b0764_54%,#0f766e)]" />

      <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle,rgba(255,255,255,0.32)_0_1px,transparent_1.4px)] [background-size:28px_28px]" />

      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-pink-400/25 blur-3xl transition duration-700 group-hover:scale-125" />
      <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[#d9ff3f]/20 blur-3xl transition duration-700 group-hover:scale-125" />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <span className="inline-flex rounded-full bg-[#d9ff3f] px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#070816]">
            {item.badge}
          </span>

          <h3 className="dhoom-card-title mt-7 max-w-[19rem] text-[clamp(1.85rem,2.5vw,2.55rem)]">
            {item.title}
          </h3>

          <p className="mt-3 max-w-[18rem] text-[0.82rem] font-bold leading-6 text-white/62">
            {item.line}
          </p>
        </div>

        <div className="grid gap-2">
          {item.chips.map((chip) => (
            <div
              key={chip}
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-xs font-black text-white/85 backdrop-blur-xl"
            >
              <span className="h-2 w-2 rounded-full bg-[#d9ff3f]" />
              {chip}
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
