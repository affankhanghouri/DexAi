"use client"

import { useEffect } from "react"

export default function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll(".dhoom-reveal")
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible")
          observer.unobserve(e.target)
        }
      }),
      { rootMargin: "0px 0px 12% 0px", threshold: 0.08 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return null
}
