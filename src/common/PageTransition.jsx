import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useOutlet } from 'react-router-dom';
import { pageTransition } from '@/lib/motion';

const PageTransition = () => {
    const location = useLocation();
    const outlet = useOutlet();

    return (
        <motion.div
            key={location.pathname}
            variants={pageTransition}
            initial="initial"
            animate="animate"
        >
            {outlet}
        </motion.div>
    );
};

export default PageTransition;
