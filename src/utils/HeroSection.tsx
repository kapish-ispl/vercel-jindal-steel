"use client";
import React from "react";
import { useState, useEffect, useMemo } from "react";

const images = [
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop"
];

// const menuItems = [
//   "Lifestyle & Well-being",
//   "Health & Wellness",
//   "Community & Belonging",
//   "Financial Security (Retirement)",
//   "Financial Flexibility (Active Employees)",
// ];

export default function HeroSection({ data, props }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const menuItems = useMemo(() => {
    if (!data) return [];

    return React.Children.toArray(data)
      .filter(
        (child): child is React.ReactElement<any> =>
          React.isValidElement(child) &&
          typeof (child.props) !== "undefined"
      )
      .map((child, index) => ({
        id: index + 1,
        list: child.props.list,
        img: child.props.imgsrc,

      }));
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-container">
      {/* Background Images */}
      {images.map((src, index) => (
        <div
          key={src}
          className={`hero-slide ${index === currentIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}

      {/* Overlay Text Container */}
      <div className="container cus-container position-relative h-100">
        <div className="row">
          <div className="col-12">
            <div className="hero-overlay-wrapper">
              <div className="hero-card">
                <h2 className="hero-title c-heading-40 ft_SemiBold lh_1-4 clr-white mb-40">
                  {props.title}
                </h2>

                <div className="hero-nav">
                  {menuItems.map((item, index) => (
                    <div key={index} className="hero-nav-item">
                      <span className="item-text c-content-20 ft_regular clr-white lh_1-6">{item.list}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}