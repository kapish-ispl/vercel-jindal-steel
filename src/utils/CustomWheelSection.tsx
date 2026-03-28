"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

export default function CustomWheelSection({ children }: any) {

  const heroRef = useRef<HTMLDivElement | null>(null)
  const wheelRef = useRef<HTMLImageElement | null>(null)
  const logoRef = useRef<HTMLImageElement | null>(null)
  const esgRef = useRef<HTMLDivElement | null>(null)

  const scaleValue = useRef<number>(1) // ✅ FIX

  useGSAP(() => {

    scaleValue.current = Math.max(window.innerWidth, window.innerHeight) / 250

    gsap.set(logoRef.current, { opacity: 0, scale: 1 })
    gsap.set(esgRef.current, { opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "+=150%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    })

    /* 1️⃣ Wheel rotate + scale zoom (fades to 0 at limit) */
    tl.to(wheelRef.current, {
      rotation: 720,
      scale: scaleValue.current,
      ease: "none",
      duration: 1
    })
      .to(wheelRef.current, {
        opacity: 0,
        duration: 0.3
      }, "-=0.3")

    /* 2️⃣ Logo scale + pulse fade (fades to 0 at limit) */
    tl.to(logoRef.current, {
      scale: 3,
      ease: "power2.out",
      duration: 1
    }, "-=0.3")
      .to(logoRef.current, {
        opacity: 1,
        duration: 0.5
      }, "-=1.0")
      .to(logoRef.current, {
        opacity: 0,
        duration: 0.5
      }, "-=0.5")

    /* 3️⃣ Show ESG content */
    tl.to(esgRef.current, {
      opacity: 1,
      duration: 0.5
    })


  }, { scope: heroRef })

  return (
    <section ref={heroRef} className="hero c-whellsection">

      <img
        ref={wheelRef}
        src="/images/logo/wheel-logo.png"
        className="c-whellsection__wheel"
        alt="Wheel"
      />

      <img
        ref={logoRef}
        src="/images/logo/wheel-logo.svg"
        className="c-whellsection__logo"
        alt="Logo"
      />

      <div
        ref={esgRef}
        className="container c-whellsection__content"
      // style={{ opacity: 0 }}
      >
        {children}
      </div>

    </section>
  )
}