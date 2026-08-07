import React from 'react';
import { motion } from "framer-motion";
import SectionTitle from '@/components/SectionTitle/SectionTitle';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaHome, FaPaw, FaStethoscope } from 'react-icons/fa';

const AboutUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const featVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  return (
    <div className='lg:px-20 px-6 py-12 transition-all duration-300'>
      <SectionTitle
        title={"About Us"}
        subTitle={"We specialize in our Passion Caring for Pets & Sheltering"}
      />

      <div className="grid lg:grid-cols-2 gap-12 items-center mt-6">
        <div className="py-10 flex flex-col justify-center">

          <motion.div
            className="mb-8 flex flex-col gap-6 rounded-2xl border border-border bg-secondary p-6 font-medium text-foreground shadow-sm sm:flex-row"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={featVariants} className="flex items-center gap-2.5">
              <FaPaw className="shrink-0 text-2xl text-colorSecondary" />
              <span className="text-sm">Helping Homeless Pets</span>
            </motion.div>
            <motion.div variants={featVariants} className="flex items-center gap-2.5">
              <FaStethoscope className="shrink-0 text-2xl text-colorPrimary" />
              <span className="text-sm">Ensuring Pet Welfare</span>
            </motion.div>
            <motion.div variants={featVariants} className="flex items-center gap-2.5">
              <FaHome className="shrink-0 text-2xl text-emerald-600" />
              <span className="text-sm">Finding Forever Homes</span>
            </motion.div>
          </motion.div>

          <motion.p
            className="mb-8 text-lg leading-relaxed text-muted-foreground"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our mission is to connect loving families with pets in need of a home. This
            website was created to make the adoption process simple, transparent, and
            accessible for everyone. We believe every pet deserves a chance at a better
            life, and every family deserves the joy of a furry companion.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/about"
              className="inline-flex items-center space-x-2 rounded-full font-semibold text-colorPrimary underline transition-all duration-300 hover:text-colorPrimary/80"
            >
              <span>Read More</span>
              <FaArrowRight />
            </Link>
          </motion.div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-border bg-muted shadow-xl">
          <motion.img
            src="https://i.ibb.co.com/bMnJ5f3m/2150492139.jpg"
            alt="Happy pets and families"
            className="w-full h-full object-cover aspect-[4/3]"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;