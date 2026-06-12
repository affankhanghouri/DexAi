"use client"

import { motion } from "framer-motion"
import {
  CheckCircle2,
  Loader2,
  MessageSquareText,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react"
import { useState } from "react"

export function GhostCommandPanel({
  title = "Ghost Editor",
  subtitle = "Ask Dhoom to change anything without opening a complex editor.",
  placeholder = "e.g. Make this more premium, less English-heavy, and stronger for WhatsApp orders...",
  isRunning,
  successMessage,
  error,
  onSubmit,
}: {
  title?: string
  subtitle?: string
  placeholder?: string
  isRunning: boolean
  successMessage?: string
  error?: string
  onSubmit: (instruction: string) => Promise<void> | void
}) {
  const [instruction, setInstruction] = useState("")

  const quickCommands = [
    "Make it more premium and less cluttered.",
    "Make the copy simpler and less English-heavy.",
    "Make the CTA stronger for WhatsApp orders.",
    "Make it more high-energy and bold.",
    "Make it Eid-focused but still premium.",
    "Make it more trust-building for new buyers.",
  ]

  async function submit(value?: string) {
    const finalInstruction = (value || instruction).trim()

    if (!finalInstruction) return

    await onSubmit(finalInstruction)
    setInstruction("")
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-[1.5rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(217,255,63,0.18),transparent_42%),linear-gradient(315deg,rgba(249,115,22,0.14),transparent_46%)]" />

      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d9ff3f]/20 bg-black/20 px-3 py-2 text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#d9ff3f]">
              <Sparkles size={13} />
              Natural language control
            </div>

            <h3 className="mt-3 text-2xl font-black tracking-[-0.06em] text-white">
              {title}
            </h3>

            <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-white/52">
              {subtitle}
            </p>
          </div>

          <motion.div
            animate={{
              rotate: isRunning ? 360 : 0,
              scale: isRunning ? [1, 1.08, 1] : 1,
            }}
            transition={{
              rotate: {
                duration: 2.2,
                repeat: isRunning ? Infinity : 0,
                ease: "linear",
              },
              scale: {
                duration: 1.4,
                repeat: isRunning ? Infinity : 0,
              },
            }}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816] shadow-[0_0_40px_rgba(217,255,63,0.25)]"
          >
            {isRunning ? <Loader2 size={21} /> : <Wand2 size={21} />}
          </motion.div>
        </div>

        <div className="grid gap-2 md:grid-cols-3">
          {quickCommands.map((command) => (
            <button
              key={command}
              onClick={() => submit(command)}
              disabled={isRunning}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] px-3 py-3 text-left text-xs font-black leading-5 text-white/66 transition hover:border-[#d9ff3f]/30 hover:bg-white/[0.085] disabled:cursor-wait disabled:opacity-50"
            >
              <span className="relative z-10">{command}</span>
              <span className="absolute inset-0 translate-x-[-110%] bg-white/10 blur-xl transition group-hover:translate-x-[110%]" />
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-col gap-2 md:flex-row">
          <div className="flex min-h-12 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4">
            <MessageSquareText size={17} className="text-orange-300" />
            <input
              value={instruction}
              onChange={(event) => setInstruction(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  submit()
                }
              }}
              disabled={isRunning}
              placeholder={placeholder}
              className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/28"
            />
          </div>

          <button
            onClick={() => submit()}
            disabled={isRunning || !instruction.trim()}
            className="group relative min-h-12 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-[#d9ff3f] px-5 text-sm font-black text-[#070816] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              {isRunning ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Zap size={16} />
              )}
              {isRunning ? "Applying..." : "Apply change"}
            </span>
          </button>
        </div>

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-start gap-2 rounded-2xl border border-[#d9ff3f]/25 bg-[#d9ff3f]/10 px-4 py-3 text-sm font-bold leading-6 text-[#d9ff3f]"
          >
            <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
            {successMessage}
          </motion.div>
        )}

        {error && (
          <div className="mt-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold leading-6 text-red-200">
            {error}
          </div>
        )}
      </div>
    </motion.section>
  )
}
