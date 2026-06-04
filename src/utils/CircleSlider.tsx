"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";

// Animation Variants for consistency
const textFade = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -5 },
  transition: { duration: 0.3 }
};

export default function CircularManagement({ data, props }: any) {
  const [active, setActive] = useState(0);

  const circularData = [
    {
      id: "source",
      label: "Source",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M7 7l3-3 3 3m0 10l-3 3-3-3m10-5h3m-17 0h3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 4v16m-8-8h16" opacity="0.2" />
          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "Responsible sourcing of raw materials aligned with operational efficiency and compliance standards.",
      approach: "Circularity is embedded into operational processes through structured material management, by-product utilisation, and responsible resource optimisation across facilities.",
      performance: "Efforts are directed towards reducing landfill dependence, improving recovery rates, and enhancing water stewardship across plants."
    },
    {
      id: "produce",
      label: "Produce",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 21h18M3 7v14m18-14v14M3 7l6-4 6 4 6-4v14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      description: "Optimizing production cycles to minimize waste and maximize the lifecycle of industrial components.",
      approach: "Our production philosophy focuses on 'Lean Manufacturing' principles, ensuring that every kilowatt of energy and liter of water is accounted for.",
      performance: "We have achieved a 12% reduction in greenhouse gas emissions intensity per unit produced over the last 24 months."
    },
    {
      id: "recover",
      label: "Recover",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M7 11l5-5m0 0l5 5m-5-5v12" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        </svg>
      ),
      description: "Implementing advanced recovery systems to capture and repurpose industrial by-products efficiently.",
      approach: "Recovery systems are integrated directly into our exhaust and filtration units to capture heat and particulate matter for reuse.",
      performance: "Currently recovering 85% of process heat, which is diverted back into our facility heating systems, saving significant energy costs."
    },
    {
      id: "reuse",
      label: "Reuse",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      description: "Closing the loop by reinjecting recovered materials back into the primary production stream.",
      approach: "We utilize a 'Closed-Loop' logistics model where packaging and scrap materials are returned to the start of the manufacturing line.",
      performance: "Our 'Zero Waste to Landfill' initiative has successfully diverted 4,000 tons of material back into production this year alone."
    },
    {
      id: "monitor",
      label: "Monitor",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      description: "Continuous real-time tracking of resource flows to ensure transparency and compliance with global standards.",
      approach: "Digital twins and IoT sensors provide 24/7 visibility into resource consumption patterns across all global manufacturing sites.",
      performance: "Real-time monitoring has allowed us to identify and fix leaks in our pressurized systems within minutes, reducing fluid loss by 30%",
      details: [
        { label: "Our Approach", desc: "Digital twins and IoT sensors provide 24/7 visibility into resource consumption patterns across all global manufacturing sites." },
        { label: "Performance Focus", desc: "Real-time monitoring has allowed us to identify and fix leaks in our pressurized systems within minutes, reducing fluid loss by 30%." }
      ]
    }
  ];

  const circularData1 = useMemo(() => {
    const childrenArray = React.Children.toArray(data);
    if (childrenArray.length === 0) return circularData;

    const result: any[] = [];

    childrenArray.forEach((child) => {
      if (!React.isValidElement(child) || (child.type as any) !== "item") return;

      const itemProps = (child.props as any) || {};
      const childElements = React.Children.toArray(itemProps.children);

      const iconNode = childElements.find(
        (c) => React.isValidElement(c) && (c.type as any) === "icon"
      );

      const sections = childElements
        .filter((c) => React.isValidElement(c) && (c.type as any) === "section")
        .map((section) => {
          if (!React.isValidElement(section)) return null;
          const sProps = section.props as any;
          return {
            label: sProps["data-type"],
            desc: React.Children.toArray(sProps.children).join(""),
          };
        })
        .filter(Boolean);

      result.push({
        id: itemProps["data-id"],
        label: itemProps["data-label"],
        description: itemProps["data-description"],
        icon: React.isValidElement(iconNode)
          ? (iconNode.props as any).children
          : null,
        details: sections,
      } as any);
    });

    return result;
  }, [data]);

  // Static content — all childdescription siblings collected independently of active state
  const childDescriptions = useMemo(() => {
    const childrenArray = React.Children.toArray(data);
    return childrenArray
      .filter((child) => React.isValidElement(child) && (child.type as any) === "childdescription")
      .map((child) => React.isValidElement(child) ? (child.props as any).children : null);
  }, [data]);

  const activeData = circularData1[active] || circularData[active];
  // --- Navigation Logic ---
  const handleNext = () => {
    setActive((prev) => (prev + 1) % circularData1.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + circularData1.length) % circularData1.length);
  };

  return (
    <div className="commonSection-md v2 pb-0">
      <div className="container custom-container">
        <div className="row">
          <div className="col-12 col-md-11">
            <div className="hw mb-40">
              <div className="c-heading-60 clr-gray ft_regular lh_1-1">{props?.sectitle}</div>
            </div>
            <div className="genric__content">
              <p className="c-content-24 clr-gray ft_light lh_1-6 mb-0 width-1050">
                {props?.secdesc}
              </p>
            </div>
          </div>
          <div className="col-12 col-md-1 mt-5 mt-md-0 ">
            <div className="w-100 h-100 position-relative">
              <div className="controls circle-control c-circle-btn">
                <button
                  className="c-btn"
                  id="circleprevBtn"
                  onClick={handlePrev}
                >
                  <span className="icon"><svg width="11" height="21" viewBox="0 0 11 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 20.5L0.93997 11.4999C0.353346 10.9476 0.353346 10.0524 0.93997 9.50014L10.5 0.5" stroke="#A1A1A1" stroke-linecap="round" />
                  </svg>
                  </span>
                </button>
                <button
                  className="c-btn"
                  id="circlenextBtn"
                  onClick={handleNext}
                >
                  <span className="icon"><svg width="11" height="21" viewBox="0 0 11 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 20.5L0.93997 11.4999C0.353346 10.9476 0.353346 10.0524 0.93997 9.50014L10.5 0.5" stroke="#A1A1A1" stroke-linecap="round" />
                  </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-80 overflow-hidden commonSection-md v2 pt-0">
          {props?.twocol == "true" ? (<>

            <div className="col-12 col-lg-6 cus-order-2">
              {/* Static Child Descriptions */}
              {childDescriptions.length > 0 && (
                <div className="row mt-3 mt-lg-5">
                  {childDescriptions.map((desc, i) => (
                    <div key={i} className="col-12">
                      {desc}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="col-12 col-lg-6 cus-order-1">
              <div className="circle-wrapper newCircleWrapper">
                {/* Header Section */}

                <div className="circle-container">
                  <div className="circle-border"></div>

                  {circularData1.map((item, index) => {
                    // Divide 360° evenly by the actual number of items
                    // radius=40 matches the 10% inset border in .newCircleWrapper
                    const angle = (index * (360 / circularData1.length)) - 90;
                    const radius = 40;
                    const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                    const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

                    // Quadrant class so CSS can flip label position per side
                    const posClass =
                      y < 30 ? "pos-top"
                        : y > 70 ? "pos-bottom"
                          : x > 50 ? "pos-right"
                            : "pos-left";

                    return (
                      <div
                        key={item.id}
                        className={`item ${posClass} ${index === active ? "active" : ""}`}
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,

                        }}
                        onMouseEnter={() => setActive(index)}
                      >
                        <div className="icon-box">{item.icon}</div>
                        <span className="label">{item.label}</span>
                      </div>
                    );
                  })}

                  <div className="center-content c-content-18 clr-gray ft_medium lh_1-6">
                    <AnimatePresence mode="wait">
                      <motion.p key={active} {...textFade}>
                        {activeData?.description}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Content */}
              {
                activeData?.details?.length > 0 && (
                  <div className="row mt-3 mt-lg-5">
                    <div className="col-12 col-md-6 col-lg-5">
                      <h4 className="c-content-32 clr-gray ft_medium mb-3 mb-lg-4">{activeData?.details?.[0]?.label}</h4>
                      <AnimatePresence mode="wait">
                        <motion.p key={active} {...textFade} className="text-muted c-content-20 clr-gray ft_light lh_1-6">
                          {activeData?.details?.[0]?.desc}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                    <div className="col-12 col-md-6 col-lg-5 offset-lg-2">
                      <h4 className="c-content-32 clr-gray ft_medium mb-3 mb-lg-4">{activeData?.details?.[1]?.label}</h4>
                      <AnimatePresence mode="wait">
                        <motion.p key={active} {...textFade} className="text-muted c-content-20 clr-gray ft_light lh_1-6">
                          {activeData?.details?.[1]?.desc}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                )}
            </div>

          </>) : (<>
            <div className="col-12">
              <div className="circle-wrapper">
                {/* Header Section */}

                <div className="circle-container">
                  <div className="circle-border"></div>

                  {circularData1.map((item, index) => {
                    // Logic: Calculate position on a 100% scale
                    // 35 is the radius (as a percentage of the container)
                    const angle = (index * (360 / circularData.length)) - 90;
                    const radius = 35;
                    const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                    const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

                    return (
                      <div
                        key={item.id}
                        className={`item ${index === active ? "active" : ""}`}
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,

                        }}
                        onMouseEnter={() => setActive(index)}
                      >
                        <div className="icon-box">{item.icon}</div>
                        <span className="label">{item.label}</span>
                      </div>
                    );
                  })}

                  <div className="center-content c-content-32 clr-gray ft_light lh_1-6">
                    <AnimatePresence mode="wait">
                      <motion.p key={active} {...textFade}>
                        {activeData?.description}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Content */}
              {
                activeData?.details?.length > 0 && (
                  <div className="row mt-3 mt-lg-5">
                    <div className="col-12 col-md-6 col-lg-5">
                      <h4 className="c-content-32 clr-gray ft_medium mb-3 mb-lg-4">{activeData?.details?.[0]?.label}</h4>
                      <AnimatePresence mode="wait">
                        <motion.p key={active} {...textFade} className="text-muted c-content-20 clr-gray ft_light lh_1-6">
                          {activeData?.details?.[0]?.desc}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                    <div className="col-12 col-md-6 col-lg-5 offset-lg-2">
                      <h4 className="c-content-32 clr-gray ft_medium mb-3 mb-lg-4">{activeData?.details?.[1]?.label}</h4>
                      <AnimatePresence mode="wait">
                        <motion.p key={active} {...textFade} className="text-muted c-content-20 clr-gray ft_light lh_1-6">
                          {activeData?.details?.[1]?.desc}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                )}
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
}