"use client"

const brainPoints = [
  {
    label: "Product samjho",
    title: "What are you really selling?",
    text: "Not just suit, burger, shoes, or jewellery — Dhoom finds the reason people should care.",
  },
  {
    label: "Buyer pakro",
    title: "Who should stop scrolling?",
    text: "College girls, moms, office buyers, Eid shoppers, food lovers, gift buyers — the campaign starts with the right audience.",
  },
  {
    label: "Moment banao",
    title: "Why should they buy now?",
    text: "Ramadan, Eid, salary week, wedding season, weekend cravings, launch drop, sale push — Dhoom turns timing into demand.",
  },
  {
    label: "Campaign nikalo",
    title: "What should you post?",
    text: "Angle, hook, caption, WhatsApp copy, offer idea, story flow, poster direction — ready to use.",
  },
]

const ticker = [
  "Instagram sellers",
  "WhatsApp stores",
  "Clothing pages",
  "Food sellers",
  "Jewellery brands",
  "Cosmetics shops",
  "Shoe sellers",
  "Home brands",
  "Small Pakistani businesses",
]

export function RevealTextSection() {
  return (
    <section className="relative overflow-hidden bg-[#050611] px-4 py-14 text-white md:px-10 lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(212,175,55,0.2),transparent_30%),radial-gradient(circle_at_85%_18%,rgba(236,72,153,0.22),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(20,184,166,0.2),transparent_38%),linear-gradient(135deg,#050611,#170623_48%,#061421)]" />

      <div className="brain-dots absolute inset-0 opacity-25" />
      <div className="brain-sweep absolute left-[-45%] top-[-40%] h-[180%] w-[42%] rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1080px]">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          {/* LEFT COPY */}
          <div>
            <p className="mb-4 w-fit rounded-full border border-[#d4af37]/50 bg-white/5 px-4 py-1.5 text-[0.62rem] font-black uppercase tracking-[0.28em] text-[#d4af37] shadow-[0_0_40px_rgba(212,175,55,0.14)]">
              Built for Pakistani sellers
            </p>

            <p className="font-urdu mb-4 text-[clamp(1.5rem,2.8vw,2.8rem)] font-black leading-snug text-[#d9ff3f]">
              Dhoom content tool nahi.
            </p>

            <h2 className="max-w-[700px] text-[clamp(2.2rem,4.2vw,4.6rem)] font-black leading-[0.86] tracking-[-0.07em] text-white drop-shadow-[0_0_34px_rgba(255,255,255,0.18)]">
              It is your
              <br />
              campaign brain.
            </h2>

            <p className="mt-5 max-w-[580px] text-[clamp(0.85rem,1.1vw,0.98rem)] font-bold leading-[1.75] tracking-[-0.01em] text-white/65">
              Dhoom does not help you post more noise. It helps you understand
              your product, your buyer, your market moment, and the campaign
              story before creating anything.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
                <p className="text-[0.58rem] font-black uppercase tracking-[0.22em] text-[#d4af37]">
                  Seller feeling
                </p>
                <h3 className="mt-2.5 text-[1.15rem] font-black leading-[1.2] tracking-[-0.04em] text-white">
                  &quot;Product acha hai… marketing kaise karun?&quot;
                </h3>
              </div>

              <div className="rounded-[1.3rem] border border-[#d9ff3f]/25 bg-[#d9ff3f] p-4 text-[#070816] shadow-[0_24px_70px_rgba(217,255,63,0.16)]">
                <p className="text-[0.58rem] font-black uppercase tracking-[0.22em]">
                  Dhoom answer
                </p>
                <h3 className="mt-2.5 text-[1.15rem] font-black leading-[1.2] tracking-[-0.04em]">
                  &quot;Product bhejo. Campaign hum banate hain.&quot;
                </h3>
              </div>
            </div>
          </div>

          {/* RIGHT BRAIN SYSTEM */}
          <div className="relative">
            <div className="absolute -left-10 top-10 h-56 w-56 rounded-full bg-[#d9ff3f]/15 blur-3xl" />
            <div className="absolute -right-10 bottom-10 h-56 w-56 rounded-full bg-pink-500/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.06] p-3.5 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
              <div className="rounded-[1.6rem] border border-white/10 bg-[#090b18]/90 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[0.58rem] font-black uppercase tracking-[0.24em] text-[#d4af37]">
                      Dhoom thinking flow
                    </p>
                    <h3 className="mt-1.5 text-[clamp(1.4rem,2.2vw,2.2rem)] font-black leading-[0.92] tracking-[-0.07em] text-white">
                      From confusion
                      <br />
                      to campaign clarity.
                    </h3>
                  </div>

                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_20%,white,#d9ff3f_38%,#d4af37_100%)] text-[0.55rem] font-black tracking-[0.14em] text-[#070816] shadow-[0_0_45px_rgba(217,255,63,0.28)]">
                    AI
                  </div>
                </div>

                <div className="grid gap-2.5">
                  {brainPoints.map((point, index) => (
                    <div
                      key={point.title}
                      className="brain-card group rounded-[1.2rem] border border-white/10 bg-white/[0.07] p-3.5 transition duration-300 hover:border-[#d9ff3f]/40 hover:bg-white/[0.1]"
                      style={{ animationDelay: `${index * 130}ms` }}
                    >
                      <div className="flex gap-3">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#d9ff3f] text-[0.7rem] font-black text-[#070816]">
                          {index + 1}
                        </span>

                        <div>
                          <p className="text-[0.58rem] font-black uppercase tracking-[0.2em] text-[#d4af37]">
                            {point.label}
                          </p>
                          <h4 className="mt-0.5 text-[1.05rem] font-black leading-[1.15] tracking-[-0.04em] text-white">
                            {point.title}
                          </h4>
                          <p className="mt-1.5 text-[0.8rem] font-bold leading-[1.55] text-white/55">
                            {point.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TICKER */}
        <div className="mt-10 overflow-hidden rounded-full border border-white/10 bg-white/[0.05] py-2.5 backdrop-blur-xl">
          <div className="brain-ticker flex w-max gap-3">
            {[...ticker, ...ticker].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="rounded-full bg-white/[0.08] px-4 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.18em] text-white/70"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .brain-dots {
          background-image:
            radial-gradient(circle, rgba(255,255,255,0.2) 0 1px, transparent 1.5px),
            radial-gradient(circle, rgba(212,175,55,0.24) 0 1px, transparent 1.4px);
          background-size: 42px 42px, 78px 78px;
          background-position: 0 0, 24px 18px;
          mask-image: radial-gradient(circle at 50% 45%, black, transparent 74%);
        }

        .brain-sweep {
          animation: brainSweep 7s ease-in-out infinite;
        }

        @keyframes brainSweep {
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

        .brain-card {
          opacity: 0;
          transform: translateY(14px);
          animation: brainCardIn 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes brainCardIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .brain-ticker {
          animation: brainTicker 30s linear infinite;
          padding-left: 1rem;
        }

        @keyframes brainTicker {
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
