import { ModeToggle } from '@/common/ModeToggle';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AuthContext } from '@/provider/AuthProvider';
import { useTheme } from '@/provider/ThemeProvider';
import { MenuIcon } from 'lucide-react';
import { MdPets } from 'react-icons/md';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import React, { useContext, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';


const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logoutUser } = useContext(AuthContext);
    const location = useLocation();
    const { theme } = useTheme();
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 16);
    });
    
   const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/petListing', label: 'Pet Listing' },
  { to: '/donationCampaigns', label: 'Donation Campaigns' },
  { to: '/contact', label: 'Contact' },

  ...(user?.email
    ? [{ to: '/dashboard', label: 'Dashboard' }]
    : []),
];
    const mobileNavLinkClass = ({ isActive }) =>
    `block px-4 py-2 font-semibold transition-colors duration-200 ${
        isActive ? 'text-primary' : 'text-foreground/80 hover:text-primary'
    }`;
    
    const mobileNavMenuLinks = <>
        {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} className={mobileNavLinkClass} to={item.to}>{item.label}</NavLink>
        ))}
    </>

    const handleLogout = () => {
        logoutUser()
            .then(() => {
                toast.success("Sign Out Successfully");
            })
            .catch(err => {
                toast.error('Failed to Sign Out');
            })
    }

    return (
        <div className="sticky top-0 z-50 w-full px-3 pb-2 pt-3 sm:px-6">
            <motion.div
                style={{ boxShadow: theme === 'dark'
                        ? (scrolled
                            ? '0 22px 45px -20px rgba(10,6,20,0.6), 0 0 0 1px rgba(234,179,8,0.12)'
                            : '0 10px 30px -18px rgba(10,6,20,0.4)')
                        : (scrolled
                            ? '0 22px 45px -20px rgba(91,52,176,0.35), 0 0 0 1px rgba(234,179,8,0.15)'
                            : '0 10px 30px -18px rgba(91,52,176,0.18)'),
                    transition: 'box-shadow 300ms ease-out',
                }}
                className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-border bg-card/90 px-3 py-2 text-foreground backdrop-blur-xl before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-gradient-to-r before:from-primary/25 before:via-colorSecondary/20 before:to-primary/25 before:blur-lg before:content-[''] dark:border-white/10 dark:bg-footer/95 dark:text-footer-foreground dark:before:from-primary/40 dark:before:via-colorSecondary/25 dark:before:to-primary/40">
                <Link to="/" className="flex shrink-0 items-center gap-2.5 py-1 pl-1">
                    <div className="relative">
                        <motion.img
                            whileHover={{ rotate: -8, scale: 1.06 }}
                            src="https://i.ibb.co.com/YTJWZs3K/image.png"
                            alt="Pet Squad logo"
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-colorSecondary/70"
                        />
                        <motion.span
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-card bg-colorSecondary text-violet-950 dark:border-footer"
                        >
                            <MdPets size={9} />
                        </motion.span>
                    </div>
                    <span className="hidden font-headingFont text-lg font-bold text-colorPrimary dark:text-colorSecondary sm:inline-block">
                        Pet Squad
                    </span>
                </Link>

                <nav className="relative hidden items-center gap-1 rounded-full bg-black/15 p-1 md:flex">
                    {NAV_ITEMS.map((item) => {
                        const isActive = location.pathname === item.to;
                        return (
                            <Link key={item.to} to={item.to} className="relative px-4 py-1.5 text-sm">
                                {isActive && (
                                    <motion.span
                                        layoutId="navActivePill"
                                        className="absolute inset-0 rounded-full bg-colorSecondary"
                                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                                    />
                                )}
                                <span className={`relative z-10 font-semibold transition-colors ${isActive ? 'text-violet-950' : 'text-foreground/70 hover:text-foreground dark:text-white/75 dark:hover:text-white'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
                    
                <div className="flex shrink-0 items-center gap-1.5">
                <ModeToggle></ModeToggle>

                    <div className="hidden md:block">
                        {user && user?.email ?
                            (<DropdownMenu>
                                <DropdownMenuTrigger>
                                    <motion.img
                                        whileHover={{ scale: 1.08 }}
                                        src={user?.photoURL}
                                        alt={user?.displayName}
                                        className="h-9 w-9 rounded-full cursor-pointer object-cover ring-2 ring-colorSecondary/70"
                                    />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent> 
                                    {/* <DropdownMenuItem>
                                        <NavLink to="/dashboard">Dashboard</NavLink>
                                    </DropdownMenuItem> */}
                                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>)
                            :
                            <Link to="/login">
                                <motion.span
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.96 }}
                                    className="inline-block rounded-full bg-colorSecondary px-4 py-1.5 text-sm font-semibold text-violet-950 shadow-md shadow-colorSecondary/30">
                                    Login
                                </motion.span>
                            </Link>
                        }
                    </div>

                    {/* for mobile responsive menu */}
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="ml-0.5 text-foreground hover:bg-foreground/10 dark:text-white dark:hover:bg-white/10 md:hidden">
                                <MenuIcon />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="left">
                            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                            <div className="mb-6 flex items-center gap-2">
                                <img
                                    src="https://i.ibb.co.com/YTJWZs3K/image.png"
                                    alt="Pet Squad logo"
                                    className="h-9 w-9 rounded-full object-cover ring-2 ring-colorSecondary/70"
                                />
                                <span className="font-headingFont text-lg font-bold text-colorPrimary">Pet Squad</span>
                            </div>
                            <div className="flex flex-col items-start gap-1">
                                {mobileNavMenuLinks}
                            </div>

                            {user && user?.email ?
                                (
                                <ul className="mt-2">
                                    {/* <li>
                                    <NavLink className={mobileNavLinkClass} to="/dashboard">Dashboard</NavLink>
                                    </li> */}
                                    <li>
                                    <NavLink className={mobileNavLinkClass} onClick={handleLogout}>Logout</NavLink>
                                    </li>
                                </ul>)
                                :
                                <NavLink className={mobileNavLinkClass} to="/login">Login</NavLink>
                            }
                        </SheetContent>
                    </Sheet>
                </div>
            </motion.div>
        </div>
    );
};

export default Navbar;
