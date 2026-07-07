"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new (Lenis as any)({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,  // mouse wheel smooth
      smoothTouch: true,  // touch / mobile smooth
      prevent: (target: EventTarget | null) => {
        try {
          const el = target as Element | null;
          return !!el?.closest?.("[data-lenis-ignore]");
        } catch {
          return false;
        }
      },
    });

    // RAF loop to update Lenis and GSAP ScrollTrigger.
    // The frame ID is stored so it can be cancelled on unmount — without this
    // the recursive loop would keep running after the component is destroyed.
    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      ScrollTrigger.update(); // keep ScrollTrigger in sync
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Cleanup on unmount: stop the loop first, then tear down Lenis
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
