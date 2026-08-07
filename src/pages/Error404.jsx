import React from 'react';
import error from '../assets/404.json'
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionTitle from '@/components/SectionTitle/SectionTitle';

const Error404 = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-screen flex flex-col items-center justify-center"
        >
        <Lottie className='w-1/5' animationData={error}></Lottie>
        <SectionTitle
            title={"Whoops! We couldn't find the page you're looking for. Let’s get you back on track!"}
            >
            </SectionTitle>
        <motion.div whileHover={{ scale: 1.05 }}>
            <Link
                to="/"
                className="rounded-full bg-primary px-6 py-2.5 text-primary-foreground shadow-md shadow-primary/30 transition-colors hover:bg-primary/90"
            >
                Back to Home
            </Link>
        </motion.div>
    </motion.div>
    );
};

export default Error404;