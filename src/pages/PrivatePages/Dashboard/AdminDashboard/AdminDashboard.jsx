import ActivityListCard from '@/components/dashboard/ActivityListCard';
import ActivityRow from '@/components/dashboard/ActivityRow';
import DonutChart from '@/components/dashboard/DonutChart';
import StatCard from '@/components/dashboard/StatCard';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import usePets from '@/hooks/usePets';
import useDonation from '@/hooks/useDonation';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { AuthContext } from '@/provider/AuthProvider';
import { useQueries, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Gift, HandCoins, HeartHandshake, PawPrint, Users } from 'lucide-react';
import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import petsIllustration from '@/assets/images/pets.png';
import sleepingCat from '@/assets/images/sleeping cat.png';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [pets] = usePets();
    const [donationCampaign] = useDonation();

    const { data: users = [] } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });

    const adoptedCount = pets.filter((pet) => pet.adopted === 'true').length;
    const donationQueries = useQueries({
        queries: donationCampaign.map((c) => ({
            queryKey: ['campaignDonations', c._id],
            queryFn: async () => (await axiosSecure.get(`/donationCampaign/${c._id}/donations`)).data,
            enabled: !!c._id,
            retry: false,
        })),
    });

    const raisedByCampaignId = useMemo(() => {
        const map = {};
        donationCampaign.forEach((c, i) => {
            const donations = donationQueries[i]?.data ?? [];
            map[c._id] = donations.reduce((sum, d) => sum + Number(d.donatedAmount || 0), 0);
        });
        return map;
    }, [donationCampaign, donationQueries.map((q) => q.dataUpdatedAt).join(',')]);

    const totalDonated = Object.values(raisedByCampaignId).reduce((sum, n) => sum + n, 0);

    const recentPets = [...pets]
        .sort((a, b) => new Date(b['date and time']) - new Date(a['date and time']))
        .slice(0, 4);

    const recentCampaigns = [...donationCampaign]
        .sort((a, b) => new Date(b['date and time']) - new Date(a['date and time']))
        .slice(0, 4);

    const categoryCounts = pets.reduce((acc, pet) => {
        const key = pet.category || 'other';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
    const categoryData = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([label, value]) => ({ label, value }));

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-[hsl(270,45%,96%)] via-[hsl(263,50%,93%)] to-[hsl(35,55%,90%)] p-8 shadow-xl dark:border-white/10 dark:from-[hsl(265,38%,11%)] dark:via-[hsl(266,45%,20%)] dark:to-[hsl(30,45%,24%)] md:p-10">
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-colorSecondary/20 blur-[90px]" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/20 blur-[90px]" />

                <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between lg:flex-col lg:items-start lg:justify-start">
                        <div>
                            <span className="font-bodyFont text-xs font-semibold uppercase tracking-[0.18em] text-colorSecondary">
                                Admin overview
                            </span>
                            <h1 className="mt-2 font-headingFont text-3xl font-bold text-foreground dark:text-white md:text-4xl">
                                Welcome back, <span className="bg-colorSecondary bg-clip-text text-transparent dark:from-colorSecondary dark:to-amber-200">{user?.displayName || 'Admin'}</span>
                            </h1>
                            <p className="mt-2 max-w-md text-foreground/70 dark:text-white/70">
                                Here's how Pet Squad is doing today! Keep the shelters, pets, and families connected.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Link to="/dashboard/allPets" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 transition-transform hover:scale-105">
                                Manage pets
                            </Link>
                            <Link to="/dashboard/allUsers" className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-transform hover:scale-105 dark:border-white/15 dark:bg-white/5 dark:text-white">
                                View users
                            </Link>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
                        className="hidden overflow-hidden rounded-2xl shadow-xl lg:block"
                    >
                        <motion.img
                            src={petsIllustration}
                            alt="Cat, dog and rabbit watching the rain together"
                            animate={{ scale: [1, 1.04, 1] }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                            className="h-40 w-full object-cover"
                        />
                    </motion.div>
                </div>

                <motion.div
                    variants={staggerContainer(0.1)}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                    <StatCard icon={Users} label="Total users" value={users.length} />
                    <StatCard icon={PawPrint} label="Pets listed" value={pets.length} />
                    <StatCard icon={HeartHandshake} label="Pets adopted" value={adoptedCount} />
                    <StatCard icon={HandCoins} label="Total donated" value={totalDonated} prefix="$" />
                </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <ActivityListCard
                    title="Recently added pets"
                    viewAllTo="/dashboard/allPets"
                    empty={pets.length === 0 ? 'No pets listed yet.' : undefined}
                >
                    {recentPets.map((pet) => (
                        <ActivityRow
                            key={pet._id}
                            image={pet.image}
                            title={pet.name}
                            subtitle={`${pet.category} · ${pet.location}`}
                            badge={pet.adopted === 'true' ? 'Adopted' : 'Available'}
                            badgeTone={pet.adopted === 'true' ? 'success' : 'warning'}
                        />
                    ))}
                </ActivityListCard>

                <ActivityListCard
                    title="Donation campaigns"
                    viewAllTo="/dashboard/allDonations"
                    empty={donationCampaign.length === 0 ? 'No donation campaigns yet.' : undefined}
                >
                    {recentCampaigns.map((campaign) => (
                        <ActivityRow
                            key={campaign._id}
                            image={campaign.image}
                            title={campaign.petName}
                            subtitle={`$${(raisedByCampaignId[campaign._id] || 0).toLocaleString()} of $${Number(campaign.amount || 0).toLocaleString()}`}
                            badge={campaign.isPaused ? 'Paused' : 'Active'}
                            badgeTone={campaign.isPaused ? 'muted' : 'success'}
                        />
                    ))}
                </ActivityListCard>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5 }}
                    className="glow-hover rounded-2xl border border-border bg-card p-5 shadow-sm dark:border-white/10">
                    <h3 className="mb-4 font-headingFont text-base font-bold text-foreground">Pets by category</h3>
                    {categoryData.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">No pets to show yet.</p>
                    ) : (
                        <DonutChart data={categoryData} centerValue={pets.length} centerLabel="Total pets" />
                    )}
                </motion.div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto]">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-2xl border border-border bg-card p-5 shadow-sm dark:border-white/10"
                >
                    <h3 className="mb-4 font-headingFont text-base font-bold text-foreground">Quick actions</h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                            { to: '/dashboard/addPet', icon: PawPrint, label: 'Add new pet', classes: 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground' },
                            { to: '/dashboard/createDonationCampaign', icon: Gift, label: 'Create campaign', classes: 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white' },
                            { to: '/dashboard/allUsers', icon: Users, label: 'Manage users', classes: 'bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white' },
                            { to: '/dashboard/allDonations', icon: HandCoins, label: 'View reports', classes: 'bg-colorSecondary/10 text-colorSecondary hover:bg-colorSecondary hover:text-violet-950' },
                        ].map(({ to, icon: Icon, label, classes }) => (
                            <motion.div key={label} variants={fadeUp}>
                                <Link
                                    to={to}
                                    className={`flex flex-col items-center gap-2 rounded-xl px-4 py-4 text-center text-sm font-semibold transition-all hover:scale-105 ${classes}`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {label}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative hidden w-40 shrink-0 overflow-hidden rounded-2xl shadow-lg lg:block">
                    <motion.img
                        src={sleepingCat}
                        alt="Cat napping with a warm mug nearby"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="h-full w-full object-cover"
                    />
                    <span className="absolute right-2 top-2 text-sm">💤</span>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
