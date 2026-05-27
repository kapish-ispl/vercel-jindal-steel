"use client";
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const dataSets: Record<string, { data: number[]; label: string }> = {
    "2024-25": { data: [48932, 43097, 6161], label: "43,097 Cr" },
    "2023-24": { data: [45000, 40000, 5000], label: "40,000 Cr" }
};

export default function CustomValueChart() {
    const [selectedYear, setSelectedYear] = useState("2024-25");
    const currentData = dataSets[selectedYear];

    const data = {
        labels: ['Total Income', 'Total Expenses', 'Profit Retained'],
        datasets: [{
            data: currentData.data,
            backgroundColor: ['#f58220', '#4caf50', '#37474f'],
            borderRadius: 4,
            barThickness: 100,      // Controls width of bars
            minBarLength: 120,      // Force the height of shorter bars (like Profit Retained)
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { tooltip: { enabled: true } },
        scales: {
            y: {
                display: false,
                beginAtZero: true,
                max: 55000           // Ensures consistent visual scale
            },
            x: {
                grid: { display: false }
            }
        }
    };

    return (
        <>
            <div className="row">
                <div className="col-12 col-lg-4">
                    <div style={{ maxWidth: '575px', width: '100%' }}>
                        <select onChange={(e) => setSelectedYear(e.target.value)} value={selectedYear}>
                            <option value="2024-25">FY 2024-25</option>
                            <option value="2023-24">FY 2023-24</option>
                        </select>

                        <div style={{ height: '300px', marginTop: '20px' }}>
                            <Bar data={data} options={options} />
                        </div>


                    </div>

                </div>
                <div className="col-12 col-lg-7 offset-lg-1">
                    <div className="data__wrapper">
                        <h2 className='clr-primary ft_medium lh_1-2'>₹{currentData.label}</h2>
                        <p>Value distributed across operations & stakeholders</p>

                    </div>
                </div>
            </div>
        </>
    );
}