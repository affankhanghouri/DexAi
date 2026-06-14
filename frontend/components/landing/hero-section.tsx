"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"

const clamp = (value: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, value))

const easeInOutCubic = (value: number) =>
  value < 0.5 ? 4 * value ** 3 : 1 - Math.pow(-2 * value + 2, 3) / 2

const HERO_TRANSITION_VIEWPORTS = 1.15

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
  const sceneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let animationFrame: number
    let targetProgress = 0
    let currentProgress = 0
    let renderedProgress = -1
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    const calculateProgress = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const scrolled = -rect.top
      const total = window.innerHeight * HERO_TRANSITION_VIEWPORTS

      targetProgress = clamp(scrolled / total)
    }

    const handleScroll = () => {
      calculateProgress()
    }

    const animate = () => {
      const followStrength = prefersReducedMotion ? 1 : 0.34

      currentProgress += (targetProgress - currentProgress) * followStrength

      if (Math.abs(targetProgress - currentProgress) < 0.0008) {
        currentProgress = targetProgress
      }

      if (Math.abs(renderedProgress - currentProgress) > 0.0005) {
        renderedProgress = currentProgress
        const wordProgress = easeInOutCubic(clamp(currentProgress / 0.2))
        const gridProgress = easeInOutCubic(
          clamp((currentProgress - 0.06) / 0.62),
        )
        const copyProgress = easeInOutCubic(
          clamp((currentProgress - 0.14) / 0.5),
        )

        sceneRef.current?.style.setProperty(
          "--hero-word-opacity",
          String(1 - wordProgress),
        )
        sceneRef.current?.style.setProperty(
          "--hero-copy-progress",
          String(copyProgress),
        )
        sceneRef.current?.style.setProperty(
          "--hero-stage-scale-y",
          String(1 - gridProgress * 0.035),
        )
        sceneRef.current?.style.setProperty(
          "--hero-stage-radius",
          `${gridProgress * 28}px`,
        )
        sceneRef.current?.style.setProperty(
          "--hero-stage-inset",
          `${gridProgress * 23}vw`,
        )
        sceneRef.current?.style.setProperty(
          "--hero-side-opacity",
          String(clamp((gridProgress - 0.05) / 0.75)),
        )
        sceneRef.current?.style.setProperty(
          "--hero-left-x",
          `${-115 + gridProgress * 115}%`,
        )
        sceneRef.current?.style.setProperty(
          "--hero-right-x",
          `${115 - gridProgress * 115}%`,
        )
        sceneRef.current?.style.setProperty(
          "--hero-copy-y",
          `${(1 - copyProgress) * 18}px`,
        )
      }

      animationFrame = requestAnimationFrame(animate)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", calculateProgress)

    calculateProgress()
    animate()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", calculateProgress)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[260vh] bg-[#080814] md:min-h-[275vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div ref={sceneRef} className="dhoom-scroll-scene">
          {/* Left side cards */}
          <div className="dhoom-scroll-rail dhoom-scroll-rail-left hidden md:flex">
            {leftCreativityImages.map((src) => (
              <CreativityImageCard key={src} src={src} />
            ))}
          </div>

          {/* Center panel */}
          <div className="dhoom-hero-stage dhoom-scroll-stage relative overflow-hidden">
            <div className="dhoom-soft-aurora" />
            <div className="dhoom-star-dust" />
            <div className="dhoom-energy-ribbon" />

            {/* Hero title — fades out on scroll */}
            <div className="dhoom-scroll-title absolute inset-0 flex items-center justify-center overflow-visible">
              <div className="dhoom-title-stack">
                <p className="dhoom-hero-small-text">apnay products ki</p>

                <h1 className="dhoom-hero-main-word">DHOOM</h1>

                <p className="dhoom-hero-machaao">MACHAO</p>

                <div className="dhoom-hero-action-row">
                  <Link
                    href="/auth"
                    className="dhoom-glow-btn dhoom-glow-btn-purple"
                  >
                    Get Access
                  </Link>

                  <Link
                    href="/dashboard/campaigns/new"
                    className="dhoom-glow-btn dhoom-glow-btn-gold"
                  >
                    Get a free campaign sample
                  </Link>
                </div>
              </div>
            </div>

            {/* Scroll-in creative copy — fades in on scroll */}
            <div
              className="dhoom-scroll-copy-layer absolute inset-0 z-20 flex items-center justify-center px-6 text-center"
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
          <div className="dhoom-scroll-rail dhoom-scroll-rail-right hidden md:flex">
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
