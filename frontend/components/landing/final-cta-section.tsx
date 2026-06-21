import Image from "next/image"
import Link from "next/link"
import { Download, Rocket } from "lucide-react"

const launchPoints = [
  "Facebook, Instagram, TikTok, Google, and YouTube creatives",
  "Platform-ready sizes, captions, and launch copy",
  "One product photo turned into a full campaign pack",
]

export function FinalCtaSection() {
  return (
    <section className="dhoom-reveal relative overflow-hidden bg-[#050611] px-4 py-18 text-white md:px-10 md:py-24 lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(217,255,63,0.2),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(236,72,153,0.24),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(20,184,166,0.18),transparent_38%),linear-gradient(135deg,#050611,#170623_48%,#061421)]" />
      <div className="final-launch-dots absolute inset-0 opacity-20" />
      <div className="final-launch-sweep absolute left-[-45%] top-[-40%] h-[180%] w-[42%] rotate-12 bg-gradient-to-r from-transparent via-white/18 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1180px]">
        <div className="grid gap-9 overflow-hidden rounded-[2.2rem] border border-white/14 bg-white/[0.055] p-4 shadow-[0_45px_130px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:p-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:p-10">
          <div className="group relative overflow-hidden rounded-[1.65rem] border border-white/12 bg-[#f7f5f0] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_15%,rgba(217,255,63,0.18),transparent_26%),radial-gradient(circle_at_78%_18%,rgba(236,72,153,0.12),transparent_30%)]" />
            <Image
              src="/images/landing/landing_perfume.png"
              alt="DEX AI perfume ads across Facebook, TikTok, Instagram, YouTube, and Google"
              width={1280}
              height={1280}
              className="relative z-10 h-auto w-full rounded-[1.25rem] object-contain shadow-[0_24px_70px_rgba(7,8,22,0.2)] transition duration-700 group-hover:scale-[1.025]"
              priority={false}
            />
          </div>

          <div className="relative px-1 pb-2 md:px-3 lg:pl-5">
            <div className="mb-6 flex items-center gap-3">
              <span className="text-[0.72rem] font-black uppercase tracking-[0.26em] text-white/45">
                03
              </span>
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.07] text-[#d9ff3f] shadow-[0_0_34px_rgba(217,255,63,0.12)]">
                <Download size={18} strokeWidth={2.5} />
              </span>
            </div>

            <p className="mb-4 w-fit rounded-full border border-[#d4af37]/50 bg-white/5 px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.28em] text-[#d4af37]">
              Ready to launch
            </p>

            <h2 className="dhoom-luxe-heading max-w-[620px] text-[clamp(2.8rem,5.4vw,6rem)]">
              Download <span>ads.</span>
              <br />
              Launch everywhere.
            </h2>

            <p className="mt-6 max-w-[560px] text-base font-bold leading-8 text-white/64">
              Get publish-ready ads for Facebook, Google, TikTok, Instagram,
              and YouTube. Every DEX AI creative is shaped for the platform,
              the buyer, and the selling moment.
            </p>

            <div className="mt-7 grid gap-3">
              {launchPoints.map((point, index) => (
                <div
                  key={point}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-4 text-sm font-black text-white/82"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#d9ff3f] text-xs font-black text-[#070816]">
                    {index + 1}
                  </span>
                  {point}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/request-access"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d9ff3f] px-7 py-4 text-sm font-black text-[#070816] shadow-[0_24px_70px_rgba(217,255,63,0.22)] transition hover:-translate-y-1 hover:scale-[1.02]"
              >
                <Rocket size={17} strokeWidth={2.6} />
                Start DEX AI
              </Link>

              <Link
                href="/request-access"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.08] px-7 py-4 text-sm font-black text-white backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.12]"
              >
                Get a free campaign sample
              </Link>
            </div>
          </div>
        </div>

        <footer className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm font-bold text-white/45 md:flex-row">
          <p>© 2026 DEX AI. all rights are reserved</p>
          <p>One product photo. Campaign-ready everywhere.</p>
        </footer>
      </div>

      <style>{`
        .final-launch-dots {
          background-image:
            radial-gradient(circle, rgba(255,255,255,0.18) 0 1px, transparent 1.5px),
            radial-gradient(circle, rgba(212,175,55,0.22) 0 1px, transparent 1.4px);
          background-size: 42px 42px, 78px 78px;
          background-position: 0 0, 24px 18px;
          mask-image: radial-gradient(circle at 50% 45%, black, transparent 74%);
        }

        .final-launch-sweep {
          animation: finalLaunchSweep 7s ease-in-out infinite;
        }

        @keyframes finalLaunchSweep {
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
      `}</style>
    </section>
  )
}
