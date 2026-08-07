import PageTransition from '@/common/PageTransition';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import useAdmin from '@/hooks/useAdmin';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { AuthContext } from '@/provider/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {ClipboardList, Dog, Gift, HandCoins, HeartHandshake, Home, LogOut, PawPrint, PlusCircle, Users, Wallet, X} from 'lucide-react';
import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import sleepingPuppy from '@/assets/images/sleeping puppy.png';

const linkClass = ({ isActive }) =>
    `relative flex items-center gap-3 rounded-xl px-4 py-2.5 font-bodyFont text-sm font-semibold transition-colors duration-200 ${
        isActive
            ? 'text-primary-foreground'
            : 'text-foreground/70 hover:bg-secondary hover:text-foreground dark:text-footer-foreground/70 dark:hover:bg-white/10 dark:hover:text-footer-foreground'
    }`;

const SidebarLink = ({ to, icon: Icon, children, onClick }) => (
    <motion.li variants={fadeUp}>
        <NavLink to={to} className={linkClass} onClick={onClick} end>
            {({ isActive }) => (
                <>
                    {isActive && (
                        <motion.span
                            layoutId="dashboard-active-pill"
                            className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary/80 shadow-md shadow-primary/30"
                            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        />
                    )}
                    <Icon className="relative z-10 h-4 w-4 shrink-0" />
                    <span className="relative z-10">{children}</span>
                </>
            )}
        </NavLink>
    </motion.li>
);

const SidebarContent = ({ user, admin, onLogout, onLinkClick }) => (
    <>
        <div className="flex items-center gap-2.5 px-6 py-6">
            <Link to="/" className="relative">
                <img
                    src="https://i.ibb.co.com/YTJWZs3K/image.png"
                    alt="Pet Squad logo"
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-colorSecondary/70"
                />
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-card bg-colorSecondary text-violet-950 dark:border-footer">
                    <PawPrint size={7} />
                </span>
            </Link>
            <Link to="/" className="text-colorPrimary dark:text-colorSecondary bg-clip-text font-headingFont text-lg font-bold dark:from-white dark:to-colorSecondary">
                Pet Squad
            </Link>
        </div>

        <div className="mx-6 mb-6 flex items-center gap-3 rounded-2xl border border-border bg-secondary/60 p-3 dark:border-white/10 dark:bg-white/5">
            <img
                src={user?.photoURL}
                alt={user?.displayName}
                className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-colorSecondary/70"
            />
            <div className="min-w-0">
                <p className="truncate font-headingFont text-sm font-bold text-foreground">
                    {user?.displayName || 'Welcome'}
                </p>
                <span className="inline-block rounded-full border border-colorSecondary/40 bg-colorSecondary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-colorSecondary">
                    {admin ? 'Admin' : 'Member'}
                </span>
            </div>
        </div>

        <motion.ul
            variants={staggerContainer(0.04)}
            initial="hidden"
            animate="visible"
            className="flex-1 space-y-1 overflow-y-auto px-4">
            {admin && (
                <>
                    <SidebarLink to="/dashboard/admin" icon={Home} onClick={onLinkClick}>Admin Dashboard</SidebarLink>
                    <SidebarLink to="/dashboard/allUsers" icon={Users} onClick={onLinkClick}>Users</SidebarLink>
                    <SidebarLink to="/dashboard/allPets" icon={PawPrint} onClick={onLinkClick}>All Pets</SidebarLink>
                    <SidebarLink to="/dashboard/allDonations" icon={HandCoins} onClick={onLinkClick}>All Donations</SidebarLink>
                    <div className="my-3 border-t border-border dark:border-white/10" />
                </>
            )}

            <SidebarLink to="/dashboard/user" icon={Home} onClick={onLinkClick}>User Dashboard</SidebarLink>
            <SidebarLink to="/dashboard/addPet" icon={PlusCircle} onClick={onLinkClick}>Add a Pet</SidebarLink>
            <SidebarLink to="/dashboard/myAddedPets" icon={Dog} onClick={onLinkClick}>My Added Pets</SidebarLink>
            <SidebarLink to="/dashboard/adoptionRequest" icon={ClipboardList} onClick={onLinkClick}>Adoption Request</SidebarLink>
            <SidebarLink to="/dashboard/createDonationCampaign" icon={Gift} onClick={onLinkClick}>Create Donation Campaigns</SidebarLink>
            <SidebarLink to="/dashboard/myDonationCampaigns" icon={HeartHandshake} onClick={onLinkClick}>My Donation Campaigns</SidebarLink>
            <SidebarLink to="/dashboard/myDonations" icon={Wallet} onClick={onLinkClick}>My Donations</SidebarLink>
        </motion.ul>

        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative mx-4 mt-4 overflow-hidden rounded-2xl shadow-lg"
        >
            <motion.img
                src={sleepingPuppy}
                alt="Puppy napping peacefully"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="h-32 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <motion.span
                animate={{ opacity: [0.5, 1, 0.5], y: [0, -3, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-3 top-3 text-base"
            >
                💤
            </motion.span>
            <p className="absolute bottom-3 left-3 right-3 font-bodyFont text-xs font-medium text-white/90">
                Sweet dreams, little one 🐾
            </p>
        </motion.div>

        <button
            onClick={onLogout}
            className="mx-4 mb-4 mt-3 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10">
            <LogOut className="h-4 w-4" /> Logout
        </button>
    </>
);

const Dashboard = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const [admin] = useAdmin();
    const axiosSecure = useAxiosSecure();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const { data: incomingRequests = [] } = useQuery({
        queryKey: ['adoptionRequestsFor', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/adoption/request?email=${user.email}`);
            return res.data;
        }
    });
    const pendingCount = incomingRequests.filter((r) => r.status === 'pending').length;

    const handleLogout = () => {
        logoutUser()
            .then(() => toast.success('Signed out successfully'))
            .catch(() => toast.error('Failed to sign out'));
    };

    return (
        <div className="flex min-h-screen bg-background font-bodyFont">
            <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-border bg-card dark:border-white/10 dark:bg-footer/95 lg:flex">
                <SidebarContent user={user} admin={admin} onLogout={handleLogout} />
            </aside>

            <AnimatePresence>
                {mobileNavOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileNavOpen(false)}
                            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.25 }}
                            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card dark:border-white/10 dark:bg-footer/95 lg:hidden">
                            <button
                                onClick={() => setMobileNavOpen(false)}
                                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-foreground hover:bg-secondary dark:hover:bg-white/10">
                                <X className="h-4 w-4" />
                            </button>
                            <SidebarContent user={user} admin={admin} onLogout={handleLogout} onLinkClick={() => setMobileNavOpen(false)} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <div className="flex min-w-0 flex-1 flex-col">
                <DashboardHeader notificationCount={pendingCount} onMenuClick={() => setMobileNavOpen(true)} />
                <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">
                    <PageTransition></PageTransition>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
