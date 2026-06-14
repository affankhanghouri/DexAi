const stats = [
  {
    value: "20+",
    label: "Campaigns created",
  },
  {
    value: "100+",
    label: "Ads generated",
  },
  {
    value: "< 4 min",
    label: "Avg. generation time",
  },
]

export function TrustStatsSection() {
  return (
    <section
      id="problem"
      className="dhoom-reveal relative overflow-hidden bg-[#080814] py-14 md:py-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_50%,rgba(217,255,63,0.16),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.18),transparent_34%),linear-gradient(180deg,#080814_0%,#11081f_58%,#080814_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d9ff3f]/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/35 to-transparent" />

      <div className="relative mx-auto max-w-[1180px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-white/10 bg-white/[0.035] px-5 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-sm"
            >
              <h3 className="dhoom-stat-number text-[clamp(2.7rem,5vw,4.6rem)]">
                {stat.value}
              </h3>

              <p className="mt-2 text-[0.74rem] font-bold uppercase tracking-[0.28em] text-[#d4af37] md:text-[0.82rem]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
