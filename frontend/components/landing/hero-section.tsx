"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

const leftCreativityImages = [
  "/images/landing/creativity-2.jpg",
  "/images/landing/creativity-3.jpg",
]

const rightCreativityImages = [
  "/images/landing/creativity-4.jpg",
  "/images/landing/creativity-5.jpg",
]

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let animationFrame: number
    let targetProgress = 0
    let currentProgress = 0

    const calculateProgress = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const scrolled = -rect.top
      const total = window.innerHeight * 1.7

      targetProgress = Math.max(0, Math.min(1, scrolled / total))
    }

    const animate = () => {
      currentProgress += (targetProgress - currentProgress) * 0.12

      if (Math.abs(targetProgress - currentProgress) < 0.001) {
        currentProgress = targetProgress
      }

      setProgress(currentProgress)

      animationFrame = requestAnimationFrame(animate)
    }

    window.addEventListener("scroll", calculateProgress, { passive: true })
    window.addEventListener("resize", calculateProgress)

    calculateProgress()
    animate()

    return () => {
      window.removeEventListener("scroll", calculateProgress)
      window.removeEventListener("resize", calculateProgress)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  const wordOpacity = Math.max(0, 1 - progress / 0.22)
  const gridProgress = Math.max(0, Math.min(1, (progress - 0.16) / 0.84))
  const centerWidth = 100 - gridProgress * 48
  const sideWidth = gridProgress * 23
  const sideOpacity = gridProgress
  const leftMove = -110 + gridProgress * 110
  const rightMove = 110 - gridProgress * 110
  const radius = gridProgress * 28
  const gap = gridProgress * 18

  return (
    <section ref={sectionRef} className="relative min-h-[360vh] bg-[#080814]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="relative flex h-full w-full items-stretch justify-center"
          style={{
            gap: `${gap}px`,
            padding: `${gridProgress * 18}px`,
          }}
        >
          {/* Left side cards */}
          <div
            className="hidden flex-col gap-4 md:flex"
            style={{
              width: `${sideWidth}%`,
              opacity: sideOpacity,
              transform: `translate3d(${leftMove}%, 0, 0)`,
              willChange: "transform, opacity, width",
            }}
          >
            {leftCreativityImages.map((src) => (
              <CreativityImageCard key={src} src={src} />
            ))}
          </div>

          {/* Center panel */}
          <div
            className="dhoom-hero-stage relative overflow-hidden"
            style={{
              width: `${centerWidth}%`,
              borderRadius: `${radius}px`,
              willChange: "width, border-radius",
            }}
          >
            <div className="dhoom-soft-aurora" />
            <div className="dhoom-star-dust" />
            <div className="dhoom-energy-ribbon" />

            {/* Hero title — fades out on scroll */}
            <div
              className="absolute inset-0 flex items-center justify-center overflow-visible"
              style={{ opacity: wordOpacity }}
            >
              <div className="dhoom-title-stack">
                <p className="dhoom-hero-small-text">apnay products ki</p>

                <h1 className="dhoom-hero-main-word">DHOOM</h1>

                <p className="dhoom-hero-machaao">MACHAO</p>

                <div className="dhoom-hero-action-row">
                  <Link
                    href="/auth"
                    className="dhoom-glow-btn dhoom-glow-btn-purple"
                  >
                    Signup
                  </Link>

                  <Link
                    href="/dashboard/campaigns/new"
                    className="dhoom-glow-btn dhoom-glow-btn-gold"
                  >
                    Book a Campaign
                  </Link>
                </div>
              </div>
            </div>

            {/* Scroll-in creative copy — fades in on scroll */}
            <div
              className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center will-change-transform"
              style={{
                opacity: gridProgress,
                transform: `translate3d(0, ${(1 - gridProgress) * 22}px, 0)`,
                pointerEvents: gridProgress > 0.8 ? "auto" : "none",
                willChange: "transform, opacity",
              }}
            >
              <div className="creative-scroll-copy">
                <p className="creative-scroll-kicker">DHOOM CREATIVE ENGINE</p>

                <h2>
                  Your unfair
                  <br />
                  creative advantage.
                </h2>

                <div className="creative-scroll-lines">
                  <span>Out-think.</span>
                  <span>Out-create.</span>
                  <span>Out-market.</span>
                </div>

                <p className="creative-scroll-description">
                  Dhoom turns simple product photos into campaign ideas,
                  creative directions, selling angles, and ready-to-post
                  marketing that feels impossible to ignore.
                </p>

                <p className="creative-scroll-roman">
                  Product wahi. Soch nayi. Campaign Dhoom wali.
                </p>

                <div className="creative-scroll-actions" />
              </div>
            </div>
          </div>

          {/* Right side cards */}
          <div
            className="hidden flex-col gap-4 md:flex"
            style={{
              width: `${sideWidth}%`,
              opacity: sideOpacity,
              transform: `translate3d(${rightMove}%, 0, 0)`,
              willChange: "transform, opacity, width",
            }}
          >
            {rightCreativityImages.map((src) => (
              <CreativityImageCard key={src} src={src} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CreativityImageCard({ src }: { src: string }) {
  return (
    <div className="creative-scroll-image-card">
      <Image
        src={src}
        alt="Dhoom creative campaign visual"
        fill
        className="object-cover"
        sizes="23vw"
      />
      <div className="creative-scroll-image-glow" />
    </div>
  )
}
