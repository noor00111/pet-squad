import { motion } from 'framer-motion';

const drawVariant = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (delay = 0) => ({
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: { duration: 1, ease: 'easeInOut', delay },
            opacity: { duration: 0.3, delay },
        },
    }),
};

export const DoodleHeart = ({ className = '', delay = 0 }) => (
    <motion.svg
        viewBox="0 0 60 54"
        fill="none"
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
    >
        <motion.path
            d="M30 50C30 50 4 34.5 4 17.5C4 8.5 11 3 19 3C24.5 3 28.5 6.5 30 11C31.5 6.5 35.5 3 41 3C49 3 56 8.5 56 17.5C56 34.5 30 50 30 50Z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            custom={delay}
            variants={drawVariant}
        />
    </motion.svg>
);

export const DoodleSpark = ({ className = '', delay = 0 }) => (
    <motion.svg
        viewBox="0 0 40 40"
        fill="none"
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
    >
        <motion.path d="M20 2V16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" custom={delay} variants={drawVariant} />
        <motion.path d="M20 24V38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" custom={delay + 0.08} variants={drawVariant} />
        <motion.path d="M2 20H16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" custom={delay + 0.16} variants={drawVariant} />
        <motion.path d="M24 20H38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" custom={delay + 0.24} variants={drawVariant} />
    </motion.svg>
);

export const DoodleSquiggle = ({ className = '', delay = 0 }) => (
    <motion.svg
        viewBox="0 0 160 40"
        fill="none"
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
    >
        <motion.path
            d="M2 20C15 5 28 35 42 20C56 5 70 35 84 20C98 5 112 35 126 20C134 12 142 12 150 18"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="1 9"
            custom={delay}
            variants={drawVariant}
        />
        <motion.path
            d="M144 10L152 18L143 24"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            custom={delay + 0.35}
            variants={drawVariant}
        />
    </motion.svg>
);

export const DoodleRing = ({ className = '' }) => (
    <motion.svg
        viewBox="0 0 100 100"
        fill="none"
        className={className}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
    >
        <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2" strokeDasharray="5 7" />
    </motion.svg>
);
