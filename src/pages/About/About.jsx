import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {ArrowRight, Compass, DoorOpen, HandCoins, Heart, PawPrint, Send, ShieldCheck, Sparkles, Users} from 'lucide-react';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { DoodleSpark, DoodleRing, DoodleSquiggle } from '@/components/Doodle/Doodles';
import about1 from "@/assets/images/about1.png";
import about2 from "@/assets/images/about2.png";
import about3 from "@/assets/images/about3.png";

const STEPS = [
    {
        icon: Compass,
        step: '01',
        title: 'Browse',
        copy: "Explore pets waiting for a home, each listed by the person who's caring for them right now.",
    },
    {
        icon: Send,
        step: '02',
        title: 'Apply',
        copy: 'Send an adoption request straight from the pet\'s page — one simple form, no paperwork maze.',
    },
    {
        icon: DoorOpen,
        step: '03',
        title: 'Welcome home',
        copy: "Once you're approved, coordinate with the lister and bring your new best friend home.",
    },
];

const VALUES = [
    {
        icon: PawPrint,
        title: 'Rescue first',
        copy: 'Every pet on Pet Squad starts as a listing from someone who wants them safe not a statistic.',
    },
    {
        icon: ShieldCheck,
        title: 'Open books',
        copy: "Every donation stays tied to the campaign that raised it, visible right on the pet's own page.",
    },
    {
        icon: Users,
        title: 'Community powered',
        copy: 'Listings, donations, and adoptions all come from people in the community not a shelter chain.',
    },
    {
        icon: Heart,
        title: 'No pet left behind',
        copy: 'From first listing to final home, every step is tracked so nothing falls through the cracks.',
    },
];

