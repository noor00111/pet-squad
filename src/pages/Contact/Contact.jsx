import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import {AtSign, Check, Clock, Mail, MapPin, MessageSquare, PawPrint, Phone, Send, User} from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/motion';
import {DoodleRing, DoodleSpark, DoodleSquiggle } from '@/components/Doodle/Doodles';
import contact from "@/assets/images/contact.png";


const CONTACT_EMAIL = 'petsquad@gmail.com';

const INFO_TILES = [
    {
        icon: Mail,
        tone: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
        title: 'Email us',
        lines: [CONTACT_EMAIL],
        href: `mailto:${CONTACT_EMAIL}`,
        note: 'We usually reply within 24 hours',
    },
    {
        icon: Phone,
        tone: 'bg-rose-100 text-rose-500 dark:bg-rose-500/15 dark:text-rose-400',
        title: 'Call us',
        lines: ['+880 1234567890'],
        href: 'tel:+8801234567890',
        note: 'Sun – friday, 9:00 AM – 7:00 PM',
    },
    {
        icon: MapPin,
        tone: 'bg-primary/15 text-primary dark:bg-primary/20 dark:text-colorSecondary',
        title: 'Visit us',
        lines: ['Bangladesh'],
        note: 'By appointment',
    },
    {
        icon: Clock,
        tone: 'bg-colorSecondary/15 text-colorSecondary',
        title: 'Working hours',
        lines: ['9:00 AM – 7:00 PM'],
        note: 'Sunday – Friday',
    },
];

