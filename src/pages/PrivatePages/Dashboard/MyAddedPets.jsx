import React, { useContext, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import useDonation from '@/hooks/useDonation';
import { AuthContext } from '@/provider/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import {CheckCircle2, ChevronLeft, ChevronRight, Copy, Eye, Filter, Gift, Heart, Inbox, MoreVertical, PawPrint,Pencil, Plus, Search, Trash2} from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/motion';

const PAGE_SIZE = 10;

const CATEGORY_STYLES = {
    cat: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
    dog: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
    bird: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400',
    panda: 'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300',
    rabbit: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400',
    fish: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
    hamster: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
};
const DEFAULT_CATEGORY_STYLE = 'bg-secondary text-secondary-foreground';

const FILTER_OPTIONS = [
    { value: 'all', label: 'All pets' },
    { value: 'available', label: 'Available only' },
    { value: 'adopted', label: 'Adopted only' },
];

const formatDate = (value) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const MyAddedPets = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const [donationCampaigns] = useDonation();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);

    const { data: pets = [], isPending, refetch } = useQuery({
        queryKey: ['myAddedPets', user?.email],
        queryFn: async () => (await axiosSecure.get(`/pets/myPets?email=${user.email}`)).data,
        enabled: !!user?.email,
    });

    const handleDeletePet = (pet) => {
        Swal.fire({
            title: `Remove ${pet.name}?`,
            text: 'You will not be able to undo this.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            confirmButtonColor: '#e11d48',
        }).then(async (result) => {
            if (!result.isConfirmed) return;
            const res = await axiosSecure.delete(`/pets/${pet._id}`);
            if (res.data.deletedCount > 0) {
                refetch();
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `${pet.name} has been deleted`,
                    showConfirmButton: false,
                    timer: 2000,
                });
            }
        });
    };

    const handleCopyLink = (pet) => {
        navigator.clipboard?.writeText(`${window.location.origin}/petDetails/${pet._id}`);
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Listing link copied',
            showConfirmButton: false,
            timer: 1200,
        });
    };

    const stats = useMemo(() => {
        const available = pets.filter((p) => p.adopted !== 'true').length;
        const adopted = pets.filter((p) => p.adopted === 'true').length;
        const activeCampaigns = donationCampaigns.filter((c) => c.isPaused !== true && c.isPaused !== 'true').length;
        return { total: pets.length, available, adopted, campaigns: donationCampaigns.length, activeCampaigns };
    }, [pets, donationCampaigns]);

    const filteredPets = useMemo(() => {
        let list = [...pets];
        if (statusFilter === 'available') list = list.filter((p) => p.adopted !== 'true');
        if (statusFilter === 'adopted') list = list.filter((p) => p.adopted === 'true');
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter((p) => p.name?.toLowerCase().includes(q));
        }
        list.sort((a, b) => new Date(b['date and time']) - new Date(a['date and time']));
        return list;
    }, [pets, statusFilter, search]);

    const totalPages = Math.max(1, Math.ceil(filteredPets.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const visiblePets = filteredPets.slice(startIdx, startIdx + PAGE_SIZE);

    const changeFilter = (value) => {
        setStatusFilter(value);
        setPage(1);
    };

    const STAT_TILES = [
        { icon: PawPrint, tone: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-colorSecondary', label: 'Total Pets', value: stats.total, note: 'Pets added by you' },
        { icon: CheckCircle2, tone: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400', label: 'Available', value: stats.available, note: 'Not adopted yet' },
        { icon: Heart, tone: 'bg-colorSecondary/15 text-colorSecondary', label: 'Adopted', value: stats.adopted, note: 'Successfully adopted' },
        { icon: Gift, tone: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400', label: 'Campaigns', value: stats.campaigns, note: 'Active campaigns' },
    ];

    return (
        <div>
            <Helmet><title>My Added Pets | Pet Squad</title></Helmet>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="rounded-2xl border border-border bg-card shadow-sm"
            >
                <div className="flex flex-wrap items-center justify-between gap-4 p-5 pb-0">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-colorSecondary">
                            <PawPrint className="h-5 w-5" />
                        </span>
                        <div>
                            <h2 className="font-headingFont text-xl font-semibold text-foreground">My Added Pets</h2>
                            <p className="mt-0.5 text-sm text-muted-foreground">Manage all the pets you've listed for adoption.</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                placeholder="Search pets…"
                                className="w-44 rounded-full border border-border bg-secondary/40 py-2 pl-9 pr-3 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 sm:w-56"
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                                    <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                                    {FILTER_OPTIONS.find((f) => f.value === statusFilter)?.label}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {FILTER_OPTIONS.map((opt) => (
                                    <DropdownMenuItem key={opt.value} onClick={() => changeFilter(opt.value)}>
                                        {opt.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Link to="/dashboard/addPet">
                            <motion.span
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25"
                            >
                                <Plus className="h-4 w-4" /> Add New Pet
                            </motion.span>
                        </Link>
                    </div>
                </div>

                <motion.div
                    variants={staggerContainer(0.08)}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {STAT_TILES.map(({ icon: Icon, tone, label, value, note }) => (
                        <motion.div
                            key={label}
                            variants={fadeUp}
                            className="glow-hover flex items-center gap-3 rounded-2xl border border-border bg-secondary/30 px-4 py-4"
                        >
                            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${tone}`}>
                                <Icon className="h-5 w-5" />
                            </span>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                                <p className="font-headingFont text-2xl font-bold leading-tight text-foreground">{value}</p>
                                <p className="text-[11px] text-muted-foreground">{note}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>Pet</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Added On</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!isPending && visiblePets.length === 0 && (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={6} className="py-14 text-center">
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <Inbox className="h-8 w-8" />
                                            <p className="text-sm font-medium">No pets listed yet</p>
                                            <p className="text-xs">Add a pet and it'll show up here.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}

                            {visiblePets.map((pet, idx) => {
                                const isAdopted = pet.adopted === 'true';
                                const categoryStyle = CATEGORY_STYLES[pet.category] || DEFAULT_CATEGORY_STYLE;
                                return (
                                    <motion.tr
                                        key={pet._id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.25, delay: idx * 0.02 }}
                                        className="border-b transition-colors hover:bg-secondary/50"
                                    >
                                        <TableCell className="font-medium text-muted-foreground">{startIdx + idx + 1}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <img src={pet.image} alt={pet.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-border" />
                                                <div>
                                                    <p className="font-semibold text-foreground">{pet.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {pet.category ? pet.category.charAt(0).toUpperCase() + pet.category.slice(1) : '—'}
                                                        {pet.age ? ` • ${pet.age}` : ''}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${categoryStyle}`}>
                                                {pet.category || 'Other'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                                    isAdopted
                                                        ? 'bg-colorSecondary/15 text-colorSecondary'
                                                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
                                                }`}
                                            >
                                                <span className={`h-1.5 w-1.5 rounded-full ${isAdopted ? 'bg-colorSecondary' : 'bg-emerald-500'}`} />
                                                {isAdopted ? 'Adopted' : 'Available'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{formatDate(pet['date and time'])}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/dashboard/updatePet/${pet._id}`}>
                                                    <button
                                                        aria-label={`Edit ${pet.name}`}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-primary transition-colors hover:bg-primary/10 dark:text-colorSecondary"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                </Link>
                                                <button
                                                    aria-label={`Delete ${pet.name}`}
                                                    onClick={() => handleDeletePet(pet)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-destructive transition-colors hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                                <Link to={`/petDetails/${pet._id}`} target="_blank" rel="noopener noreferrer">
                                                    <button
                                                        aria-label={`View ${pet.name}'s listing`}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                </Link>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button
                                                            aria-label={`More actions for ${pet.name}`}
                                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleCopyLink(pet)}>
                                                            <Copy className="mr-2 h-4 w-4" /> Copy listing link
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </motion.tr>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                {filteredPets.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-5 py-4">
                        <p className="text-sm text-muted-foreground">
                            Showing {startIdx + 1} to {Math.min(startIdx + PAGE_SIZE, filteredPets.length)} of {filteredPets.length} pets
                        </p>
                        <div className="flex items-center gap-1.5">
                            <button
                                aria-label="Previous page"
                                disabled={currentPage === 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:hover:bg-transparent"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter((n) => n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1)
                                .reduce((acc, n, i, arr) => {
                                    if (i > 0 && n - arr[i - 1] > 1) acc.push('…');
                                    acc.push(n);
                                    return acc;
                                }, [])
                                .map((n, i) =>
                                    n === '…' ? (
                                        <span key={`ellipsis-${i}`} className="px-1 text-sm text-muted-foreground">…</span>
                                    ) : (
                                        <button
                                            key={n}
                                            onClick={() => setPage(n)}
                                            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                                                n === currentPage
                                                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                                                    : 'text-foreground hover:bg-secondary'
                                            }`}
                                        >
                                            {n}
                                        </button>
                                    )
                                )}
                            <button
                                aria-label="Next page"
                                disabled={currentPage === totalPages}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:hover:bg-transparent"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <PawPrint className="h-3.5 w-3.5" /> {PAGE_SIZE} / page
                        </span>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default MyAddedPets;
