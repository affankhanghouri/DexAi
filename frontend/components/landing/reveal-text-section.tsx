import {
  Megaphone,
  MousePointerClick,
  Flame,
  UserCheck,
  ShoppingCart,
  PlayCircle,
  Video,
  Image,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

const channels = [
  {
    icon: Megaphone,
    title: "Facebook Ads",
    text: "Thumb-stopping feed, reel & story creatives — built to convert.",
  },
  {
    icon: Image,
    title: "Instagram Ads",
    text: "Polished visuals and captions that make people stop and shop.",
  },
  {
    icon: MousePointerClick,
    title: "Google Ads",
    text: "Search, display & shopping copy — all from a single product.",
  },
  {
    icon: Flame,
    title: "TikTok Ads",
    text: "Viral hooks and creator scripts made for the For You page.",
  },
  {
    icon: PlayCircle,
    title: "YouTube Ads",
    text: "Pre-roll and Shorts scripts that earn attention in 5 seconds.",
  },
  {
    icon: UserCheck,
    title: "UGC Creator Ads",
    text: "Authentic, creator-style angles that build instant trust.",
  },
  {
    icon: ShoppingCart,
    title: "Shopify Ads",
    text: "Catalog-ready ad sets for product launches, drops & offers.",
  },
  {
    icon: Video,
    title: "Instagram /  TikTok Reels",
    text: "Fast, native-feeling reels hooks that drive real engagement.",
  },
]

export function RevealTextSection() {
  return (
    <section className="dhoom-reveal relative overflow-hidden bg-[#050611] px-4 py-16 text-white md:px-10 md:py-20 lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_14%,rgba(212,175,55,0.22),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(236,72,153,0.24),transparent_34%),radial-gradient(circle_at_50%_105%,rgba(20,184,166,0.18),transparent_38%),linear-gradient(135deg,#050611,#170623_48%,#061421)]" />
      <div className="ad-channel-dots absolute inset-0 opacity-25" />
      <div className="ad-channel-sweep absolute left-[-45%] top-[-45%] h-[190%] w-[42%] rotate-12 bg-gradient-to-r from-transparent via-white/18 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1180px]">
        <div className="mx-auto max-w-[820px] text-center">
          <p className="mx-auto mb-4 w-fit rounded-full border border-[#d4af37]/50 bg-white/5 px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.28em] text-[#d4af37] shadow-[0_0_40px_rgba(212,175,55,0.12)]">
            Dhoom ad engine
          </p>

          <h2 className="dhoom-luxe-heading text-[clamp(2.7rem,5vw,5.7rem)]">
            AI generated <span>ads</span>
            <br />
            for every channel.
          </h2>

          <p className="mx-auto mt-5 max-w-[670px] text-sm font-bold leading-7 text-white/62 md:text-base">
            From Facebook to Google to TikTok — Dhoom turns one product photo
            into platform-ready ads for every place your buyer scrolls.
          </p>
        </div>

        <div className="relative mt-11 overflow-hidden rounded-[1.6rem] border border-white/12 bg-white/[0.045] shadow-[0_34px_110px_rgba(0,0,0,0.42)] backdrop-blur-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(217,255,63,0.08),transparent_28%),radial-gradient(circle_at_86%_20%,rgba(236,72,153,0.1),transparent_30%)]" />

          <div className="relative grid md:grid-cols-2 lg:grid-cols-4">
            {channels.map((channel, index) => (
              <ChannelCard
                key={channel.title}
                channel={channel}
                index={index}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {[
            "One photo",
            "Many formats",
            "Pakistani seller logic",
            "Brand DNA aware",
            "Ready to post",
          ].map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.18em] text-white/65"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .ad-channel-dots {
          background-image:
            radial-gradient(circle, rgba(255,255,255,0.2) 0 1px, transparent 1.5px),
            radial-gradient(circle, rgba(212,175,55,0.24) 0 1px, transparent 1.4px);
          background-size: 42px 42px, 78px 78px;
          background-position: 0 0, 24px 18px;
          mask-image: radial-gradient(circle at 50% 45%, black, transparent 74%);
        }

        .ad-channel-sweep {
          animation: adChannelSweep 7s ease-in-out infinite;
        }

        @keyframes adChannelSweep {
          0% {
            transform: translateX(-120%) rotate(12deg);
            opacity: 0;
          }
          35% {
            opacity: 0.5;
          }
          65%,
          100% {
            transform: translateX(430%) rotate(12deg);
            opacity: 0;
          }
        }

        .ad-channel-card {
          opacity: 0;
          transform: translateY(18px) scale(0.98);
          animation: adChannelCardIn 760ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes adChannelCardIn {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </section>
  )
}

function ChannelCard({
  channel,
  index,
}: {
  channel: {
    icon: LucideIcon
    title: string
    text: string
  }
  index: number
}) {
  const Icon = channel.icon

  return (
    <article
      className="ad-channel-card group relative min-h-[13.5rem] border-b border-white/10 p-5 transition duration-300 hover:bg-white/[0.075] md:border-r lg:[&:nth-child(4n)]:border-r-0 lg:[&:nth-child(n+5)]:border-b-0"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#d9ff3f]/70 to-transparent" />
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#d9ff3f]/14 blur-2xl" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-[#090b18]/85 text-[#d9ff3f] shadow-[0_0_34px_rgba(217,255,63,0.1)] transition duration-300 group-hover:-translate-y-1 group-hover:border-[#d9ff3f]/40 group-hover:bg-[#d9ff3f] group-hover:text-[#070816]">
            <Icon size={18} strokeWidth={2.5} />
          </div>

          <h3 className="mt-6 text-[1.05rem] font-black tracking-[-0.04em] text-white">
            {channel.title}
          </h3>

          <p className="mt-3 max-w-[14.5rem] text-[0.82rem] font-bold leading-6 text-white/56">
            {channel.text}
          </p>
        </div>

        <span className="mt-6 w-fit rounded-full bg-white/[0.07] px-3 py-1.5 text-[0.58rem] font-black uppercase tracking-[0.2em] text-[#d4af37]">
          AI ready
        </span>
      </div>
    </article>
  )
}
