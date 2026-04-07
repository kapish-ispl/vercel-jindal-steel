'use client'

import React, { useMemo, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TimeLineSection = ({ data }: any) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const trackBgRef = useRef<HTMLDivElement>(null)
  const [tWidth, setTWidth] = useState<number>(0)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [totalItems, setTotalItems] = useState([0]) // This will be dynamically updated
  const slides = useMemo(() => {
    if (!data) return [];

    return React.Children.toArray(data)
      .filter(
        (child): child is React.ReactElement<any> =>
          React.isValidElement(child) &&
          typeof (child.props) !== "undefined"
      )
      .map((child, index) => ({
        id: index + 1,
        className: child.props.className,
        children: child.props.children,
      }));
  }, [data]);
  useGSAP(() => {
    const section = sectionRef.current
    const timeline = timelineRef.current
    const progressBar = progressBarRef.current
    const trackBg = trackBgRef.current
    if (!section || !timeline) return

    const items = gsap.utils.toArray<HTMLElement>('.c-timeline__item', timeline)
    const images = gsap.utils.toArray<HTMLElement>('.c-timeline__item-img img', timeline)

    // Update dots count to match timeline items
    if (items.length !== totalItems.length) {
      setTotalItems(new Array(items.length).fill(0))
    }

    // Separate odd (1st, 3rd, …) and even (2nd, 4th, …) items
    const oddItems = items.filter((_, i) => i % 2 === 0)   // index 0, 2, 4 → odd cards
    const evenItems = items.filter((_, i) => i % 2 !== 0)  // index 1, 3, 5 → even cards

    // Calculate how far to scroll horizontally
    const getScrollAmount = () => {
      const timelineWidth = timeline.scrollWidth
      const windowWidth = window.innerWidth
      // Adding a little extra padding at the end for visual breathing room
      return -(timelineWidth - windowWidth + 200)
    }

    setTWidth(timeline.scrollWidth)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        // scroll duration tied to how long the horizontal content is
        end: () => `+=${timeline.scrollWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true, // recalculate on resize
        onUpdate: (self) => {
          // Update a css variable on the section for how much we have scrolled
          section.style.setProperty('--scroll-progress', self.progress.toString())
          section.style.setProperty('height', '900px')
          section.style.setProperty('max-height', '900px')
        }
      }
    })

    // 1. Horizontal scroll
    tl.to(timeline, {
      x: getScrollAmount,
      ease: "none"
    }, 0)

    // 2. Odd cards move UPWARD
    tl.to(oddItems, {
      y: -100,
      ease: "none"
    }, 0)

    // 3. Even cards move DOWNWARD
    tl.to(evenItems, {
      y: 100,
      ease: "none"
    }, 0)

    // 4. Parallax images
    tl.fromTo(images,
      { y: -30 },
      { y: 30, ease: "none" },
      0)

    // 5. Scrollbar sync
    if (progressBar) {
      tl.to(progressBar, {
        width: '100%',
        ease: "none"
      }, 0)
    }

    // 6. Dot sync
    // Using CSS variables via onUpdate is much more accurate than a linear staggered animation 
    // to sync the dots directly with the progress bar's exact location.

    // 7. Track background scroll
    if (trackBg) {
      const getTrackScrollAmount = () => {
        const trackWidth = trackBg.scrollWidth
        const windowWidth = window.innerWidth
        const offset = trackWidth - windowWidth + 100 // Extra 100px so it scrolls slightly past the edge
        return offset > 0 ? -offset : 0
      }
      tl.to(trackBg, {
        x: getTrackScrollAmount,
        ease: "none"
      }, 0)
    }

  }, { scope: sectionRef })


  return (
    <>
      <div className='container cus-container'>
        <div className="row">
            <div className="col-12">
              <div className="hw" data-aos="fade-up" data-aos-duration="1000">
                  <div className="clr-peach c-heading-50 mt-5 text-center text-uppercase ft_regular">Key Milestones</div>
                </div>
              </div>
            </div>
      </div>
      <div className="commonSection-lg overflow-hidden p-0" ref={sectionRef}>
        <div className="container cus-container me-0">
          
          <div className="row">
            <div className="col-12">
              <div className="c-timeline" ref={timelineRef} style={{ flexWrap: 'nowrap', width: 'max-content', paddingRight: '20vw' }}>
                {slides.map((slide) => (
                  <div key={slide.id} className={slide.className} >
                    {slide.children}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="timeline-scrollbar-wrapper">
          <div className="timeline-track-bg" ref={trackBgRef} style={{ width: 'max-content', minWidth: '100%', paddingRight: '50px' }}>
            <div ref={progressBarRef} className="timeline-progress-fill"></div>

            <div className="timeline-nodes-container d-flex" style={{ justifyContent: 'space-between' }}>
              {totalItems.map((_, i) => (
                <div key={i} className="dot-wrapper" style={{ zIndex: 2, minWidth: '200px', '--threshold': (totalItems.length > 1 ? Math.min(0.99, i / (totalItems.length - 1)) : 0) } as React.CSSProperties}>
                  <div className="timeline-dot-inner"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TimeLineSection
