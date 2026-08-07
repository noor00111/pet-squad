import PetsAdoptModal from '@/components/pets/PetsAdoptModal/PetsAdoptModal';
import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import { AuthContext } from '@/provider/AuthProvider';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { Helmet } from 'react-helmet-async';
import { useLoaderData, useNavigate } from 'react-router-dom';
import {ArrowLeft, Calendar, Heart, Info, MapPin, PawPrint, Share2, ShieldCheck, Sparkles, Tag, User} from 'lucide-react';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(92vw, 480px)',
        maxHeight: '88vh',
        padding: 0,
        border: 'none',
        borderRadius: '1.5rem',
        overflow: 'auto',
        backgroundColor: 'transparent',
        boxShadow: '0 25px 60px -15px hsl(265, 60%, 20%, 0.45)',
    },
    overlay: {
        backgroundColor: 'hsla(265, 30%, 8%, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 50,
    },
};

const CATEGORY_EMOJI = {
    dog: '🐶', cat: '🐱', bird: '🐦', rabbit: '🐰', fish: '🐠', hamster: '🐹', panda: '🐼',
};

const PetDetails = () => {
    const petsData = useLoaderData();
    const {name, image, age, category, location, ownerEmail, adopted, "short description": shortDescription, "long description": longDescription, "date and time": dateAdded} = petsData;
    const [modalIsOpen, setIsOpen] = useState(false);
    const [saved, setSaved] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const emoji = CATEGORY_EMOJI[category?.toLowerCase()] ?? '🐾';
    const isAvailable = adopted !== 'true';

    const handleAdopt = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setIsOpen(true);
    };

    const closeModal = () => setIsOpen(false);

    const infoRows = [
        { icon: Tag, tone: 'primary', label: 'Category', value: category ?? '—' },
        { icon: Calendar, tone: 'secondary', label: 'Age', value: age ? `${age} ${Number(age) === 1 ? 'Year' : 'Years'}` : '—' },
        { icon: MapPin, tone: 'violet', label: 'Location', value: location ?? '—' },
        { icon: Calendar, tone: 'rose', label: 'Added On', value: dateAdded ? dateAdded.split(',')[0] : '—' },
        { icon: ShieldCheck, tone: 'emerald', label: 'Health', value: 'Vaccinated', badge: true },
    ];

    const toneClasses = {
        primary: 'bg-primary/10 text-primary',
        secondary: 'bg-colorSecondary/15 text-colorSecondary',
        violet: 'bg-violet-500/10 text-violet-500',
        rose: 'bg-rose-500/10 text-rose-500',
        sky: 'bg-sky-500/10 text-sky-500',
        emerald: 'bg-emerald-500/10 text-emerald-500',
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <Helmet><title>{name} | Pet Squad</title></Helmet>

            <motion.button
                type="button"
                onClick={() => navigate(-1)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={{ x: -3 }}
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-colorSecondary transition-colors hover:text-colorSecondary/80"
            >
                <ArrowLeft className="h-4 w-4" /> Back to Pets
            </motion.button>

            <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-secondary shadow-xl shadow-primary/10 lg:sticky lg:top-24">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl"
                        style={{ backgroundImage: `url(${image})` }}
                    />
                    <div className="absolute inset-0 bg-background/40" />

                    <motion.img
                        src={image}
                        alt={name}
                        initial={{ scale: 1.08, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative h-full w-full object-contain drop-shadow-2xl"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    <div className="absolute right-4 top-4 flex gap-2">
                        <motion.button
                            type="button"
                            onClick={() => setSaved((s) => !s)}
                            whileTap={{ scale: 0.85 }}
                            aria-label={saved ? 'Remove from favorites' : 'Save to favorites'}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md backdrop-blur-md transition-colors hover:bg-white">
                            <Heart className={`h-4.5 w-4.5 transition-all ${saved ? 'scale-110 fill-rose-500' : 'text-rose-600'}`} />
                        </motion.button>
                        <motion.button
                            type="button"
                            whileTap={{ scale: 0.85 }}
                            aria-label="Share this pet"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md backdrop-blur-md transition-colors hover:bg-white"
                        >
                            <Share2 className="h-4 w-4 text-purple-600" />
                        </motion.button>
                    </div>
                </motion.div>

                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h1 className="font-headingFont text-3xl font-bold text-foreground sm:text-4xl">{name}</h1>
                            <PawPrint className="h-6 w-6 text-colorSecondary" />
                        </div>
                        {shortDescription && (
                            <p className="mt-1 text-base font-medium text-colorSecondary">{shortDescription}</p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                            {[
                                { icon: emoji, label: category ?? 'Pet', tone: 'bg-primary/10 text-primary' },
                                { icon: '🎂', label: age ? `${age} ${Number(age) === 1 ? 'Year' : 'Years'}` : '—', tone: 'bg-emerald-500/10 text-emerald-600' },
                                { icon: '📍', label: location ?? '—', tone: 'bg-violet-500/10 text-violet-500' },
                            ].map((chip) => (
                                <span
                                    key={chip.label}
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold capitalize ${chip.tone}`}
                                >
                                    <span>{chip.icon}</span> {chip.label}
                                </span>
                            ))}
                        </div>

                        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600">
                            <ShieldCheck className="h-3.5 w-3.5" /> Vaccinated
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className={`mt-5 flex items-center justify-between gap-3 rounded-2xl border p-4 ${
                            isAvailable
                                ? 'border-colorSecondary/30 bg-gradient-to-br from-colorSecondary/10 via-primary/5 to-transparent'
                                : 'border-border bg-muted/50'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isAvailable ? 'bg-colorSecondary/20 text-colorSecondary' : 'bg-muted text-muted-foreground'}`}>
                                <Sparkles className="h-4 w-4" />
                            </span>
                            <div>
                                <p className="text-sm font-bold text-foreground">
                                    {isAvailable ? 'Available for Adoption' : 'Already Adopted'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {isAvailable ? `${name} is ready to find their forever home!` : `${name} has already found a loving family.`}
                                </p>
                            </div>
                        </div>
                        <Heart className="h-4 w-4 shrink-0 text-colorSecondary/60" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative mt-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
                        <h2 className="flex items-center gap-2 font-headingFont text-base font-bold text-foreground">
                            <PawPrint className="h-4 w-4 text-primary" /> About {name}
                        </h2>
                        <p className="mt-2 leading-relaxed text-muted-foreground">
                            {longDescription || shortDescription || 'This good boy or girl is looking for a loving forever home. Reach out to learn more about their story and personality.'}
                        </p>
                        <Heart className="pointer-events-none absolute -right-2 -top-2 h-16 w-16 text-colorSecondary/10" />
                    </motion.div>

                    <motion.div
                        variants={staggerContainer(0.05, 0.25)}
                        initial="hidden"
                        animate="visible"
                        className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
                    >
                        <h2 className="flex items-center gap-2 font-headingFont text-base font-bold text-foreground">
                            <Info className="h-4 w-4 text-primary" /> Information
                        </h2>
                        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
                            {infoRows.map(({ icon: Icon, tone, label, value, badge }) => (
                                <motion.div key={label} variants={fadeUp} className="flex items-start gap-2.5">
                                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${toneClasses[tone]}`}>
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">{label}</p>
                                        <p className="truncate text-sm font-semibold capitalize text-foreground">
                                            {value}
                                            {badge && <ShieldCheck className="ml-1 inline h-3.5 w-3.5 text-emerald-500" />}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-6"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleAdopt}
                            disabled={!isAvailable}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-colorSecondary to-amber-400 px-4 py-4 text-base font-bold text-amber-950 shadow-lg shadow-colorSecondary/30 transition-shadow hover:shadow-xl hover:shadow-colorSecondary/40 disabled:cursor-not-allowed disabled:bg-none disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
                        >
                            <PawPrint className="h-5 w-5" /> {isAvailable ? `Adopt ${name}` : 'Already Adopted'}
                        </motion.button>
                        <p className="mt-3 text-center text-xs text-muted-foreground">
                            Safe adoption &nbsp;•&nbsp; Verified pets &nbsp;•&nbsp; Better future
                        </p>
                    </motion.div>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Adopt this pet">
                {modalIsOpen && <PetsAdoptModal pet={petsData} closeModal={closeModal} />}
            </Modal>
        </motion.div>
    );
};

export default PetDetails;
