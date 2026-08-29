import ActivityListCard from '@/components/dashboard/ActivityListCard';
import ActivityRow from '@/components/dashboard/ActivityRow';
import DonutChart from '@/components/dashboard/DonutChart';
import StatCard from '@/components/dashboard/StatCard';
import { AuthContext } from '@/provider/AuthProvider';
import { motion } from 'framer-motion';
import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ClipboardList, Dog, Gift, HandCoins, PlusCircle } from 'lucide-react';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import useDonation from '@/hooks/useDonation';
import { fadeUp, staggerContainer } from '@/lib/motion';
import petsImg from '@/assets/images/pets.png';
import sleepingCat from '@/assets/images/sleeping cat.png';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [donationCampaign] = useDonation();

    const { data: myAddedPets = [] } = useQuery({
        queryKey: ['myAddedPets', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/pets/myPets?email=${user.email}`);
            return res.data;
        }
    });

    const { data: myDonations = [] } = useQuery({
        queryKey: ['myDonation', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/myDonation/${user.email}`);
            return res.data;
        }
    });

    const recentPets = [...myAddedPets]
        .sort((a, b) => new Date(b['date and time']) - new Date(a['date and time']))
        .slice(0, 4);

    const recentDonations = [...myDonations]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 4);

    const adoptedCount = myAddedPets.filter((pet) => pet.adopted === 'true').length;
    const availableCount = myAddedPets.length - adoptedCount;
    const statusData = [
        { label: 'Adopted', value: adoptedCount },
        { label: 'Available', value: availableCount },
    ];

    return (
        <div className="space-y-6">
            {/* Hero */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-[hsl(270,45%,96%)] via-[hsl(263,50%,93%)] to-[hsl(35,55%,90%)] p-8 shadow-xl dark:border-white/10 dark:from-[hsl(265,38%,11%)] dark:via-[hsl(266,45%,20%)] dark:to-[hsl(30,45%,24%)] md:p-10"
            >
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-colorSecondary/20 blur-[90px]" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/20 blur-[90px]" />

                <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between lg:flex-col lg:items-start lg:justify-start">
                        <div>
                            <span className="font-bodyFont text-xs font-semibold uppercase tracking-[0.18em] text-colorSecondary">
                                Your dashboard
                            </span>
                            <h1 className="mt-2 font-headingFont text-3xl font-bold text-foreground dark:text-white md:text-4xl">
                                Welcome back, <span className="bg-colorSecondary bg-clip-text text-transparent dark:from-colorSecondary dark:to-amber-200">{user?.displayName || 'friend'}</span>
                            </h1>
                            <p className="mt-2 max-w-md text-foreground/70 dark:text-white/70">
                                Thanks for being part of Pet Squad — here's a snapshot of your pets and giving.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Link to="/dashboard/addPet" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 transition-transform hover:scale-105">
                                Add a pet
                            </Link>
                            <Link to="/dashboard/createDonationCampaign" className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-transform hover:scale-105 dark:border-white/15 dark:bg-white/5 dark:text-white">
                                Start a campaign
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
                            src={petsImg}
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
                    className="relative z-10 mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
                >
                    <StatCard icon={Dog} label="Pets you've added" value={myAddedPets.length} />
                    <StatCard icon={Gift} label="Donation campaigns" value={donationCampaign.length} />
                    <StatCard icon={HandCoins} label="Donations made" value={myDonations.length} />
                </motion.div>
            </motion.div>

            {/* Activity grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <ActivityListCard
                    title="My added pets"
                    viewAllTo="/dashboard/myAddedPets"
                    empty={myAddedPets.length === 0 ? "You haven't added any pets yet." : undefined}
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
                    title="My donations"
                    viewAllTo="/dashboard/myDonations"
                    empty={myDonations.length === 0 ? "You haven't made a donation yet." : undefined}
                >
                    {recentDonations.map((donation) => (
                        <ActivityRow
                            key={donation._id}
                            image={donation.image}
                            icon={!donation.image ? HandCoins : undefined}
                            title={donation.name}
                            subtitle="Donation"
                            meta={`$${donation.donatedAmount}`}
                        />
                    ))}
                </ActivityListCard>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5 }}
                    className="glow-hover rounded-2xl border border-border bg-card p-5 shadow-sm dark:border-white/10"
                >
                    <h3 className="mb-4 font-headingFont text-base font-bold text-foreground">Your pets' status</h3>
                    {myAddedPets.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">Add a pet to see its status here.</p>
                    ) : (
                        <DonutChart data={statusData} centerValue={myAddedPets.length} centerLabel="Your pets" />
                    )}
                </motion.div>
            </div>

            {/* Quick actions */}
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
                            { to: '/dashboard/addPet', icon: PlusCircle, label: 'Add new pet', classes: 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground' },
                            { to: '/dashboard/createDonationCampaign', icon: Gift, label: 'Create campaign', classes: 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white' },
                            { to: '/dashboard/adoptionRequest', icon: ClipboardList, label: 'Adoption requests', classes: 'bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white' },
                            { to: '/dashboard/myDonations', icon: HandCoins, label: 'My donations', classes: 'bg-colorSecondary/10 text-colorSecondary hover:bg-colorSecondary hover:text-violet-950' },
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
                    className="relative hidden w-40 shrink-0 overflow-hidden rounded-2xl shadow-lg lg:block"
                >
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

export default UserDashboard;