const Field = ({ icon: Icon, label, ...props }) => (
    <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 dark:text-colorSecondary/70">
            <Icon className="h-4 w-4" />
        </span>
        <input
            {...props}
            aria-label={label}
            placeholder={label}
            className="w-full rounded-xl border border-border bg-secondary/40 py-3 pl-10 pr-3 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 dark:border-white/10 dark:bg-white/5"
        />
    </div>
);

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sending, setSending] = useState(false);

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setSending(true);

        const body = `${form.message}\n\n— ${form.name} (${form.email})`;
        const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(form.subject || 'Message from Pet Squad')}&body=${encodeURIComponent(body)}`;

        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Opening your email app…',
            text: 'Finish sending your message from there.',
            showConfirmButton: false,
            timer: 1800,
        });

        window.location.href = mailto;
        setForm({ name: '', email: '', subject: '', message: '' });
        setSending(false);
    };

    return (
        <div className="bg-[#FDF8F0] transition-colors duration-300 dark:bg-background">
            <Helmet>
                <title>Contact | Pet Squad</title>
            </Helmet>

            <div className="relative overflow-hidden px-3 pt-6 sm:px-6">
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
                            className="text-center lg:text-left"
                        >
                            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 font-bodyFont text-xs font-semibold uppercase tracking-[0.18em] text-primary dark:border-colorSecondary/30 dark:bg-colorSecondary/10 dark:text-colorSecondary">
                                <PawPrint className="h-3.5 w-3.5" /> We'd love to hear from you
                            </span>

                            <h1 className="mt-5 text-balance font-headingFont text-4xl font-semibold leading-[1.15] text-[#3F3730] dark:text-white lg:text-5xl">
                                Let's connect &amp;
                                <br />
                                <span className="relative inline-block">
                                    make a difference
                                    <DoodleSquiggle className="absolute -bottom-4 left-0 h-4 w-full text-primary" delay={0.6} />
                                </span>
                            </h1>

                            <p className="mx-auto mt-6 max-w-md text-pretty font-bodyFont text-base leading-relaxed text-[#6B6255] dark:text-white/70 lg:mx-0">
                                Have a question, a suggestion, or want to collaborate? We're here for you and happy to
                                help.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
                            className="relative mx-auto max-w-md lg:max-w-none"
                        >
                            <div className="relative overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl shadow-[#8FB08F]/20 dark:border-white/10">
                                <motion.img
                                    src={contact}
                                    alt="A tabby cat in a cozy bed beside an 'Adopt, Love, Repeat' sign"
                                    className="h-[280px] w-full object-cover sm:h-[340px]"
                                    animate={{ scale: [1, 1.03, 1] }}
                                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                                />
                            </div>
                            <DoodleRing className="pointer-events-none absolute -left-6 -top-6 h-16 w-16 text-colorSecondary/60 sm:h-20 sm:w-20" />
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="relative px-3 py-16 sm:px-6 lg:px-10">
                <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}>
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#3F3730] px-4 py-2 font-bodyFont text-sm font-semibold text-white dark:bg-primary">
                            <PawPrint className="h-4 w-4 text-colorSecondary" /> Get in touch
                        </span>
                        <p className="mt-4 max-w-sm text-pretty font-bodyFont text-sm leading-relaxed text-muted-foreground">
                            We're always here to help you and your furry friends. Reach out using any of the options
                            below.
                        </p>

                        <motion.div
                            variants={staggerContainer(0.12)}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {INFO_TILES.map(({ icon: Icon, tone, title, lines, href, note }) => {
                                const Wrapper = href ? 'a' : 'div';
                                return (
                                    <motion.div key={title} variants={fadeUp} whileHover={{ y: -5 }} className="glow-hover rounded-2xl border border-border bg-card p-5 shadow-sm">
                                        <span className={`flex h-10 w-10 items-center justify-center rounded-full ${tone}`}>
                                            <Icon className="h-4.5 w-4.5" />
                                        </span>
                                        <h3 className="mt-3 font-headingFont text-base font-semibold text-foreground">{title}</h3>
                                        <Wrapper href={href} className={`mt-1 block text-sm font-medium ${href ? 'text-primary hover:underline dark:text-colorSecondary' : 'text-foreground/80'}`}>
                                            {lines.map((l) => (
                                                <span key={l} className="block">{l}</span>
                                            ))}
                                        </Wrapper>
                                        <p className="mt-1.5 text-xs text-muted-foreground">{note}</p>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="relative rounded-[1.75rem] border border-border bg-card p-6 shadow-xl shadow-black/5 sm:p-8">
                        <h2 className="font-headingFont text-2xl font-semibold text-foreground">Send us a message</h2>
                        <p className="mt-1.5 text-sm text-muted-foreground">Fill out the form and we'll get back to you soon.</p>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field icon={User} label="Your name" name="name" value={form.name} onChange={handleChange} required />
                                <Field icon={AtSign} label="Your email" type="email" name="email" value={form.email} onChange={handleChange} required />
                            </div>
                            <Field icon={MessageSquare} label="Subject" name="subject" value={form.subject} onChange={handleChange} required />
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-4 text-primary/60 dark:text-colorSecondary/70">
                                    <MessageSquare className="h-4 w-4" />
                                </span>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    placeholder="Your message"
                                    className="w-full resize-none rounded-xl border border-border bg-secondary/40 py-3 pl-10 pr-3 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 dark:border-white/10 dark:bg-white/5"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-4 pt-1">
                                <motion.button
                                    type="submit"
                                    disabled={sending}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="inline-flex items-center gap-2 rounded-full bg-[#3F3730] px-6 py-3 font-bodyFont text-sm font-semibold text-white shadow-lg shadow-black/10 transition-colors hover:bg-[#4d443b] disabled:opacity-60 dark:bg-primary dark:hover:bg-primary/90">
                                    Send message <Send className="h-4 w-4" />
                                </motion.button>
                                <span className="relative flex items-center gap-1.5 font-headingFont text-xs italic text-muted-foreground">
                                    <DoodleSpark className="h-4 w-4 text-colorSecondary" delay={0.2} />
                                    We care about every message
                                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                                </span>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>

        
        </div>
    );
};

export default Contact;
