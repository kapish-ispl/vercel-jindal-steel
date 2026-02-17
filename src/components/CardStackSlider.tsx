"use client";

import React, { useEffect, useRef, useState } from "react";

type Card = {
  id: number;
  content: string;
  videourl?: string;
  imageurl?: string;
  totalCards?: number
};

// const cardData: Card[] = [
//   {
//     id: 1,
//     content:
//       "India's Only SynGas-based Coal Gasification Plant for Steel Making",
//     videourl:
//       "https://docs.jindalsteel.in/document/124/1765533013_CoalGasificationPlant.mp4",
//   },
//   {
//     id: 2,
//     content:
//       "India's Only Producer of the Widest Plates in Coil Form",
//     videourl:
//       "https://docs.jindalsteel.in/document/124/1765176612_WidestPlatesinCoil.mp4",
//   },
//   {
//     id: 3,
//     content:
//       "India’s Only Private Player In Rail Manufacturing",
//     videourl:
//       "https://docs.jindalsteel.in/document/124/1765532941_RailManufacturing.mp4",
//   },
//   {
//     id: 4,
//     content:
//       "India’s First Largest Blast Furnace - 4.25 MTPA",
//     videourl:
//       "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1710498881ForWebSite1.mp4",
//   },
//   {
//     id: 5,
//     content:
//       "India’s Only Private Player Producing Fabricated Steel Structures",
//     videourl:
//       "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1710498881ForWebSite1.mp4",
//   },
// ];
const CardItem = React.memo(function CardItem({
  card,
  index,
  activeIndex,
  onClick,
  totalCards,
  videoRef,
}: {
  card: Card;
  index: number;
  activeIndex: number;
  totalCards: number;
  onClick: () => void;
  videoRef: (el: HTMLVideoElement | null) => void;
}) {
  let offset = index - activeIndex;
  if (offset > totalCards / 2) offset -= totalCards;
  else if (offset < -totalCards / 2) offset += totalCards;

  const absOffset = Math.abs(offset);

  const dynamicStyles: React.CSSProperties = {
    "--tx": `${offset * 20}%`,
    "--scale": 1 - absOffset * 0.15,
    "--tz": `-${absOffset * 100}px`,
    "--rotateY": `${offset * -4}deg`,
    "--zIndex": totalCards - absOffset,
    "--bg-image": card.imageurl ? `url(${card.imageurl})` : "none",
  } as React.CSSProperties;

  return (
    <div className="card-item" style={dynamicStyles} onClick={onClick}>
      {card.videourl ? (
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay // ✅ Always true (Safari ignores state changes)
          loop
          className="card-item__background"
        >
          <source src={card.videourl} type="video/mp4" />
        </video>
      ) : (
        <div className="card-item__background" />
      )}
      {index !== activeIndex && <div className="card-item__overlay" />}
    </div>
  );
});

export default function CardStackSlider({ data }: any) {

  const cardData = data
    .filter((items: any) => items.props !== undefined)
    .map((cardItem: any, index: number) => ({
      id: index + 1,
      ...cardItem.props
    }));
  const totalCards = cardData.length;


  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const autoplayInterval = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const resumeAutoplayAfterDelay = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      setIsPaused(false);
    }, 4000);
  };


  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, cardData.length);
    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, []);

  const handleCardClick = (index: number) => {
    setIsPaused(true);
    setActiveIndex(index);
    resumeAutoplayAfterDelay();
  };

  const handlePrev = () => {
    setIsPaused(true);
    setActiveIndex((prev) => (prev - 1 + cardData.length) % cardData.length);
    resumeAutoplayAfterDelay();
  };

  const handleNext = () => {
    setIsPaused(true);
    setActiveIndex((prev) => (prev + 1) % cardData.length);
    resumeAutoplayAfterDelay();
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // ✅ Autoplay loop
  useEffect(() => {
    if (!isPaused) {
      autoplayInterval.current = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % cardData.length);
      }, 5000);
    }
    return () => {
      if (autoplayInterval.current) clearInterval(autoplayInterval.current);
    };
  }, [isPaused]);

  // ✅ Controlled video playback for active card (Safari fix)
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;

      if (i === activeIndex) {
        // 🔄 Force Safari to reload the media pipeline
        video.load();

        const playVideo = async () => {
          try {
            await video.play();
          } catch (err) {
            console.warn(
              "Autoplay blocked on iOS, waiting for user gesture:",
              err
            );
          }
        };

        if (video.readyState >= 2) {
          playVideo();
        } else {
          video.addEventListener("loadeddata", playVideo, { once: true });
        }
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex]);

  return (
    <div className="card-stack-slider-container w-100">
      <div
        className="card-stack-visual"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="card-stack-visual__perspective-root">
          {cardData.map((card: any, i: number) => (
            <CardItem
              key={card.id}
              totalCards={totalCards}
              card={card}
              index={i}
              activeIndex={activeIndex}
              onClick={() => handleCardClick(i)}
              videoRef={(el) => {
                videoRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>

      <div className="card-controls margin-auto">
        <button onClick={handlePrev} className="card-controls__button left">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
            />
          </svg>
        </button>

        <div className="card-controls__content-text">
          <p key={activeIndex} className="animate-fade-in">
            {cardData[activeIndex].content}
          </p>
        </div>

        <button onClick={handleNext} className="card-controls__button right">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
