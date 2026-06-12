"use client"

import { motion } from "framer-motion"

export function DigitalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#070816]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#070816,#0b0b12_48%,#10110d)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />

      <motion.div
        animate={{
          backgroundPosition: ["0px 0px", "180px 180px"],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:42px_42px] opacity-[0.08]"
      />

      <motion.div
        animate={{
          x: ["-15%", "115%"],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/4 h-px w-1/2 bg-gradient-to-r from-transparent via-[#d9ff3f]/30 to-transparent"
      />

      <motion.div
        animate={{
          x: ["115%", "-15%"],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-2/3 h-px w-1/2 bg-gradient-to-r from-transparent via-orange-300/25 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070816] to-transparent" />
    </div>
  )
}
