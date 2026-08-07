import React, { useState } from 'react';
import { motion } from "framer-motion";
import { MdPets } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { Search, PawPrint, Users, ShieldCheck } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/motion';

const STATS = [
    { icon: PawPrint, value: '2,400+', label: 'Pets rehomed', tone: 'primary' },
    { icon: Users, value: '180+', label: 'Partner shelters', tone: 'primary' },
    { icon: ShieldCheck, value: '24/7', label: 'Adoption support', tone: 'accent' },
];

const LEAVES = [
    { top: '10%', left: '6%', size: 14, color: 'bg-emerald-400/50', duration: 7, delay: 0 },
    { top: '22%', left: '46%', size: 10, color: 'bg-colorSecondary/40', duration: 8, delay: 1.2 },
    { top: '68%', left: '10%', size: 12, color: 'bg-primary/30', duration: 9, delay: 0.6 },
    { top: '78%', left: '38%', size: 9, color: 'bg-emerald-400/40', duration: 6.5, delay: 2 },
    { top: '14%', left: '30%', size: 8, color: 'bg-colorSecondary/40', duration: 7.5, delay: 1.6 },
];

const Banner = () => {
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchValue.trim()) {
            navigate(`/petListing?search=${encodeURIComponent(searchValue.trim())}`);
        } else {
            navigate("/petListing");
        }
    };

    return (
        <div className="relative px-3 pb-4 sm:px-6">
            <div className="relative overflow-hidden rounded-[2.5rem] before:absolute before:inset-0 before:-z-10 before:rounded-[2.5rem] before:bg-gradient-to-r before:from-primary/20 before:via-colorSecondary/15 before:to-primary/20 before:blur-2xl before:content-[''] dark:before:from-primary/40 dark:before:via-colorSecondary/25 dark:before:to-primary/40">
                <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-gradient-to-br from-[hsl(270,50%,98%)] via-[hsl(268,45%,96%)] to-[hsl(260,42%,94%)] px-6 py-14 shadow-[0_30px_80px_-30px_rgba(91,52,176,0.2)] dark:border-white/10 dark:from-[hsl(265,40%,9%)] dark:via-[hsl(266,50%,19%)] dark:to-[hsl(30,50%,24%)] dark:shadow-[0_30px_80px_-30px_rgba(10,6,20,0.65)] sm:px-10 lg:px-14 lg:py-20">

                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <motion.div
                            className="absolute left-10 top-10 h-72 w-72 rounded-full bg-colorSecondary/20 blur-[90px] dark:bg-colorSecondary/25"
                            animate={{ x: [0, 30, 0], y: [0, 15, 0] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}/>
                        <motion.div
                            className="absolute bottom-10 right-20 h-80 w-80 rounded-full bg-primary/20 blur-[100px] dark:bg-primary/30"
                            animate={{ x: [0, -25, 0], y: [0, -35, 0] }}
                            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}/>
                    </div>

                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        {LEAVES.map((leaf, i) => (
                            <motion.span
                                key={i}
                                style={{ top: leaf.top, left: leaf.left, width: leaf.size, height: leaf.size }}
                                className={`absolute rounded-tr-full rounded-bl-full ${leaf.color}`}
                                animate={{ y: [0, -18, 0], x: [0, 8, 0], rotate: [0, 25, 0], opacity: [0.5, 0.9, 0.5] }}
                                transition={{ duration: leaf.duration, delay: leaf.delay, repeat: Infinity, ease: "easeInOut" }}
                            />
                        ))}
                    </div>

                    <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94, x: -20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="order-2 overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/20 lg:order-1">
                            <motion.img
                                src="https://i.ibb.co.com/md55Qwr/pets.png"
                                alt="cute pets"
                                animate={{ scale: [1, 1.04, 1] }}
                                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                                className="h-[280px] w-full object-cover sm:h-[360px] lg:h-[440px]"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                            className="order-1 text-center lg:order-2 lg:max-w-xl lg:text-left">
                            <h1 className="text-balance font-headingFont text-4xl font-bold leading-[1.15] text-foreground text-primary dark:text-colorSecondary lg:text-5xl">
                                A home full of love starts with{' '}
                                <span className="inline-flex items-center gap-2 ">
                                    Pet Squad
                                    <motion.span
                                        animate={{ rotate: [0, -12, 10, 0] }}
                                        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" }}
                                        className="text-colorSecondary">
                                        <MdPets />
                                    </motion.span>
                                </span>
                            </h1>

                            <p className="mx-auto mt-4 max-w-md font-bodyFont text-base leading-relaxed text-foreground/70 dark:text-white/70 lg:mx-0">
                                Join us in our dedicated efforts to find loving homes for every pet in need. Adoption is the first step toward a brighter, happier future for our furry friends.
                            </p>

                            <form onSubmit={handleSearch}
                                className="mx-auto mt-6 flex max-w-md items-center rounded-full border border-border bg-white p-1.5 shadow-lg transition-colors duration-300 focus-within:border-primary/50 dark:border-white/15 dark:bg-white/10 lg:mx-0">
                                <input
                                    type="text"
                                    placeholder="Search dogs, cats, rabbits..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    className="w-full flex-grow border-0 bg-transparent px-4 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground dark:text-white dark:placeholder:text-white/50"
                                />
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    className="flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-primary to-primary/80 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 transition-shadow hover:shadow-lg"
                                >
                                    <Search className="h-4 w-4" /> Search
                                </motion.button>
                            </form>

                            <motion.div
                                variants={staggerContainer(0.12, 0.5)}
                                initial="hidden"
                                animate="visible"
                                className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                                {STATS.map(({ icon: Icon, value, label, tone }) => (
                                    <motion.div
                                        key={label}
                                        variants={fadeUp}
                                        whileHover={{ y: -3 }}
                                        className="flex items-center gap-2.5 rounded-2xl border border-border bg-white px-3.5 py-2.5 shadow-sm dark:border-white/10 dark:bg-white/5"
                                    >
                                        <span
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                                tone === 'accent'
                                                    ? 'bg-colorSecondary/15 text-colorSecondary'
                                                    : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-colorSecondary'
                                            }`}>
                                            <Icon className="h-4 w-4" />
                                        </span>
                                        <div className="text-left">
                                            <p className="font-headingFont text-sm font-bold leading-none text-foreground dark:text-white">{value}</p>
                                            <p className="mt-0.5 text-[11px] text-muted-foreground dark:text-white/55">{label}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>

                    <div className="pointer-events-none absolute right-4 top-6 z-20 hidden h-28 w-28 sm:right-6 lg:block xl:right-10 xl:h-32 xl:w-32">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                            transition={{ opacity: { duration: 0.6, delay: 0.6 }, scale: { duration: 0.6, delay: 0.6 }, y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
                            whileHover={{ scale: 1.08 }}
                            className="pointer-events-auto absolute right-0 top-0 h-20 w-20 rounded-full bg-gradient-to-br from-primary to-colorSecondary p-[3px] shadow-xl xl:h-40 xl:w-40">
                            <div className="h-full w-full overflow-hidden rounded-full border-[3px] border-background">
                                <img src="https://i.ibb.co.com/9GynvHj/banner3.jpg" alt="A child bonding with her adopted rabbit" className="h-full w-full object-cover" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: [0, 8, 0] }}
                            transition={{ opacity: { duration: 0.6, delay: 0.75 }, scale: { duration: 0.6, delay: 0.75 }, y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.3 } }}
                            whileHover={{ scale: 1.08 }}
                            className="pointer-events-auto absolute top-52 right-10 h-20 w-20 rounded-full bg-gradient-to-br from-colorSecondary to-primary p-[3px] shadow-xl xl:h-40 xl:w-40">
                            <div className="h-full w-full overflow-hidden rounded-full border-[3px] border-background">
                                <img src="https://i.ibb.co.com/zH1fmj0/banner2.jpg" alt="A woman feeding treats to her adopted cat" className="h-full w-full object-cover" />
                            </div>
                            <span className="absolute -top-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-rose-200 text-[20px] shadow-md">❤️</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;
