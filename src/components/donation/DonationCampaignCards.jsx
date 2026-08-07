import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { Heart, Users } from 'lucide-react';
import { progressTone } from '@/lib/donation';

const DonationCampaignCards = ({ campaign, raised: raisedProp }) => {
    const goal = Number(campaign.amount || 0);
    const raised = Number(raisedProp || 0);
    const percent = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
    const tone = progressTone(percent);
    const shortDescription = campaign['short description'];

    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="glow-hover relative flex flex-col rounded-3xl border border-border bg-card p-5 pt-4 shadow-sm dark:border-white/10">
            <button
                type="button"
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-muted-foreground shadow-sm transition-colors">
                <motion.span whileTap={{ scale: 1.3 }} className="flex">
                    <Heart className="h-4 w-4 text-purple-600" />
                </motion.span>
            </button>

            <div className="flex items-center gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-colorSecondary shadow-md">
                    <img
                        src={campaign.image}
                        alt={campaign.petName}
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="min-w-0">
                    <h2 className="truncate font-headingFont text-lg font-bold text-foreground">
                        {campaign.petName}
                    </h2>
                    <p className="truncate text-xs text-muted-foreground">
                        {shortDescription || `Help ${campaign.petName} reach their goal`}
                    </p>
                </div>
            </div>

            <div className="mt-5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                        Raised <span className={`font-bold ${tone.text}`}>${raised.toLocaleString()}</span>
                    </span>
                    <span className="text-muted-foreground">
                        Goal <span className="font-semibold text-foreground">${goal.toLocaleString()}</span>
                    </span>
                </div>
                <div className="relative mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${tone.bar}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
                    />
                </div>
                <p className={`mt-1 text-right text-[11px] font-bold ${tone.text}`}>{percent}% funded</p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                        <Users className="h-3.5 w-3.5" /> Supporting {campaign.petName}
                    </span>

                <Link to={`/donationDetails/${campaign._id}`}>
                    <motion.span
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/30 transition-colors hover:bg-primary/90">
                        View Details
                    </motion.span>
                </Link>
            </div>
        </motion.div>
    );
};

export default DonationCampaignCards;
