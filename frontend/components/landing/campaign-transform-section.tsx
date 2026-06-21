"use client"

import Image from "next/image"

const outputs = [
  "Campaign angle",
  "Poster direction",
  "Caption hook",
  "Message copy",
  "Offer idea",
  "Story flow",
]

export function CampaignTransformSection() {
  return (
    <section
      id="campaign"
      className="dhoom-reveal relative overflow-hidden bg-[#050611] px-4 py-16 text-white md:px-10 lg:px-16"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(212,175,55,0.22),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(236,72,153,0.28),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(20,184,166,0.24),transparent_40%),linear-gradient(135deg,#050611,#160724_48%,#061421)]" />

      <div className="dhoom-lab-dots absolute inset-0 opacity-25" />
      <div className="dhoom-lab-sweep absolute left-[-40%] top-[-40%] h-[180%] w-[42%] rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1180px]">
        <div className="mb-10 text-center">
          <p className="mx-auto mb-4 w-fit rounded-full border border-[#d4af37]/50 bg-white/5 px-4 py-2 text-[0.66rem] font-black uppercase tracking-[0.28em] text-[#d4af37] shadow-[0_0_40px_rgba(212,175,55,0.14)]">
            DEX AI Creative Lab
          </p>

          <h2 className="mx-auto max-w-[820px] text-[clamp(2.7rem,5vw,5.3rem)] font-black leading-[0.86] tracking-[-0.085em] text-white drop-shadow-[0_0_34px_rgba(255,255,255,0.18)]">
            Same product.
            <br />
            Different demand.
          </h2>

          <p className="mx-auto mt-5 max-w-[620px] text-sm font-bold leading-7 text-white/62 md:text-base">
            DEX AI turns ordinary product photos into campaign-ready selling
            moments.
          </p>
        </div>

        <div className="relative grid items-center gap-6 lg:grid-cols-[0.72fr_0.14fr_1.25fr]">
          {/* BEFORE */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-[#0b0d18]/95 p-4 shadow-[0_35px_100px_rgba(0,0,0,0.45)]">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#d4af37]/18 blur-3xl" />
            <div className="absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-purple-500/16 blur-3xl" />

            <div className="relative z-10 mb-4 flex items-center justify-between">
              <span className="rounded-full bg-white/10 px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.22em] text-white/70">
                Before
              </span>

              <span className="text-xs font-black uppercase tracking-[0.18em] text-red-300/80">
                Raw post
              </span>
            </div>

            <div className="relative z-10 overflow-hidden rounded-[1.65rem] border border-white/12 bg-white/5 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
              <div className="relative h-[24rem] overflow-hidden rounded-[1.35rem] bg-black">
                <Image
                  src="/images/landing/bofore-campaign.png"
                  alt="Raw product photo"
                  fill
                  className="object-cover"
                  sizes="32vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#050611]/55 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-white/55">
                    Product photo
                  </p>

                  <h3 className="mt-2 text-[clamp(1.8rem,2.8vw,2.8rem)] font-black leading-[0.9] tracking-[-0.075em] text-white">
                    No hook.
                    <br />
                    No story.
                  </h3>
                </div>
              </div>
            </div>

            <p className="relative z-10 mt-4 text-sm font-bold leading-6 text-white/50">
              The product exists, but the buyer has no reason to stop.
            </p>
          </div>

          {/* CENTER ENGINE */}
          <div className="hidden place-items-center lg:grid">
            <div className="relative grid h-24 w-24 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_20%,white,#d9ff3f_38%,#d4af37_100%)] text-[0.64rem] font-black tracking-[0.16em] text-[#070816] shadow-[0_0_50px_rgba(217,255,63,0.36)]">
              <div className="absolute inset-[-18px] rounded-full border border-[#d9ff3f]/20" />
              <div className="absolute inset-[-36px] rounded-full border border-[#d4af37]/10" />
              <div className="absolute h-[1px] w-[230px] bg-gradient-to-r from-transparent via-[#d9ff3f]/55 to-transparent" />
              DEX AI
            </div>
          </div>

          {/* AFTER */}
          <div className="relative overflow-hidden rounded-[2.2rem] border border-white/15 bg-[radial-gradient(circle_at_12%_10%,rgba(217,255,63,0.16),transparent_30%),radial-gradient(circle_at_100%_14%,rgba(236,72,153,0.28),transparent_36%),linear-gradient(145deg,#0a0718,#241033_55%,#071627)] p-5 shadow-[0_45px_130px_rgba(0,0,0,0.5)]">
            <div className="absolute right-[-6rem] top-[-6rem] h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />
            <div className="absolute bottom-[-7rem] left-[-5rem] h-80 w-80 rounded-full bg-teal-400/20 blur-3xl" />

            <div className="relative z-10 mb-5 flex items-center justify-between">
              <span className="rounded-full bg-[#d9ff3f] px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#070816]">
                After
              </span>

              <span className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
                Campaign ready
              </span>
            </div>

            <div className="relative z-10 grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
              {/* BIG POSTER */}
              <div className="relative overflow-hidden rounded-[1.8rem] border border-[#d4af37]/45 bg-white/10 p-3 shadow-[0_0_45px_rgba(212,175,55,0.22),0_30px_90px_rgba(0,0,0,0.42)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(217,255,63,0.2),transparent_32%)]" />

                <div className="relative h-[34rem] overflow-hidden rounded-[1.45rem] bg-black/30">
                  <Image
                    src="/images/landing/after-dhoom.png"
                    alt="DEX AI campaign poster"
                    fill
                    className="object-cover"
                    sizes="45vw"
                    priority={false}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#070816]/22 via-transparent to-transparent" />
                </div>
              </div>

              {/* SELLING SYSTEM */}
              <div className="flex flex-col justify-center">
                <h3 className="text-[clamp(2.3rem,4vw,4.3rem)] font-black leading-[0.86] tracking-[-0.085em] text-white">
                  From plain post
                  <br />
                  to campaign power.
                </h3>

                <p className="mt-4 max-w-sm text-base font-bold leading-7 text-white/62">
                  A stronger look, a sharper angle, and a clear reason to buy.
                </p>

                <div className="mt-6 grid gap-2">
                  {outputs.map((item, index) => (
                    <div
                      key={item}
                      className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-xs font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:border-[#d9ff3f]/50 hover:bg-white/15"
                    >
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-[#d9ff3f] text-[0.62rem] text-[#070816]">
                        {index + 1}
                      </span>
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-5 overflow-hidden rounded-[1.5rem] bg-[#d9ff3f] p-5 text-[#070816] shadow-[0_24px_60px_rgba(217,255,63,0.2)]">
                  <p className="mb-2 text-[0.62rem] font-black uppercase tracking-[0.22em]">
                    Final outcome
                  </p>

                  <strong className="block text-[clamp(1.05rem,1.55vw,1.5rem)] font-black leading-tight tracking-[-0.035em]">
                    One product photo becomes a complete campaign.
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dhoom-lab-dots {
          background-image:
            radial-gradient(circle, rgba(255,255,255,0.2) 0 1px, transparent 1.5px),
            radial-gradient(circle, rgba(212,175,55,0.24) 0 1px, transparent 1.4px);
          background-size: 42px 42px, 78px 78px;
          background-position: 0 0, 24px 18px;
          mask-image: radial-gradient(circle at 50% 45%, black, transparent 72%);
        }

        .dhoom-lab-sweep {
          animation: dhoomLabSweep 7s ease-in-out infinite;
        }

        @keyframes dhoomLabSweep {
          0% {
            transform: translateX(-120%) rotate(12deg);
            opacity: 0;
          }

          35% {
            opacity: 0.55;
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
