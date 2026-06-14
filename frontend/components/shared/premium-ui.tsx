"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

export function PremiumPageShell({
  eyebrow,
  title,
  subtitle,
  children,
  action,
}: {
  eyebrow: string
  title: string
  subtitle: string
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42 }}
        className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl md:p-6"
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(217,255,63,0.16),transparent_42%),linear-gradient(315deg,rgba(249,115,22,0.13),transparent_48%)]" />

        <div className="relative z-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center rounded-full border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
              {eyebrow}
            </div>

            <h1 className="max-w-4xl text-4xl font-black tracking-[-0.08em] text-white md:text-6xl">
              {title}
            </h1>

            <p className="mt-3 max-w-2xl text-sm font-bold leading-7 text-white/52 md:text-base">
              {subtitle}
            </p>
          </div>

          {action}
        </div>
      </motion.header>

      {children}
    </div>
  )
}

export function PremiumPanel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0d0d13]/88 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.32)] backdrop-blur-2xl",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(120deg,rgba(255,255,255,0.1),transparent_36%,rgba(217,255,63,0.055))]",
        className,
      )}
    >
      <div className="relative z-10">{children}</div>
    </motion.section>
  )
}

export function PremiumActionCard({
  icon,
  title,
  description,
  children,
  className,
}: {
  icon: ReactNode
  title: string
  description: string
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-4 transition hover:border-[#d9ff3f]/35 hover:bg-white/[0.075]",
        className,
      )}
    >
      <div className="absolute inset-0 translate-x-[-120%] bg-white/10 blur-xl transition duration-700 group-hover:translate-x-[120%]" />

      <div className="relative z-10">
        <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816] shadow-[0_0_36px_rgba(217,255,63,0.18)]">
          {icon}
        </div>

        <h3 className="text-2xl font-black tracking-[-0.06em] text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm font-bold leading-6 text-white/48">
          {description}
        </p>

        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  )
}

export function PremiumStatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint: string
}) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.045] p-4">
      <p className="text-[0.58rem] font-black uppercase tracking-[0.2em] text-white/35">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black tracking-[-0.07em] text-white">
        {value}
      </p>

      <p className="mt-1 text-xs font-bold leading-5 text-white/42">{hint}</p>
    </div>
  )
}

export function PremiumStatusPill({
  children,
  tone = "lime",
}: {
  children: ReactNode
  tone?: "lime" | "orange" | "white" | "red"
}) {
  const styles = {
    lime: "border-[#d9ff3f]/20 bg-[#d9ff3f]/10 text-[#d9ff3f]",
    orange: "border-orange-400/25 bg-orange-500/10 text-orange-200",
    white: "border-white/10 bg-white/[0.055] text-white/55",
    red: "border-red-500/30 bg-red-500/10 text-red-200",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[0.58rem] font-black uppercase tracking-[0.16em]",
        styles[tone],
      )}
    >
      {children}
    </span>
  )
}

export function PremiumEmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="grid min-h-[320px] place-items-center rounded-[1.5rem] border border-dashed border-white/15 bg-white/[0.035] p-6 text-center">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.065] text-white/45">
          {icon}
        </div>

        <h3 className="mt-4 text-3xl font-black tracking-[-0.07em] text-white">
          {title}
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm font-bold leading-6 text-white/45">
          {description}
        </p>

        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  )
}
