"use client";
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import CustomSelect from '@/components/CustomSelect';
import { ChevronDown } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const dataSets: Record<string, { data: number[]; label: string }> = {
    "2024-25": { data: [48932, 43097, 6161], label: "43,097 Cr" },
    "2023-24": { data: [45000, 40000, 5000], label: "40,000 Cr" }
};

export default function CustomValueChart() {
    const [selectedYear, setSelectedYear] = useState("2024-25");
    const [barThickness, setBarThickness] = useState(140);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setWidth(width);
            if (width < 576) {
                setBarThickness(100);
            } else if (width < 992) {
                setBarThickness(80);
            } else {
                setBarThickness(140);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const currentData = dataSets[selectedYear];

    const data = {
        labels: ['Total Income', 'Total Expenses', 'Profit Retained'],
        datasets: [{
            data: currentData.data,
            backgroundColor: ['#f58220', '#4caf50', '#37474f'],
            borderRadius: 4,
            barThickness: barThickness,      // Controls width of bars
            minBarLength: barThickness,      // Force the height of shorter bars (like Profit Retained)
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
                <div className="col-12 col-lg-5">
                    <div style={{ maxWidth: '575px', width: '100%' }}>
                        <CustomSelect
                            icon={<ChevronDown />}
                            options={[
                                { label: 'FY 2024-25', value: '2024-25' },
                                { label: 'FY 2023-24', value: '2023-24' },
                            ]}
                            placeholder="FY 2024-25"
                            paramKey="chart_year"
                            onChange={(val) => val && setSelectedYear(val)}
                        />

                        <div style={{ height: '400px', marginTop: '20px' }}>
                            <Bar data={data} options={options} />
                        </div>


                    </div>

                </div>
                <div className="col-12 col-lg-5 offset-lg-2">
                    <div className="data__wrapper responsive-space-30">
                        <h2 className='clr-primary ft_medium lh_1-2'>₹{currentData.label}</h2>
                        <p>Value distributed across operations & stakeholders</p>

                    </div>
                </div>
            </div>
        </>
    );
}