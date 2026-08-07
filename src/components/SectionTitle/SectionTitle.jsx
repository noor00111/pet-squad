import React from 'react';
import { motion } from 'framer-motion';

const SectionTitle = ({ subTitle, title }) => {
    const isEyebrow = subTitle && subTitle.length <= 28;

    return (
        <motion.div
            className="mx-auto mb-12 max-w-2xl text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            {isEyebrow && (
                <span className="inline-block font-bodyFont text-sm font-semibold uppercase tracking-[0.18em] text-colorSecondary">
                    {subTitle}
                </span>
            )}
            <h2 className={`text-balance font-headingFont text-3xl font-semibold text-foreground md:text-4xl ${isEyebrow ? 'mt-3' : ''}`}>
                {title}
            </h2>
            {subTitle && !isEyebrow && (
                <p className="mt-4 text-pretty font-bodyFont text-base leading-relaxed text-muted-foreground">
                    {subTitle}
                </p>
            )}
        </motion.div>
    );
};

export default SectionTitle;