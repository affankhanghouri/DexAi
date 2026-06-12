"use client"

import { Bell, Search, Sparkles } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/campaigns/new": "New Campaign",
  "/dashboard/products": "Products",
  "/dashboard/brand-dna": "Brand DNA",
  "/dashboard/creative-lab": "Creative Lab",
  "/dashboard/settings": "Settings",
}

export function DashboardTopbar() {
  const pathname = usePathname()
  const title = titles[pathname] || "Dashboard"

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070708]/92 px-4 py-3 backdrop-blur-2xl md:px-6 lg:px-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[0.58rem] font-black uppercase tracking-[0.28em] text-orange-400">
            Dhoom AI
          </p>
          <h1 className="mt-1 text-xl font-black leading-none tracking-[-0.05em] text-white md:text-2xl">
            {title}
          </h1>
        </div>

        <div className="hidden min-w-[280px] max-w-[390px] flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2.5 md:flex">
          <Search size={16} className="text-white/35" />
          <input
            placeholder="Search..."
            className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/35"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.055] text-white/65 transition hover:bg-white/[0.1]">
            <Bell size={17} />
          </button>

          <Link
            href="/dashboard/campaigns/new"
            className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-[#d9ff3f] px-4 py-2.5 text-xs font-black text-[#070816] transition hover:scale-[1.02] md:inline-flex"
          >
            <Sparkles size={15} />
            Create
          </Link>

          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-xs font-black text-[#070816]">
            AG
          </div>
        </div>
      </div>
    </header>
  )
}