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

  useGSAP(() => {

    const calculateScale = () => {
      const max = Math.max(window.innerWidth, window.innerHeight)
      return max / 250
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "+=150%",
        scrub: true,
        pin: true,
        anticipatePin: 1
      }
    })

    /* 1️⃣ Wheel rotate + zoom */
    tl.to(wheelRef.current, {
      rotation: 720,
      scale: calculateScale(),
      ease: "none",
      duration: 1
    })

    /* 2️⃣ Logo fade + grow */
    tl.to(logoRef.current, {
      opacity: 1,
      scale: 3,
      ease: "power2.out",
      duration: 1
    }, "-=0.5")

    /* 3️⃣ Remove wheel + logo */
    tl.to([wheelRef.current, logoRef.current], {
      opacity: 0,
      duration: 0.5
    })

    /* 4️⃣ Show ESG content */
    tl.to(esgRef.current, {
      opacity: 1,
      duration: 0.5
    })

  }, { scope: heroRef })


  return (
    <section ref={heroRef} className="hero c-whellsection">

      <img
        ref={wheelRef}
        src="/images/logo/wheel.svg"
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
        style={{ opacity: 0 }}
      >
        {children}
      </div>

    </section>
  )
}