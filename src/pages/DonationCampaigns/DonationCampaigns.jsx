import DonationCampaignCards from '@/components/donation/DonationCampaignCards';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useInfiniteQuery, useQueries } from '@tanstack/react-query';
import { fadeUp, staggerContainer } from '@/lib/motion';
import {ArrowUpDown, Gift, HeartHandshake, LayoutGrid, List, Loader2, PawPrint, Search, ShieldCheck, Wallet} from 'lucide-react';
import donation from "@/assets/images/pets-donation.png";
import cat from "@/assets/images/cat-donation.png";




const PAGE_SIZE = 9;

const SORT_OPTIONS = [
    { value: 'latest', label: 'Latest' },
    { value: 'mostFunded', label: 'Most Funded' },
    { value: 'endingSoon', label: 'Ending Soon' },
];

const DonationCampaigns = () => {
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('latest');
    const [view, setView] = useState('grid');

    const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending} = useInfiniteQuery({
        queryKey: ['donationCampaign'],
        queryFn: async ({ pageParam = 0 }) => {
            const res = await axiosPublic.get(`/donationCampaign?page=${pageParam}&limit=${PAGE_SIZE}`);
            return res.data;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length : undefined),
    });

    const campaigns = data?.pages.flatMap((page) => page.campaigns) ?? [];
    const donationQueries = useQueries({
        queries: campaigns.map((c) => ({
            queryKey: ['campaignDonations', c._id],
            queryFn: async () => (await axiosSecure.get(`/donationCampaign/${c._id}/donations`)).data,
            enabled: !!c._id,
            retry: false,
        })),
    });

    const raisedByCampaignId = useMemo(() => {
        const map = {};
        campaigns.forEach((c, i) => {
            const donations = donationQueries[i]?.data ?? [];
            map[c._id] = donations.reduce((sum, d) => sum + Number(d.donatedAmount || 0), 0);
        });
        return map;
    }, [campaigns, donationQueries.map((q) => q.dataUpdatedAt).join(',')]);

    const stats = useMemo(() => {
        const active = campaigns.filter((c) => !c.isPaused).length;
        const raised = Object.values(raisedByCampaignId).reduce((sum, n) => sum + n, 0);
        return { active, total: campaigns.length, raised };
    }, [campaigns, raisedByCampaignId]);

    const visibleCampaigns = useMemo(() => {
        let list = campaigns;
        if (statusFilter === 'active') list = list.filter((c) => !c.isPaused);
        if (statusFilter === 'paused') list = list.filter((c) => c.isPaused);
        if (searchValue.trim()) {
            const q = searchValue.trim().toLowerCase();
            list = list.filter((c) => c.petName?.toLowerCase().includes(q));
        }
        const sorted = [...list];
        if (sortBy === 'mostFunded') {
            sorted.sort((a, b) => (raisedByCampaignId[b._id] || 0) - (raisedByCampaignId[a._id] || 0));
        } else if (sortBy === 'endingSoon') {
            sorted.sort((a, b) => new Date(a['last date']) - new Date(b['last date']));
        } else {
            sorted.sort((a, b) => new Date(b['date and time']) - new Date(a['date and time']));
        }
        return sorted;
    }, [campaigns, statusFilter, searchValue, sortBy, raisedByCampaignId]);

    const sentinelRef = useRef(null);
    const sentinelInView = useInView(sentinelRef, { once: false, amount: 0.1 });

    useEffect(() => {
        if (sentinelInView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [sentinelInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const hasFiltersApplied = statusFilter !== 'all' || searchValue.trim().length > 0;

    return (
        <div>
            <Helmet><title>Donation Campaigns | Pet Squad</title></Helmet>

            <div className="px-3 pb-4 sm:px-6">
                <div className="relative overflow-hidden rounded-[2.5rem] before:absolute before:inset-0 before:-z-10 before:rounded-[2.5rem] before:bg-gradient-to-r before:from-primary/20 before:via-colorSecondary/15 before:to-primary/20 before:blur-2xl before:content-[''] dark:before:from-primary/40 dark:before:via-colorSecondary/25 dark:before:to-primary/40">
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-gradient-to-br from-[hsl(270,50%,98%)] via-[hsl(268,45%,96%)] to-[hsl(260,42%,94%)] px-6 py-14 shadow-[0_30px_80px_-30px_rgba(91,52,176,0.2)] dark:border-white/10 dark:from-[hsl(265,40%,9%)] dark:via-[hsl(266,50%,19%)] dark:to-[hsl(30,50%,24%)] dark:shadow-[0_30px_80px_-30px_rgba(10,6,20,0.65)] sm:px-10 lg:px-14 lg:py-16">

                        <div className="pointer-events-none absolute inset-0 overflow-hidden">
                            <motion.div
                                className="absolute left-10 top-10 h-72 w-72 rounded-full bg-colorSecondary/20 blur-[90px] dark:bg-colorSecondary/25"
                                animate={{ x: [0, 30, 0], y: [0, 15, 0] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.div
                                className="absolute bottom-10 right-20 h-80 w-80 rounded-full bg-primary/20 blur-[100px] dark:bg-primary/30"
                                animate={{ x: [0, -25, 0], y: [0, -35, 0] }}
                                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            />
                        </div>

                        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                                className="text-center lg:max-w-md lg:text-left">

                                <h1 className="mt-4 text-balance font-headingFont text-4xl font-bold leading-[1.15] text-foreground dark:text-white lg:text-5xl">
                                    Every Donation Creates a Better Tomorrow!{' '}
                                </h1>

                                <p className="mx-auto mt-4 max-w-md font-bodyFont text-base leading-relaxed text-foreground/70 dark:text-white/70 lg:mx-0">
                                    Support our furry friends by contributing to their care, treatment, and a happy life.
                                </p>

                                <motion.div
                                    variants={staggerContainer(0.12, 0.4)}
                                    initial="hidden"
                                    animate="visible"
                                    className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                                   
                                    <motion.div variants={fadeUp} className="flex items-center gap-1.5 rounded-2xl border border-border bg-white px-3.5 py-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-colorSecondary">
                                            <HeartHandshake className="h-4 w-4" />
                                        </span>
                                        <div className="text-left">
                                            <p className="font-headingFont text-sm font-bold leading-none text-foreground dark:text-white">{stats.active}+</p>
                                            <p className="mt-0.5 text-[11px] text-muted-foreground dark:text-white/55">Active Campaigns</p>
                                        </div>
                                    </motion.div>

                                    <motion.div variants={fadeUp} className="flex items-center gap-1.5 rounded-2xl border border-border bg-white px-3.5 py-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-colorSecondary/15 text-colorSecondary">
                                            <PawPrint className="h-4 w-4" />
                                        </span>
                                        <div className="text-left">
                                            <p className="font-headingFont text-sm font-bold leading-none text-foreground dark:text-white">{stats.total}+</p>
                                            <p className="mt-0.5 text-[11px] text-muted-foreground dark:text-white/55">Pets Helped</p>
                                        </div>
                                    </motion.div>
                                    
                                    <motion.div variants={fadeUp} className="flex items-center gap-1.5 rounded-2xl border border-border bg-white px-3.5 py-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                                            <Wallet className="h-4 w-4" />
                                        </span>
                                        <div className="text-left">
                                            <p className="font-headingFont text-sm font-bold leading-none text-foreground dark:text-white">${stats.raised.toLocaleString()}+</p>
                                            <p className="mt-0.5 text-[11px] text-muted-foreground dark:text-white/55">Total Raised</p>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.94 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                                className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/20">
                                <motion.img
                                    src={donation}
                                    alt="A kitten and a budgie — pets waiting for donation support"
                                    animate={{ scale: [1, 1.04, 1] }}
                                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                                    className="h-[260px] w-full object-cover sm:h-[340px] lg:h-[400px]"
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-3 pt-6 text-center sm:px-6">
                <h2 className="font-headingFont text-2xl font-bold text-foreground sm:text-3xl">Explore Donation Campaigns</h2>
                <div className="mx-auto mt-2 flex items-center justify-center gap-2 text-colorSecondary">
                    <span className="h-px w-8 bg-border" />
                    <PawPrint className="h-3.5 w-3.5" />
                    <span className="h-px w-8 bg-border" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Choose a campaign and be the reason for their smile.</p>
            </div>

            

            <div className="mx-auto mt-6 flex max-w-6xl flex-col gap-3 px-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 shadow-sm dark:border-white/10 lg:max-w-xs">
                    <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search campaigns..."
                        className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground shadow-sm outline-none dark:border-white/10"
                    >
                        <option value="all">All Campaigns</option>
                        <option value="active">Active only</option>
                        <option value="paused">Paused</option>
                    </select>

                    <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 shadow-sm dark:border-white/10">
                        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent text-sm font-medium text-foreground outline-none"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-sm dark:border-white/10">
                        <button
                            type="button"
                            onClick={() => setView('grid')}
                            aria-label="Grid view"
                            aria-pressed={view === 'grid'}
                            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setView('list')}
                            aria-label="List view"
                            aria-pressed={view === 'list'}
                            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-3 py-8 sm:px-6">
                {isPending ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : visibleCampaigns.length > 0 ? (
                    <motion.div
                        variants={staggerContainer(0.08)}
                        initial="hidden"
                        animate="visible"
                        className={view === 'grid' ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-4'}>

                        {visibleCampaigns.map((campaign) => (
                            <motion.div key={campaign._id} variants={fadeUp}>
                                <DonationCampaignCards campaign={campaign} raised={raisedByCampaignId[campaign._id]} />
                            </motion.div>
                        ))}

                        {!hasNextPage && !hasFiltersApplied && (
                            <motion.div variants={fadeUp}>
                                <Link
                                    to="/dashboard/createDonationCampaign"
                                    className="group flex h-full flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center transition-colors hover:bg-primary/10 dark:bg-white/5">
                                    <span className="flex h-14 w-14 items-center justify-center text-rose-500">
                                        <Gift className="h-9 w-9" />
                                    </span>
                                    <div>
                                        <p className="font-headingFont text-lg font-bold text-foreground">
                                            Be the reason they <span className="text-colorSecondary">wag their tails</span>
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">Every little bit helps. Thank you!</p>
                                    </div>
                                    <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/30">
                                        Start a Campaign
                                    </span>
                                </Link>
                            </motion.div>
                        )}
                    </motion.div>
                ) : campaigns.length > 0 ? (
                    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card/50 py-16 text-center">
                        <Search className="h-8 w-8 text-muted-foreground" />
                        <p className="font-headingFont text-lg font-semibold text-foreground">No campaigns match your search</p>
                        <p className="text-sm text-muted-foreground">Try a different name, or clear your filters.</p>
                        <button
                            type="button"
                            onClick={() => { setSearchValue(''); setStatusFilter('all'); }}
                            className="mt-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/30"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-card/50 py-20 text-center">

                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-3xl">
                            <HeartHandshake className="h-7 w-7 text-muted-foreground" />
                        </span>
                        <div>
                            <p className="font-headingFont text-xl font-semibold text-foreground">No campaigns yet</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                There are no active donation campaigns right now — check back soon, or start one from your dashboard.
                            </p>
                        </div>
                    </motion.div>
                )}

                <div ref={sentinelRef} className="flex justify-center py-6">
                    {isFetchingNextPage && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
                </div>

                {!hasNextPage && campaigns.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative mt-4 flex items-center justify-between gap-4 overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-secondary/60 to-transparent px-6 py-6 dark:border-white/10 dark:from-white/5">

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">You've reached the end</p>
                            <p className="mt-1 font-headingFont text-lg font-bold text-foreground">
                                Thank you for caring <span className="text-primary dark:text-colorSecondary">💜</span>
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">Check back later for more new campaigns.</p>
                        </div>
                        <img
                            src={cat}
                            alt="A cat hugging a heart, saying thank you"
                            className="h-20 w-20 shrink-0 object-contain sm:h-24 sm:w-24"
                        />
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default DonationCampaigns;
