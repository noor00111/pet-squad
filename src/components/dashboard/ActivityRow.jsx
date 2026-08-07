import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';

const BADGE_TONES = {
    default: 'bg-secondary text-foreground dark:bg-white/10 dark:text-white',
    success: 'bg-emerald-500/15 text-emerald-500',
    warning: 'bg-colorSecondary/15 text-colorSecondary',
    muted: 'bg-muted text-muted-foreground',
};

const ActivityRow = ({ image, icon: Icon, title, subtitle, meta, badge, badgeTone = 'default' }) => (
    <motion.li
        variants={fadeUp}
        className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-secondary/60 dark:hover:bg-white/5"
    >
        {image ? (
            <img src={image} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-border dark:ring-white/10" />
        ) : Icon ? (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-colorSecondary text-primary-foreground">
                <Icon className="h-4 w-4" />
            </span>
        ) : null}
        <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{title}</p>
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className="shrink-0 text-right">
            {meta && <p className="text-xs font-medium text-muted-foreground">{meta}</p>}
            {badge && (
                <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${BADGE_TONES[badgeTone]}`}>
                    {badge}
                </span>
            )}
        </div>
    </motion.li>
);

export default ActivityRow;
