import DonateModal from '@/components/donation/DonateModal';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import useCampaignDonations from '@/hooks/useCampaignDonations';
import { progressTone, daysLeft } from '@/lib/donation';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Modal from 'react-modal';
import { Helmet } from 'react-helmet-async';
import {CalendarDays, Clock, Gamepad2, Gift, HeartHandshake, Home, Loader2, PiggyBank, ShieldCheck, Sparkles, Stethoscope, UtensilsCrossed, Users} from 'lucide-react';

const customStyles = {
    content: {
        top: '58%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        maxHeight: '85vh',
        overflowY: 'auto',
        padding: 0,
        border: 'none',
        borderRadius: '1rem',
        backgroundColor: 'transparent',
        boxShadow: '0 25px 60px -15px hsl(265, 60%, 20%, 0.45)',
    },
    overlay: {
        backgroundColor: 'hsla(265, 30%, 8%, 0.55)',
        backdropFilter: 'blur(2px)',
        zIndex: 50,
    },
};

const PRESET_AMOUNTS = [0, 100, 200, 500, 1000, 2000];

const SUPPORT_ITEMS = [
    { icon: Stethoscope, label: 'Veterinary care & checkups' },
    { icon: UtensilsCrossed, label: 'Nutritious food & supplies' },
    { icon: Home, label: 'Safe & comfortable shelter' },
    { icon: Gamepad2, label: 'Enrichment & daily care' },
];

const FEATHERS = [
    { top: '12%', left: '8%', size: 20, duration: 8, delay: 0 },
    { top: '24%', left: '42%', size: 25, duration: 9, delay: 1.5 },
    { top: '65%', left: '15%', size: 22, duration: 7.5, delay: 0.8 },
    { top: '75%', left: '35%', size: 25, duration: 8.5, delay: 2.2 },
];

