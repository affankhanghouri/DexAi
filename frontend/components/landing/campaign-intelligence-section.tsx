import {
  Bot,
  ChartNoAxesCombined,
  FingerprintPattern,
  UsersRound,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

const intelligenceCards = [
  {
    icon: UsersRound,
    title: "Tailored for Pakistani audiences",
    text: "Dhoom understands local buying moments, Urdu-English selling language, Eid drops, WhatsApp habits, and the way small sellers actually move product.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Optimal marketing direction",
    text: "Before creating visuals, Dhoom chooses the angle, audience, offer, urgency, and platform logic that gives the product a reason to sell.",
  },
  {
    icon: Bot,
    title: "AI campaign agents",
    text: "Specialized agents think through product DNA, buyer psychology, captions, ad variants, creative briefs, and ready-to-launch output.",
  },
  {
    icon: FingerprintPattern,
    title: "Brand Identity / DNA",
    text: "Your tone, category, visual style, audience, and campaign memory stay consistent so the next ad feels like your brand, not random AI.",
  },
]

export function CampaignIntelligenceSection() {
  return (
    <section className="dhoom-reveal relative overflow-hidden bg-[#080814] px-4 py-16 text-white md:px-10 md:py-22 lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(217,255,63,0.14),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(236,72,153,0.18),transparent_34%),radial-gradient(circle_at_50%_95%,rgba(20,184,166,0.16),transparent_38%),linear-gradient(180deg,#080814_0%,#12061f_48%,#050611_100%)]" />
      <div className="intelligence-grid absolute inset-0 opacity-25" />
      <div className="absolute left-1/2 top-8 h-64 w-64 -translate-x-1/2 rounded-full bg-[#d9ff3f]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1180px]">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="mb-4 w-fit rounded-full border border-[#d4af37]/50 bg-white/5 px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.28em] text-[#d4af37]">
              Campaign intelligence layer
            </p>

            <h2 className="dhoom-luxe-heading max-w-[680px] text-[clamp(2.8rem,5.3vw,5.8rem)]">
              Not just ads.
              <br />
              <span>Market instinct.</span>
            </h2>
          </div>

          <p className="max-w-[620px] text-base font-bold leading-8 text-white/62 lg:pb-2">
            Dhoom is built for sellers who need more than pretty posts. It
            reads the product, the buyer, the brand, and the moment before it
            generates anything.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {intelligenceCards.map((card, index) => (
            <IntelligenceCard key={card.title} card={card} index={index} />
          ))}
        </div>

        <div className="mt-5 overflow-hidden rounded-full border border-white/10 bg-white/[0.045] py-2.5 backdrop-blur-xl">
          <div className="intelligence-ticker flex w-max gap-3">
            {[
              "Local buyer behavior",
              "Brand tone memory",
              "Offer timing",
              "Product DNA",
              "Platform logic",
              "Campaign clarity",
              "Local buyer behavior",
              "Brand tone memory",
              "Offer timing",
              "Product DNA",
              "Platform logic",
              "Campaign clarity",
            ].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="rounded-full bg-white/[0.08] px-4 py-1.5 text-[0.66rem] font-black uppercase tracking-[0.18em] text-white/68"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .intelligence-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: radial-gradient(circle at 50% 35%, black, transparent 72%);
        }

        .intelligence-ticker {
          animation: intelligenceTicker 34s linear infinite;
          padding-left: 1rem;
        }

        @keyframes intelligenceTicker {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}

function IntelligenceCard({
  card,
  index,
}: {
  card: {
    icon: LucideIcon
    title: string
    text: string
  }
  index: number
}) {
  const Icon = card.icon

  return (
    <article
      className="group relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_26px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-[#d9ff3f]/35 hover:bg-white/[0.075] md:p-6"
      style={{ animationDelay: `${index * 110}ms` }}
    >
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#d9ff3f]/0 blur-3xl transition duration-500 group-hover:bg-[#d9ff3f]/14" />

      <div className="relative z-10 flex gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#d9ff3f]/25 bg-[#d9ff3f]/12 text-[#d9ff3f] transition duration-300 group-hover:bg-[#d9ff3f] group-hover:text-[#070816]">
          <Icon size={21} strokeWidth={2.4} />
        </div>

        <div>
          <h3 className="dhoom-card-title text-[clamp(1.45rem,2.1vw,2.1rem)]">
            {card.title}
          </h3>
          <p className="mt-3 text-sm font-bold leading-7 text-white/58">
            {card.text}
          </p>
        </div>
      </div>
    </article>
  )
}
