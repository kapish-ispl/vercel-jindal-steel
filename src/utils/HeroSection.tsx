"use client";
import React from "react";
import { useState, useEffect, useMemo } from "react";

export default function HeroSection({ data, title }: any) {
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
        title: child.props.title,
        list: child.props.list,
        img: child.props.imgsrc,

      }));
  }, [data]);
  console.log(menuItems);

  useEffect(() => {
    const interval = setInterval(() => {
      if (menuItems.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % menuItems.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [menuItems.length]);

  return (
    <section className="hero-container">
      {/* Background Images */}
      {menuItems.map((item: any, index: number) => (
        <div
          key={index}
          className={`hero-slide ${index === currentIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${item.img})` }}
        />
      ))}

      {/* Overlay Text Container */}
      <div className="container cus-container position-relative h-100">
        <div className="row">
          <div className="col-12">
            <div className="hero-overlay-wrapper">
              <div className="hero-card">
                <h2 className="hero-title c-heading-40 ft_SemiBold lh_1-4 clr-white mb-40">
                  {title}
                </h2>

                <div className="hero-nav">
                  {menuItems.map((item, index) => (
                    <div
                      key={index}
                      className={`hero-nav-item ${index === currentIndex ? "active" : ""}`}
                      onMouseEnter={() => setCurrentIndex(index)}
                      onClick={() => setCurrentIndex(index)}
                    >
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