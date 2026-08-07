import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LuCopyright } from "react-icons/lu";
import { Link } from 'react-router-dom';
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import { ChevronRight, Clock, Mail, MapPin, PawPrint, Phone, Send } from 'lucide-react';
import Swal from 'sweetalert2';
import { fadeUp, staggerContainer } from '@/lib/motion';

const SUPPORT_EMAIL = 'mail@gmail.com';

const socialLinks = [
  { to: "https://facebook.com", Icon: FaFacebook, label: "Facebook" },
  { to: "https://twitter.com", Icon: FaXTwitter, label: "X" },
  { to: "https://instagram.com", Icon: FaInstagramSquare, label: "Instagram" },
];

const footerLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/petListing", label: "Pet Listing" },
  { to: "/donationCampaigns", label: "Donation Campaigns" },
  { to: "/contact", label: "Contact" },
];

const contactInfo = [
  { icon: MapPin, label: "Visit us", value: "Chittagong, Bangladesh" },
  { icon: Phone, label: "Call us", value: "+880 1234567890" },
  { icon: Clock, label: "Working hours", value: "9:00 AM – 7:00 PM" },
  { icon: Mail, label: "Email us", value: SUPPORT_EMAIL },
];

const PAW_WATERMARKS = [
  { top: '8%', left: '4%', size: 28, rotate: -12 },
  { top: '18%', left: '22%', size: 16, rotate: 20 },
  { top: '6%', left: '46%', size: 20, rotate: -6 },
  { top: '14%', left: '68%', size: 24, rotate: 15 },
  { top: '10%', left: '90%', size: 18, rotate: -18 },
  { top: '70%', left: '12%', size: 22, rotate: 10 },
  { top: '78%', left: '58%', size: 16, rotate: -22 },
  { top: '65%', left: '84%', size: 26, rotate: 8 },
];

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Opening your email app…',
      text: 'Send it to confirm your subscription.',
      showConfirmButton: false,
      timer: 1800,
    });

    const body = `Please subscribe this email to Pet Squad updates: ${email}`;
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Subscribe me to updates')}&body=${encodeURIComponent(body)}`;
    setEmail('');
  };

  return (
      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative mx-auto overflow-hidden bg-footer text-footer-foreground py-14 px-6 sm:px-10 lg:px-16">

        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-[100px]" />
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-colorSecondary/10 blur-[100px]" />
        {PAW_WATERMARKS.map((p, i) => (
          <PawPrint
            key={i}
            style={{ top: p.top, left: p.left, width: p.size, height: p.size, transform: `rotate(${p.rotate}deg)` }}
            className="pointer-events-none absolute text-white/[0.05]"
          />
        ))}

        <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          <motion.div variants={fadeUp}>
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="https://i.ibb.co.com/YTJWZs3K/image.png"
                alt="Pet Squad logo"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-colorSecondary/70"
              />
              <span className="font-headingFont text-2xl font-bold text-colorSecondary">
                Pet Squad
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-footer-foreground/70">
              Bringing pets and their future families together with love and care.
            </p>

            <h3 className="mt-6 font-headingFont text-base font-bold text-colorSecondary">About Us</h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-footer-foreground/70">
              We believe that every pet deserves a loving home and every pet owner deserves a loyal companion. Our mission is to connect furry friends with their forever families, creating bonds that last a lifetime!
            </p>

            <div className="mt-5 flex gap-3">
              {socialLinks.map(({ to, Icon, label }) => (
                <motion.a
                  key={to}
                  href={to}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-footer-foreground/80 transition-colors hover:border-colorSecondary hover:text-colorSecondary"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h3 className="font-headingFont text-base font-bold text-colorSecondary">Quick Links</h3>
            <span className="mt-2 block h-0.5 w-8 rounded-full bg-colorSecondary" />
            <ul className="mt-4">
              {footerLinks.map(({ to, label }) => (
                <li key={to} className="border-b border-dashed border-white/10 last:border-0">
                  <Link
                    to={to}
                    className="group flex items-center gap-2 py-2.5 text-sm text-footer-foreground/75 transition-colors hover:text-colorSecondary"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-colorSecondary/70 transition-transform group-hover:translate-x-0.5" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h3 className="font-headingFont text-base font-bold text-colorSecondary">Contact Info</h3>
            <span className="mt-2 block h-0.5 w-8 rounded-full bg-colorSecondary" />
            <ul className="mt-4 space-y-3.5">
              {contactInfo.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-colorSecondary/40 text-colorSecondary">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{value}</p>
                    <p className="text-xs text-footer-foreground/55">{label}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h3 className="font-headingFont text-base font-bold text-colorSecondary">Stay Updated</h3>
            <span className="mt-2 block h-0.5 w-8 rounded-full bg-colorSecondary" />
            <p className="mt-4 text-sm leading-relaxed text-footer-foreground/70">
              Subscribe to hear about new pets looking for a home and fresh donation campaigns.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 space-y-2.5">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-footer-foreground/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full rounded-full border border-white/15 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-footer-foreground/40 focus:border-colorSecondary/60"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-colorSecondary px-4 py-2.5 text-sm font-semibold text-violet-950 shadow-md shadow-colorSecondary/20 transition-colors hover:bg-colorSecondary/90"
              >
                <Send className="h-3.5 w-3.5" /> Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>

        <motion.div variants={fadeUp} className="relative mt-12 flex items-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-colorSecondary/40 to-colorSecondary/40" />
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-colorSecondary/50 text-colorSecondary">
            <PawPrint className="h-4 w-4" />
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-colorSecondary/40 to-colorSecondary/40" />
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="relative mt-6 flex flex-col items-center gap-1.5 text-center text-sm text-footer-foreground/60"
        >
          <p className="flex items-center gap-1.5">
            <LuCopyright size={16} /> {new Date().getFullYear()} Pet Squad. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
  );
};

export default Footer;
