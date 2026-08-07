import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Menu, Search } from 'lucide-react';
import { ModeToggle } from '@/common/ModeToggle';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AuthContext } from '@/provider/AuthProvider';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ notificationCount = 0, onMenuClick }) => {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/petListing${searchValue.trim() ? `?search=${encodeURIComponent(searchValue.trim())}` : ''}`);
    };

    return (
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-4 backdrop-blur-xl dark:border-white/10 sm:px-6">
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="shrink-0 lg:hidden">
                <Menu />
            </Button>

            <form
                onSubmit={handleSearch}
                className="hidden max-w-sm flex-1 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 transition-colors focus-within:border-primary dark:border-white/10 dark:bg-white/5 sm:flex"
            >
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    type="text"
                    placeholder="Search anything..."
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
            </form>

            <div className="ml-auto flex items-center gap-1.5">
                <ModeToggle></ModeToggle>

                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => navigate('/dashboard/adoptionRequest')}
                    className="relative flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary dark:hover:bg-white/10"
                    aria-label="Adoption request notifications">
                    <Bell className="h-[1.1rem] w-[1.1rem]" />
                    {notificationCount > 0 && (
                        <motion.span
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-colorSecondary text-[10px] font-bold text-violet-950"
                        >
                            {notificationCount > 9 ? '9+' : notificationCount}
                        </motion.span>
                    )}
                </motion.button>

                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1 rounded-full py-1 pl-1 pr-1.5 transition-colors hover:bg-secondary dark:hover:bg-white/10">
                        <img
                            src={user?.photoURL}
                            alt={user?.displayName}
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-colorSecondary/70"
                        />
                        {/* <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> */}
                    </DropdownMenuTrigger>
                    {/* <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <NavLink to="/">Back to site</NavLink>
                        </DropdownMenuItem>
                    </DropdownMenuContent> */}
                </DropdownMenu>
            </div>
        </div>
    );
};

export default DashboardHeader;
