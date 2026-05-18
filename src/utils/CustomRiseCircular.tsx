"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface RiseSection {
  id: string;
  title: string;
  color: string;
  icon: string;
  iconX: number;
  iconY: number;
  items: string[];
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

const sections: RiseSection[] = [
  {
    id: "governance",
    title: "Responsible Governance",
    color: "#636466",
    icon: "https://docs.jindalsteel.in/document/124/1779098474_da48325fcd0098e38496f14770729db1aacc52f8.png",
    iconX: 53.5,
    iconY: 43.5,
    position: "top-left",
    items: ["Economic Value Creation", "Business Ethics & Integrity", "Risk Management", "Corporate Governance"],
  },
  {
    id: "growth",
    title: "Inclusive Growth",
    color: "#F47920",
    icon: "https://docs.jindalsteel.in/document/124/1779098473_04d52abe44ec846ab62116a939d6abbc24f4e73a.png",
    iconX: 156.5,
    iconY: 43.5,
    position: "top-right",
    items: ["Occupational Health & Safety", "Employee Development & Talent Retention", "Local Communities", "Human Rights & Labour Practices"],
  },
  {
    id: "environment",
    title: "Sustainable Environment",
    color: "#4FB848",
    icon: "https://docs.jindalsteel.in/document/124/1779098473_6eec09db9878bbd852b7fc7b8f7df147a4c224ab.png",
    iconX: 156.5,
    iconY: 156.5,
    position: "bottom-right",
    items: ["Sustainable Environment", "Climate Change & GHG Emissions", "Waste & Circular Economy", "Air Emissions", "Biodiversity & Water Conservation"],
  },
  {
    id: "partnerships",
    title: "Ethical Partnerships",
    color: "#446183",
    icon: "https://docs.jindalsteel.in/document/124/1779098473_acc9d2336fdc8c13c3b753d0dd6b9ec2c68123b0.png",
    iconX: 43.5,
    iconY: 156.5,
    position: "bottom-left",
    items: ["Product Stewardship", "Supply Chain Management", "Technology and Innovation"],
  },
];

export default function CustomRiseCircular() {
  const [activeTab, setActiveTab] = useState<string>(sections[1].id);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const displayedTab = hoveredTab || activeTab;

  return (
    <section className="wrapper c-riseContainer ">
      <div className="container">
        <div className="circleContainer">
          <svg viewBox="0 0 200 200" className="svgLayout">
            {/* Quadrant Segments */}
            <Segment
              path="M 100,100 L 20,100 A 80,80 0 0,1 100,20 Z"
              section={sections[0]}
              onHover={setHoveredTab}
              onClick={setActiveTab}
              isActive={activeTab === sections[0].id}
              isHovered={hoveredTab === sections[0].id}
            />
            <Segment
              path="M 100,100 L 100,20 A 80,80 0 0,1 180,100 Z"
              section={sections[1]}
              onHover={setHoveredTab}
              onClick={setActiveTab}
              isActive={activeTab === sections[1].id}
              isHovered={hoveredTab === sections[1].id}
            />
            <Segment
              path="M 100,100 L 180,100 A 80,80 0 0,1 100,180 Z"
              section={sections[2]}
              onHover={setHoveredTab}
              onClick={setActiveTab}
              isActive={activeTab === sections[2].id}
              isHovered={hoveredTab === sections[2].id}
            />
            <Segment
              path="M 100,100 L 100,180 A 80,80 0 0,1 20,100 Z"
              section={sections[3]}
              onHover={setHoveredTab}
              onClick={setActiveTab}
              isActive={activeTab === sections[3].id}
              isHovered={hoveredTab === sections[3].id}
            />

            <circle cx="100" cy="100" r="60" fill="white" />
            <text x="100" y="105" textAnchor="middle" className="centerRiseText">
              <tspan fill="#636466">R.</tspan>
              <tspan fill="#F47920">I.</tspan>
              <tspan fill="#4FB848">S.</tspan>
              <tspan fill="#446183">E.</tspan>
            </text>
          </svg>
        </div>

        {sections.map((section) => (
          <div key={section.id} className={`boxWrapper ${section.position} ${displayedTab === section.id ? 'active-box' : 'inactive-box'}`}>
            <motion.div
              initial={false}
              animate={{
                opacity: displayedTab === section.id ? 1 : 0,
                scale: displayedTab === section.id ? 1 : 0.95,
                pointerEvents: displayedTab === section.id ? "auto" : "none",
              }}
              className="contentBox"
            >
              <div className="header" style={{ borderBottom: `2px solid ${section.color}` }}>
                <h3 style={{ color: section.color }}>{section.title}</h3>
              </div>
              <ul className="list">
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}

const Segment = ({ path, section, onHover, onClick, isActive, isHovered }: any) => {
  const isHighlighted = isActive || isHovered;
  const isUrl = section.icon.startsWith("http");

  return (
    <g
      onMouseEnter={() => onHover(section.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(section.id)}
      style={{ cursor: "pointer" }}
    >
      <motion.path
        d={path}
        fill={section.color}
        animate={{ opacity: isHighlighted ? 1 : 0.8, scale: isHighlighted ? 1.05 : 1 }}
        style={{ transformOrigin: "center" }}
      />

      {isUrl ? (
        <motion.image
          href={section.icon}
          x={section.iconX - 12} // Adjusted slightly for visual balance
          y={section.iconY - 12}
          height="24"
          width="24"
          preserveAspectRatio="xMidYMid meet"
          style={{ pointerEvents: "none" }}
        />
      ) : (
        <motion.text
          x={section.iconX}
          y={section.iconY}
          fill="white"
          fontSize="14"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ pointerEvents: "none" }}
        >
          {section.icon}
        </motion.text>
      )}
    </g>
  );
};