import React from 'react';
import { motion } from 'framer-motion';
import { MdPets } from 'react-icons/md';

const Loading = () => {
    return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 py-20">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-secondary border-t-primary"
            >
                <motion.span
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                    className="text-colorSecondary"
                >
                    <MdPets size={18} />
                </motion.span>
            </motion.div>
            <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="font-headingFont text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground"
            >
                Fetching pets...
            </motion.p>
        </div>
    );
};

export default Loading;