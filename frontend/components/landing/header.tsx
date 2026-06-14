import Link from "next/link"

export function Header() {
  return (
    <header className="absolute left-0 top-0 z-50 w-full px-8 pt-5">
      <div className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between rounded-full border border-white/45 bg-white/60 px-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
        <Link
          href="/"
          className="text-lg font-black tracking-[-0.04em] text-[#070816]"
        >
          Dhoom AI
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#problem"
            className="text-sm font-black text-slate-700 transition hover:text-slate-950"
          >
            Problem
          </a>

          <a
            href="#campaign"
            className="text-sm font-black text-slate-700 transition hover:text-slate-950"
          >
            Campaign
          </a>

          <a
            href="#output"
            className="text-sm font-black text-slate-700 transition hover:text-slate-950"
          >
            Output
          </a>
        </nav>

        <Link
          href="/request-access"
          className="rounded-full bg-[#070816] px-6 py-3 text-sm font-black text-white shadow-[0_18px_40px_rgba(7,8,22,0.22)] transition hover:scale-105"
        >
          Start Dhoom
        </Link>
      </div>
    </header>
  )
}