const DonationDetails = () => {
    const { id } = useParams();
    const axiosPublic = useAxiosPublic();
    const queryClient = useQueryClient();
    const [donateModalIsOpen, setDonateModalIsOpen] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState(null);

    const { data: donation, isPending } = useQuery({
        queryKey: ['donationCampaign', id],
        queryFn: async () => {
            const res = await axiosPublic.get(`/donationCampaign/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    const { raised: liveRaised, donorsCount: liveDonorsCount } = useCampaignDonations(id);

    const handleDonateNow = (amount) => {
        setSelectedAmount(amount ?? null);
        setDonateModalIsOpen(true);
    };

    const closeModal = () => setDonateModalIsOpen(false);
    const handleDonationSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['donationCampaign', id] });
        queryClient.invalidateQueries({ queryKey: ['campaignDonations', id] });
        closeModal();
    };

    if (isPending) {
        return (
            <div className="flex justify-center py-32">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!donation) {
        return (
            <div className="mx-auto my-20 max-w-md rounded-3xl border border-dashed border-border bg-card/50 py-16 text-center">
                <p className="font-headingFont text-xl font-semibold text-foreground">Campaign not found</p>
                <p className="mt-1 text-sm text-muted-foreground">This campaign may have been removed.</p>
            </div>
        );
    }

    const {petName, image, amount, 'short description': shortDescription, 'long description': longDescription, 'last date': lastDate, isPaused } = donation;
    const goal = Number(amount || 0);
    const raised = liveRaised;
    const percent = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
    const tone = progressTone(percent);
    const donorsCount = liveDonorsCount;
    const remainingDays = daysLeft(lastDate);

    return (
        <div>
            <Helmet><title>{petName} | Donation | Pet Squad</title></Helmet>

            <div className="px-3 pb-4 sm:px-6 lg:w-10/12 lg:mx-auto my-10">
                <div className="relative overflow-hidden rounded-[2.5rem] before:absolute before:inset-0 before:-z-10 before:rounded-[2.5rem] before:bg-gradient-to-r before:from-primary/20 before:via-colorSecondary/15 before:to-primary/20 before:blur-2xl before:content-[''] dark:before:from-primary/40 dark:before:via-colorSecondary/25 dark:before:to-primary/40">
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-border shadow-[0_30px_80px_-30px_rgba(91,52,176,0.2)] dark:border-white/10 dark:shadow-[0_30px_80px_-30px_rgba(10,6,20,0.65)]">

                        <div className="pointer-events-none absolute inset-0 overflow-hidden">
                            {FEATHERS.map((f, i) => (
                                <motion.span
                                    key={i}
                                    style={{ top: f.top, left: f.left }}
                                    className="absolute dark:text-colorSecondary text-colorPrimary"
                                    animate={{ y: [0, 22, 0], x: [0, 10, 0], rotate: [0, 20, 0], opacity: [0.4, 0.9, 0.4] }}
                                    transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <Sparkles size={f.size} />
                                </motion.span>
                            ))}
                        </div>

                        <div className="relative z-10 grid items-center gap-10 px-6 py-14 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:px-14 lg:py-16">
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, ease: 'easeOut' }}
                                className="text-center lg:max-w-md lg:text-left">

                                <h1 className="mt-4 flex items-center justify-center gap-2 text-balance font-headingFont text-4xl font-bold text-foreground dark:text-white lg:justify-start lg:text-6xl">
                                    {petName}
                                    <span className="dark:text-colorSecondary text-colorPrimary">♥</span>
                                </h1>

                                <p className="mx-auto mt-3 max-w-md font-bodyFont text-base leading-relaxed text-foreground/70 dark:text-white/70 lg:mx-0">
                                    Every little help helps {petName} live a healthy and happy life.
                                </p>

                                <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm dark:border-white/15 dark:bg-white/5 dark:text-white">
                                        <span className={`h-1.5 w-1.5 rounded-full ${isPaused ? 'bg-muted-foreground' : 'bg-emerald-500'}`} />
                                        {isPaused ? 'Paused' : 'Active'}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm dark:border-white/15 dark:bg-white/5 dark:text-white">
                                        <Users className="h-3.5 w-3.5 text-primary dark:text-colorSecondary" /> {donorsCount} Supporters
                                    </span>
                                    {lastDate && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm dark:border-white/15 dark:bg-white/5 dark:text-white">
                                            <CalendarDays className="h-3.5 w-3.5 text-primary dark:text-colorSecondary" /> Ends {lastDate}
                                        </span>
                                    )}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
                                className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/20">
                                <motion.img
                                    src={image}
                                    alt={petName}
                                    animate={{ scale: [1, 1.04, 1] }}
                                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                                    className="h-[260px] w-full object-cover sm:h-[320px] lg:h-[380px]"
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto -mt-2 max-w-6xl px-3 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                        { icon: PiggyBank, label: 'Goal Amount', value: `$${goal.toLocaleString()}` },
                        { icon: HeartHandshake, label: 'Raised So Far', value: `$${raised.toLocaleString()}`, tone: tone.text },
                        { icon: CalendarDays, label: 'Ends On', value: lastDate || '—' },
                        { icon: Clock, label: 'Days Left', value: remainingDays !== null ? `${remainingDays}d` : '—' },
                    ].map(({ icon: Icon, label, value, tone: t }) => (
                        <div key={label} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm dark:border-white/10">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-colorSecondary">
                                <Icon className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                                <p className={`truncate font-headingFont text-sm font-bold ${t || 'text-foreground'}`}>{value}</p>
                                <p className="text-[11px] text-muted-foreground">{label}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            <div className="mx-auto grid max-w-6xl gap-8 px-3 py-10 sm:px-6 lg:grid-cols-[1fr_380px] lg:items-start">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6">
                    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm dark:border-white/10">
                        <h2 className="flex items-center gap-2 font-headingFont text-lg font-bold text-foreground">
                            <HeartHandshake className="h-5 w-5 text-primary dark:text-colorSecondary" /> About {petName}
                        </h2>
                        <p className="mt-3 leading-relaxed text-muted-foreground">
                            {longDescription || shortDescription || `${petName} needs your support to live a healthy, happy life.`}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm dark:border-white/10">
                        <h2 className="font-headingFont text-lg font-bold text-foreground">What your support will provide</h2>
                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {SUPPORT_ITEMS.map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-3 rounded-2xl bg-secondary/60 px-4 py-3 dark:bg-white/5">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-colorSecondary">
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <span className="text-sm font-medium text-foreground">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="lg:sticky lg:top-24"
                >
                    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xl shadow-primary/10 dark:border-white/10">
                        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-colorSecondary/15 blur-[70px]" />

                        <h2 className="relative flex items-center gap-2 font-headingFont text-lg font-bold text-foreground">
                            <span className="dark:text-colorSecondary">♥</span> Support {petName}
                        </h2>
                        <p className="relative mt-1 text-sm text-muted-foreground">
                            Help {petName} receive the care and love they deserve.
                        </p>

                        <div className="relative mt-5">
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
                                    animate={{ width: `${percent}%` }}
                                    transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                                />
                            </div>
                            <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {donorsCount} Donors</span>
                                {remainingDays !== null && (
                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {remainingDays} Days Left</span>
                                )}
                            </div>
                        </div>

                        {isPaused ? (
                            <div className="relative mt-6 rounded-2xl bg-muted px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                                This campaign is currently paused.
                            </div>
                        ) : (
                            <div className="relative mt-6">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Select Donation Amount</p>
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                    {PRESET_AMOUNTS.map((preset) => (
                                        <motion.button
                                            key={preset}
                                            type="button"
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={() => setSelectedAmount(preset)}
                                            className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                                                selectedAmount === preset
                                                    ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/30'
                                                    : 'border-border bg-secondary/60 text-foreground hover:border-primary/40 dark:border-white/10 dark:bg-white/5'
                                            }`}
                                        >
                                            ${preset.toLocaleString()}
                                        </motion.button>
                                    ))}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleDonateNow(selectedAmount)}
                                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 transition-colors hover:bg-primary/90">
                                    <Gift className="h-4 w-4" /> Donate Now
                                </motion.button>

                                <p className="relative mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                                    <ShieldCheck className="h-3.5 w-3.5 text-primary dark:text-colorSecondary" /> Secured by Stripe
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <Modal
                isOpen={donateModalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Donate">
                {donateModalIsOpen && (
                    <DonateModal
                        donation={donation}
                        closeModal={closeModal}
                        initialAmount={selectedAmount}
                        onSuccess={handleDonationSuccess}
                    />
                )}
            </Modal>
        </div>
    );
};

export default DonationDetails;
