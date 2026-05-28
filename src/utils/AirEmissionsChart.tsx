"use client";

import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Mock data matching the UI mockup
const emissionData: Record<string, number[]> = {
  SOx: [39421, 36136, 33500, 37800],
  NOx: [28500, 31000, 29500, 32000],
  ODS: [12000, 14500, 13000, 15000],
};

const labels = ['FY 2024-25', 'FY 2023-24', 'FY 2022-23', 'FY 2021-22'];

export default function AirEmissionsChart() {
  const [activeTab, setActiveTab] = useState<'SOx' | 'NOx' | 'ODS'>('SOx');

  const data = {
    labels: labels,
    datasets: [
      {
        data: emissionData[activeTab],
        backgroundColor: '#d78e5e', // Terracotta color (--color-accent-peach)
        hoverBackgroundColor: '#c27e51', // Slightly darker for hover feedback
        borderRadius: {
          topLeft: 4,
          topRight: 4,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
        maxBarThickness: 65,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { family: 'inherit', size: 14 },
        bodyFont: { family: 'inherit', size: 13 },
        padding: 10,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          label: (context: any) => ` Emissions: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#636466',
          font: {
            family: 'inherit',
            size: 12,
            weight: 300 as const,
          },
          padding: 10,
        },
      },
      y: {
        min: 0,
        max: 39421,
        border: {
          display: false,
        },
        grid: {
          color: 'rgba(195, 204, 206, 0.3)', // Thin and light horizontal gridlines
          drawBorder: false,
        },
        afterBuildTicks: (axis: any) => {
          // Exactly matches the tick numbers from the user's mockup image
          axis.ticks = [0, 6570, 13140, 19711, 26281, 32851, 39421].map((v) => ({ value: v }));
        },
        ticks: {
          color: '#a1a1a1',
          font: {
            family: 'inherit',
            size: 11,
          },
          padding: 10,
        },
      },
    },
  };

  return (
    <>
      <div className="air-emissions-tabs-container">
        <div className="air-emissions-tabs">
          {(['SOx', 'NOx', 'ODS'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              className={`air-emissions-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="air-emissions-chart-canvas-wrapper">
        <Bar data={data} options={options} />
      </div>
    </>
  );
}
