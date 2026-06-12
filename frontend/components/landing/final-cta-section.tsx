import Link from "next/link"

export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#050611] px-4 py-20 text-white md:px-10 lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(217,255,63,0.18),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(236,72,153,0.22),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(20,184,166,0.2),transparent_38%),linear-gradient(135deg,#050611,#170623_48%,#061421)]" />

      <div className="final-dots absolute inset-0 opacity-20" />
      <div className="final-sweep absolute left-[-45%] top-[-40%] h-[180%] w-[42%] rotate-12 bg-gradient-to-r from-transparent via-white/18 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1120px]">
        <div className="relative overflow-hidden rounded-[2.4rem] border border-white/15 bg-white/[0.06] p-6 shadow-[0_45px_130px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:p-10 lg:p-14">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#d9ff3f]/16 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-pink-500/18 blur-3xl" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="mb-5 w-fit rounded-full border border-[#d4af37]/50 bg-white/5 px-4 py-2 text-[0.66rem] font-black uppercase tracking-[0.28em] text-[#d4af37]">
                Ready to make Dhoom?
              </p>

              <h2 className="max-w-[760px] text-[clamp(3rem,6vw,6.4rem)] font-black leading-[0.84] tracking-[-0.09em] text-white drop-shadow-[0_0_34px_rgba(255,255,255,0.18)]">
                Stop guessing.
                <br />
                Start selling with a campaign.
              </h2>

              <p className="mt-6 max-w-[570px] text-base font-bold leading-8 text-white/64">
                Bring your product photo. Dhoom gives you the campaign angle,
                creative direction, caption, WhatsApp copy, offer idea, and the
                story your buyer should feel.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard/campaigns/new"
                  className="inline-flex items-center justify-center rounded-full bg-[#d9ff3f] px-7 py-4 text-sm font-black text-[#070816] shadow-[0_24px_70px_rgba(217,255,63,0.22)] transition hover:-translate-y-1 hover:scale-[1.02]"
                >
                  Build my first campaign
                </Link>

                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.08] px-7 py-4 text-sm font-black text-white backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.12]"
                >
                  Sign up free
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-white/12 bg-[#090b18]/90 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.38)]">
                <div className="mb-5 flex items-center justify-between">
                  <span className="rounded-full bg-[#d9ff3f] px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#070816]">
                    Final output
                  </span>

                  <span className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
                    Ready to post
                  </span>
                </div>

                <div className="grid gap-3">
                  {[
                    "Campaign angle",
                    "Poster direction",
                    "Caption hook",
                    "WhatsApp selling copy",
                    "Offer idea",
                    "Story flow",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-4 text-sm font-black text-white/86"
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#d9ff3f] text-xs font-black text-[#070816]">
                        {index + 1}
                      </span>
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-[1.5rem] bg-[#d9ff3f] p-5 text-[#070816]">
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.22em]">
                    Dhoom promise
                  </p>
                  <h3 className="mt-2 text-2xl font-black leading-[0.95] tracking-[-0.06em]">
                    Same product.
                    <br />
                    Better campaign.
                    <br />
                    Better demand.
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm font-bold text-white/45 md:flex-row">
          <p>© 2026 Dhoom AI. Built for Pakistani sellers.</p>
          <p>Random posts nahi. Har hafta Dhoom.</p>
        </footer>
      </div>

      <style>{`
        .final-dots {
          background-image:
            radial-gradient(circle, rgba(255,255,255,0.18) 0 1px, transparent 1.5px),
            radial-gradient(circle, rgba(212,175,55,0.22) 0 1px, transparent 1.4px);
          background-size: 42px 42px, 78px 78px;
          background-position: 0 0, 24px 18px;
          mask-image: radial-gradient(circle at 50% 45%, black, transparent 74%);
        }

        .final-sweep {
          animation: finalSweep 7s ease-in-out infinite;
        }

        @keyframes finalSweep {
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
