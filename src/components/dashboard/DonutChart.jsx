import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const CHART_COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-5))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-2))',
];

const RADIUS = 70;
const STROKE = 22;

const DonutChart = ({ data, centerLabel, centerValue }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.4 });
    const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

    let cumulative = 0;
    const segments = data.map((d, i) => {
        const fraction = d.value / total;
        const segment = { ...d, fraction, offsetFraction: cumulative, color: CHART_COLORS[i % CHART_COLORS.length] };
        cumulative += fraction;
        return segment;
    });

    return (
        <div ref={ref} className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative h-44 w-44 shrink-0">
                <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
                    <circle cx="90" cy="90" r={RADIUS} fill="none" strokeWidth={STROKE} className="stroke-muted" />
                    {segments.map((seg, i) => (
                        <motion.circle
                            key={seg.label}
                            cx="90"
                            cy="90"
                            r={RADIUS}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth={STROKE}
                            strokeLinecap="butt"
                            pathOffset={seg.offsetFraction}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: isInView ? seg.fraction : 0 }}
                            transition={{ duration: 0.9, delay: 0.12 * i, ease: 'easeOut' }}
                        />
                    ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-headingFont text-2xl font-bold text-foreground">{centerValue}</span>
                    <span className="text-[11px] text-muted-foreground">{centerLabel}</span>
                </div>
            </div>
            <ul className="w-full space-y-2.5">
                {segments.map((seg) => (
                    <li key={seg.label} className="flex items-center justify-between gap-3 text-sm">
                        <span className="flex items-center gap-2 text-foreground/80">
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: seg.color }} />
                            <span className="capitalize">{seg.label}</span>
                        </span>
                        <span className="shrink-0 font-semibold text-foreground">{Math.round(seg.fraction * 100)}%</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DonutChart;
