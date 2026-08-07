import React from 'react';
import { motion } from 'framer-motion';
import useCampaignDonations from '@/hooks/useCampaignDonations';

const CampaignProgressBar = ({ campaignId, goal }) => {
    const { raised, isPending } = useCampaignDonations(campaignId);

    if (isPending) {
        return (
            <div className="w-full max-w-xs">
                <div className="h-1.5 w-full animate-pulse rounded-full bg-muted" />
                <div className="mt-2 h-3 w-24 animate-pulse rounded bg-muted" />
            </div>
        );
    }

    const goalNum = Number(goal || 0);
    const percent = goalNum > 0 ? Math.min(100, Math.round((raised / goalNum) * 100)) : 0;

    return (
        <div className="w-full max-w-xs">
            <div className="relative h-1.5 w-full overflow-visible rounded-full bg-muted">
                <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-colorSecondary to-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
                <motion.span
                    initial={{ left: 0, opacity: 0 }}
                    animate={{ left: `${percent}%`, opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute -top-0.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-white bg-colorSecondary shadow"
                />
            </div>
            <p className="mt-2 text-sm font-bold text-foreground">
                {raised.toLocaleString()} / {goalNum.toLocaleString()} <span className="font-semibold text-primary dark:text-colorSecondary"> ({percent}%)</span>
            </p>
            <p className="text-xs text-muted-foreground">Raised so far</p>
        </div>
    );
};

export default CampaignProgressBar;
