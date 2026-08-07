import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { fadeUp } from '@/lib/motion';

const StatCard = ({ icon: Icon, label, value, prefix = '', suffix = '', trend }) => {
    const [display, setDisplay] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.4 });

    useEffect(() => {
        if (!isInView) return;
        const controls = animate(0, value, {
            duration: 1.1,
            ease: 'easeOut',
            onUpdate: (v) => setDisplay(Math.round(v)),
        });
        return () => controls.stop();
    }, [isInView, value]);

    return (
        <motion.div
            ref={ref}
            variants={fadeUp}
            className="glow-hover flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm dark:border-white/10">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-800 dark:bg-yellow-100 text-primary-foreground shadow-md shadow-primary/20">
                <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
                <p className="font-headingFont text-2xl font-bold text-foreground">{prefix}{display}{suffix}</p>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                {trend && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-500">
                        <TrendingUp className="h-3 w-3" /> {trend}
                    </p>
                )}
            </div>
        </motion.div>
    );
};

export default StatCard;