const About = () => {
    const axiosPublic = useAxiosPublic();

    const { data: petsCount } = useQuery({
        queryKey: ['about-pets-count'],
        queryFn: async () => {
            const res = await axiosPublic.get('/pets/isNotAdopted');
            return Array.isArray(res.data) ? res.data.length : 0;
        },
    });

    const { data: campaignsCount } = useQuery({
        queryKey: ['about-campaigns-count'],
        queryFn: async () => {
            const res = await axiosPublic.get('/donationCampaign?page=0&limit=1000');
            return Array.isArray(res.data?.campaigns) ? res.data.campaigns.length : 0;
        },
    });

    return (
        <div className="bg-[#FDF8F0] transition-colors duration-300 dark:bg-background">
            <Helmet>
                <title>About | Pet Squad</title>
            </Helmet>

            <section className="relative overflow-hidden px-3 pt-6 sm:px-6">
                <div className="relative overflow-hidden rounded-[2.5rem] border border-[#EADFC8] bg-gradient-to-br from-[#FCF6EA] via-[#F7EEDC] to-[#F0E6D2] px-6 py-14 shadow-[0_30px_80px_-35px_rgba(120,90,40,0.25)] dark:border-white/10 dark:from-[hsl(265,30%,9%)] dark:via-[hsl(265,28%,11%)] dark:to-[hsl(265,26%,13%)] sm:px-10 lg:px-14 lg:py-20">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <motion.div
                            className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-[#8FB08F]/25 blur-[90px] dark:bg-[#8FB08F]/15"
                            animate={{ x: [0, 25, 0], y: [0, 15, 0] }}
                            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div
                            className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-colorSecondary/20 blur-[100px] dark:bg-colorSecondary/20"
                            animate={{ x: [0, -20, 0], y: [0, -20, 0] }}
                            transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        />
                    </div>

                    <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                        <motion.div
                            initial={{ opacity: 0, y: 22 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                            className="text-center lg:text-left">
                            <span className="inline-flex items-center gap-2 border border-colorPrimary/10 px-4 py-2 rounded-full bg-colorPrimary/10 font-bodyFont text-xs font-semibold uppercase tracking-[0.18em] text-primary dark:border-colorSecondary/30 dark:bg-colorSecondary/10 dark:text-colorSecondary">
                                <Sparkles className="h-3.5 w-3.5" /> Our story
                            </span>

                            <h1 className="mt-5 text-balance font-headingFont text-4xl font-semibold leading-[1.15] text-[#3F3730] dark:text-white lg:text-5xl">
                                Every rescue has a story.
                                <br />
                                We help write the{' '}
                                <span className="relative inline-block">
                                    next chapter
                                    <DoodleSquiggle className="absolute -bottom-4 left-0 h-4 w-full text-colorSecondary" delay={0.6} />
                                </span>
                                .
                            </h1>

                            <p className="mx-auto mt-6 max-w-md text-pretty font-bodyFont text-base leading-relaxed text-[#6B6255] dark:text-white/70 lg:mx-0">
                                Pet Squad connects pets who need a home with people who have room for them and gives every
                                pet's care a place to be funded, tracked, and celebrated.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                                <Link to="/petListing">
                                    <motion.span
                                        whileHover={{ scale: 1.04, y: -2 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary/80 px-6 py-3 font-bodyFont text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25"
                                    >
                                        Meet the pets <ArrowRight className="h-4 w-4" />
                                    </motion.span>
                                </Link>
                                <Link to="/donationCampaigns">
                                    <motion.span
                                        whileHover={{ scale: 1.04, y: -2 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="inline-flex items-center gap-2 rounded-full border-2 border-colorSecondary/50 bg-white/60 px-6 py-3 font-bodyFont text-sm font-semibold text-[#3F3730] shadow-sm backdrop-blur-sm dark:bg-white/5 dark:text-white"
                                    >
                                        <HandCoins className="h-4 w-4 text-colorSecondary" /> Support a campaign
                                    </motion.span>
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
                            className="relative mx-auto max-w-md lg:max-w-none">
                            <div className="relative overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl shadow-[#8FB08F]/20 dark:border-white/10">
                                <motion.img
                                    src={about1}
                                    alt="A kitten, puppy, rabbit, and budgie sitting together in the grass"
                                    className="h-[280px] w-full object-cover sm:h-[340px]"
                                    animate={{ scale: [1, 1.03, 1] }}
                                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                                />
                            </div>

                            <DoodleRing className="pointer-events-none absolute -left-6 -top-6 h-16 w-16 text-colorSecondary/60 sm:h-20 sm:w-20" />

                           
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="px-3 py-10 sm:px-6 lg:px-10">
                <motion.div
                    variants={staggerContainer(0.15)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                    className="mx-auto grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
                    <motion.div
                        variants={fadeUp}
                        className="glow-hover flex items-center gap-4 rounded-2xl border border-border bg-card px-6 py-6 shadow-sm">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-colorSecondary">
                            <PawPrint className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="font-headingFont text-2xl font-bold text-foreground">{petsCount ?? '—'}</p>
                            <p className="text-sm text-muted-foreground">Pets currently listed for adoption</p>
                        </div>
                    </motion.div>
                    <motion.div
                        variants={fadeUp}
                        className="glow-hover flex items-center gap-4 rounded-2xl border border-border bg-card px-6 py-6 shadow-sm">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-colorSecondary/15 text-colorSecondary">
                            <HandCoins className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="font-headingFont text-2xl font-bold text-foreground">{campaignsCount ?? '—'}</p>
                            <p className="text-sm text-muted-foreground">Active donation campaigns</p>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            <section className="relative px-3 py-14 sm:px-6 lg:px-10">
                <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="relative order-2 mx-auto max-w-sm lg:order-1">
                        <div className="relative overflow-hidden rounded-[2rem] shadow-xl">
                            <img
                                src={about3}
                                alt="A woman gently kissing her cat on the cheek"
                                className="aspect-[4/5] w-full object-cover"
                            />
                        </div>
                        <DoodleSpark className="pointer-events-none absolute -bottom-4 -left-4 h-10 w-10 text-colorSecondary" delay={0.6} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="order-1 lg:order-2"
                    >
                        <span className="font-bodyFont text-sm font-semibold uppercase tracking-[0.18em] text-colorSecondary">
                            Why we're here
                        </span>
                        <h2 className="mt-3 text-balance font-headingFont text-3xl font-semibold text-foreground md:text-4xl">
                            A home is the whole point
                        </h2>
                        <p className="mt-5 text-pretty font-bodyFont text-base leading-relaxed text-muted-foreground">
                            Pet Squad exists because rehoming a pet shouldn't mean disappearing into a spreadsheet. Anyone
                            caring for an animal that needs a new home can list them here and anyone with room in their
                            life can find them. If a pet's care comes with a vet bill or a recovery fund, a donation
                            campaign keeps that cost visible and fundable, not hidden.
                        </p>
                        <p className="mt-4 text-pretty font-bodyFont text-base leading-relaxed text-muted-foreground">
                            No shelter chain, no gatekeeping just a straightforward place for pets, the people who list
                            them, and the people ready to welcome them home.
                        </p>
                        <blockquote className="relative mt-7 rounded-2xl border-l-4 border-primary bg-primary/5 py-4 pl-5 pr-4 font-headingFont text-lg italic text-foreground dark:bg-primary/10">
                            "A better life starts with you."
                        </blockquote>
                    </motion.div>
                </div>
            </section>

            <section className="relative overflow-hidden px-3 py-16 sm:px-6 lg:px-10">
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto mb-12 max-w-xl text-center"
                    >
                        <span className="font-bodyFont text-sm font-semibold uppercase tracking-[0.18em] text-colorSecondary">
                            How it works
                        </span>
                        <h2 className="mt-3 font-headingFont text-3xl font-semibold text-foreground md:text-4xl">
                            Three steps to a new best friend
                        </h2>
                    </motion.div>

                    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
                        <motion.div
                            variants={staggerContainer(0.18)}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            className="space-y-6"
                        >
                            {STEPS.map(({ icon: Icon, step, title, copy }, i) => (
                                <motion.div key={step} variants={fadeUp} className="glow-hover flex gap-5 rounded-2xl border border-border bg-card p-5">
                                    <div className="flex flex-col items-center">
                                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-colorPrimary dark:bg-colorSecondary dark:text-gray-800 text-white shadow-md">
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        {i < STEPS.length - 1 && <span className="mt-2 h-full w-px flex-1 bg-border" />}
                                    </div>
                                    <div className="pb-1">
                                        <p className="font-bodyFont text-xs font-bold uppercase tracking-wider text-colorSecondary">
                                            Step {step}
                                        </p>
                                        <h3 className="mt-1 font-headingFont text-xl font-semibold text-foreground">{title}</h3>
                                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.94 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                            className="relative mx-auto max-w-sm"
                        >
                            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#F7EEDC] to-[#F0E6D2] shadow-xl dark:from-[hsl(265,28%,11%)] dark:to-[hsl(265,26%,13%)]">
                                <img
                                    src={about2}
                                    alt="A dog, cat, rabbit, and parrot together — every kind of pet is welcome"
                                    className="aspect-square w-full object-cover"
                                />
                            </div>
                            <DoodleSpark className="pointer-events-none absolute -bottom-5 -right-5 h-12 w-12 text-primary" delay={0.4} />
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="px-3 py-16 sm:px-6 lg:px-10">
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto mb-12 max-w-xl text-center"
                    >
                        <span className="font-bodyFont text-sm font-semibold uppercase tracking-[0.18em] text-colorSecondary">
                            What we stand for
                        </span>
                        <h2 className="mt-3 font-headingFont text-3xl font-semibold text-foreground md:text-4xl">
                            The rules we don't bend
                        </h2>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer(0.12)}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        {VALUES.map(({ icon: Icon, title, copy }) => (
                            <motion.div
                                key={title}
                                variants={fadeUp}
                                whileHover={{ y: -6 }}
                                className="glow-hover rounded-2xl border border-border bg-card p-6 shadow-sm"
                            >
                                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-colorSecondary">
                                    <Icon className="h-5 w-5" />
                                </span>
                                <h3 className="mt-4 font-headingFont text-lg font-semibold text-foreground">{title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

        
        </div>
    );
};

export default About;
