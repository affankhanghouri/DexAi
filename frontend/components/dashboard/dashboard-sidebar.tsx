"use client"

import {
  Boxes,
  Brain,
  Home,
  Megaphone,
  Plus,
  Settings,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { label: "Explore", href: "/dashboard", icon: Home },
  { label: "New Campaign", href: "/dashboard/campaigns/new", icon: Plus },
  { label: "Products", href: "/dashboard/products", icon: Boxes },
  { label: "Brand DNA", href: "/dashboard/brand-dna", icon: Brain },
  { label: "Creative Lab", href: "/dashboard/creative-lab", icon: Sparkles },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden h-screen w-[270px] shrink-0 border-r border-white/10 bg-[#070708]/95 p-3 lg:block">
      <div className="flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#0b0b0f]/95 p-3 shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
        <Link
          href="/dashboard"
          className="mb-5 flex items-center gap-3 rounded-[1.2rem] border border-white/10 bg-white/[0.045] px-4 py-4"
        >
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-[#d9ff3f] text-lg font-black text-[#070816]">
            D
          </div>

          <div>
            <p className="text-base font-black leading-none tracking-[-0.04em] text-white">
              Dhoom AI
            </p>
            <p className="mt-1 text-xs font-bold leading-4 text-white/40">
              Creative campaign studio
            </p>
          </div>
        </Link>

        <p className="mb-2 px-3 text-[0.62rem] font-black uppercase tracking-[0.24em] text-white/32">
          Create
        </p>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-black transition ${
                  active
                    ? "border border-orange-400/45 bg-orange-500/18 text-orange-100 shadow-[0_0_34px_rgba(249,115,22,0.2)]"
                    : "text-white/55 hover:bg-white/[0.065] hover:text-white"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto rounded-[1.25rem] border border-white/10 bg-[#111119] p-4 shadow-[0_22px_70px_rgba(0,0,0,0.35)]">
          <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-[#d9ff3f] text-[#070816]">
            <Sparkles size={18} />
          </div>

          <h3 className="text-lg font-black leading-none tracking-[-0.06em] text-white">
            Weekly Dhoom
          </h3>

          <p className="mt-2 text-xs font-bold leading-5 text-white/45">
            Product bhejo. Dhoom campaign banata hai.
          </p>

          <Link
            href="/dashboard/campaigns/new"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-[#d9ff3f] px-4 py-3 text-xs font-black text-[#070816] transition hover:scale-[1.02]"
          >
            <Megaphone size={15} />
            Start campaign
          </Link>
        </div>
      </div>
    </aside>
  )
}
