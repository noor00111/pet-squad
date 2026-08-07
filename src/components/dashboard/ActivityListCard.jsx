import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { staggerContainer } from '@/lib/motion';

const ActivityListCard = ({ title, viewAllTo, children, empty }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="glow-hover rounded-2xl border border-border bg-card p-5 shadow-sm dark:border-white/10"
    >
        <div className="mb-3 flex items-center justify-between">
            <h3 className="font-headingFont text-base font-bold text-foreground">{title}</h3>
            {viewAllTo && (
                <Link
                    to={viewAllTo}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground dark:bg-white/10 dark:text-colorSecondary dark:hover:bg-colorSecondary dark:hover:text-violet-950"
                >
                    View all
                </Link>
            )}
        </div>
        {empty ? (
            <p className="py-8 text-center text-sm text-muted-foreground">{empty}</p>
        ) : (
            <motion.ul variants={staggerContainer(0.06)} initial="hidden" animate="visible" className="space-y-1">
                {children}
            </motion.ul>
        )}
    </motion.div>
);

export default ActivityListCard;
