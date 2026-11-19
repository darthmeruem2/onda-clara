"use client"

import { useEffect, useRef, type ReactNode } from "react"

export default function CampaignMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scope = root.current
    if (!scope || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return

    let active = true
    let cleanup: (() => void) | undefined

    void Promise.all([import("gsap"), import("gsap/dist/ScrollTrigger")])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (!active) return

        gsap.registerPlugin(ScrollTrigger)
        const media = gsap.matchMedia()
        media.add("(prefers-reduced-motion: no-preference)", () => {
          const editorial = scope.querySelector("[data-editorial]")
          const title = scope.querySelector("[data-editorial-title]")
          const photos = scope.querySelectorAll("[data-editorial-photo]")

          if (window.scrollY < 50) {
            gsap.timeline({ defaults: { ease: "power3.out" } })
              .from("[data-intro-line]", { yPercent: 60, opacity: 0.45, duration: 0.72, stagger: 0.08, clearProps: "opacity,transform" }, 0)
              .from("[data-intro-photo]", { y: 18, opacity: 0.72, duration: 0.8, clearProps: "opacity,transform" }, 0)
              .from("[data-intro-copy]", { y: 10, opacity: 0.65, duration: 0.52, stagger: 0.05, clearProps: "opacity,transform" }, 0.12)
          }

          if (editorial && title) {
            gsap.from(title, {
              y: 18,
              opacity: 0.65,
              duration: 0.65,
              ease: "power2.out",
              clearProps: "transform,opacity",
              scrollTrigger: { trigger: editorial, start: "top 86%", once: true },
            })
            gsap.fromTo(photos, { scale: 1.055, yPercent: 1.7 }, {
              yPercent: -1.7,
              ease: "none",
              scrollTrigger: { trigger: editorial, start: "top bottom", end: "bottom top", scrub: true },
            })
          }
        }, scope)

        cleanup = () => media.revert()
      })
      .catch(() => {})

    return () => {
      active = false
      cleanup?.()
    }
  }, [])

  return <div ref={root}>{children}</div>
}
