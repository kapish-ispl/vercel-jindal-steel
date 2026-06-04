'use client'

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface ProgressBarProps {
    label?: string;
    value?: number;
    max?: number;
    unit?: string;
    color?: string;
    duration?: number;
    className?: string;
}

export default function ProgressBar({
    label = 'Waste Recycled | FY 2024–25',
    value = 78.8,
    max = 100,
    unit = '%',
    color = '#D78E5E',
    duration = 1200,
    className = '',
}: ProgressBarProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });
    const [width, setWidth] = useState(0);
    const percentage = (value / max) * 100;

    useEffect(() => {
        if (isInView) {
            const timeout = setTimeout(() => {
                setWidth(percentage);
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [isInView, percentage]);

    return (
        <div ref={ref} className={`c-progress-bar ${className}`}>
            <div className="c-progress-bar__header">
                <span className="c-progress-bar__label c-content-24 ft_medium lh_1-6 clr-gray mb-3">{label}</span>
                <span className="c-progress-bar__value">
                    {value}{unit} / {max}{unit}
                </span>
            </div>
            <div className="c-progress-bar__track">
                <div
                    className="c-progress-bar__fill"
                    style={{
                        width: `${width}%`,
                        backgroundColor: color,
                        transition: `width ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
                    }}
                />
            </div>
        </div>
    );
}
