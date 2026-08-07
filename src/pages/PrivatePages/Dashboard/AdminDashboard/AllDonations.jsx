import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import DonatorModal from '@/components/donation/DonatorModal';
import {ArrowUpDown, ChevronLeft, ChevronRight, Filter, Gift, Inbox, MoreVertical, Pause, PawPrint, Pencil, Play, Users} from 'lucide-react';

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'nameAsc', label: 'Name A–Z' },
];

const FILTER_OPTIONS = [
    { value: 'all', label: 'All campaigns' },
    { value: 'active', label: 'Active only' },
    { value: 'paused', label: 'Paused only' },
];

const modalStyles = {
    content: {
        top: '58%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        maxHeight: '85vh',
        overflowY: 'auto',
        padding: 0,
        border: 'none',
        borderRadius: '1rem',
        backgroundColor: 'transparent',
        boxShadow: '0 25px 60px -15px hsl(265, 60%, 20%, 0.45)',
    },
    overlay: {
        backgroundColor: 'hsla(265, 30%, 8%, 0.55)',
        backdropFilter: 'blur(2px)',
        zIndex: 50,
    },
};

const AllDonations = () => {
    const axiosSecure = useAxiosSecure();
    const [sortBy, setSortBy] = useState('latest');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [donatorsModalIsOpen, setDonatorsModalIsOpen] = useState(false);
    const [donators, setDonators] = useState([]);

    const { data: campaigns = [], isPending, refetch } = useQuery({
        queryKey: ['allDonationCampaigns'],
        queryFn: async () => (await axiosSecure.get('/donationCampaign/all')).data,
    });

    const handlePause = async (id, isPaused) => {
        const res = await axiosSecure.put(`/donationCampaign/${id}`, { isPaused });
        if (res.data.modifiedCount > 0) {
            refetch();
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `Campaign ${isPaused === 'true' ? 'paused' : 'resumed'}`,
                showConfirmButton: false,
                timer: 2000,
            });
        }
    };

    const handleViewDonors = async (id) => {
        const res = await axiosSecure.get(`/donationCampaign/${id}/donations`);
        setDonators(res.data);
        setDonatorsModalIsOpen(true);
    };

    const filteredCampaigns = useMemo(() => {
        let list = [...campaigns];
        if (statusFilter === 'active') list = list.filter((c) => c.isPaused !== 'true');
        if (statusFilter === 'paused') list = list.filter((c) => c.isPaused === 'true');

        if (sortBy === 'oldest') {
            list.sort((a, b) => new Date(a['date and time']) - new Date(b['date and time']));
        } else if (sortBy === 'nameAsc') {
            list.sort((a, b) => (a.petName || '').localeCompare(b.petName || ''));
        } else {
            list.sort((a, b) => new Date(b['date and time']) - new Date(a['date and time']));
        }
        return list;
    }, [campaigns, statusFilter, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filteredCampaigns.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const visibleCampaigns = filteredCampaigns.slice(startIdx, startIdx + PAGE_SIZE);

    const changeSort = (value) => {
        setSortBy(value);
        setPage(1);
    };

    const changeFilter = (value) => {
        setStatusFilter(value);
        setPage(1);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 pb-0">
                <div>
                    <h2 className="font-headingFont text-xl font-semibold text-foreground">All Donations</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Manage all donation campaigns across Pet Squad.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
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

                    <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3.5 py-2">
                        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                        <select
                            value={sortBy}
                            onChange={(e) => changeSort(e.target.value)}
                            className="bg-transparent text-sm font-medium text-foreground outline-none">
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>Sort by: {opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <Link to="/dashboard/createDonationCampaign">
                        <motion.span
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25">
                            <Gift className="h-4 w-4" /> New Campaign
                        </motion.span>
                    </Link>
                </div>
            </div>

            <div className="mt-5 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Owner Email</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isPending && visibleCampaigns.length === 0 && (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={6} className="py-14 text-center">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Inbox className="h-8 w-8" />
                                        <p className="text-sm font-medium">No donation campaigns found</p>
                                        <p className="text-xs">Try a different filter, or start a new campaign.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}

                        {visibleCampaigns.map((donation, idx) => {
                            const isPaused = donation.isPaused === 'true';
                            return (
                                <motion.tr
                                    key={donation._id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, delay: idx * 0.02 }}
                                    className="border-b transition-colors hover:bg-secondary/50">
                                    <TableCell className="font-medium text-muted-foreground">{startIdx + idx + 1}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                                            {donation.petName}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{donation.campaignOwnerEmail}</TableCell>
                                    <TableCell>
                                        <img
                                            src={donation.image}
                                            alt={donation.petName}
                                            className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                                isPaused
                                                    ? 'bg-muted text-muted-foreground'
                                                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
                                            }`}
                                        >
                                            <span className={`h-1.5 w-1.5 rounded-full ${isPaused ? 'bg-muted-foreground' : 'bg-emerald-500'}`} />
                                            {isPaused ? 'Paused' : 'Active'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/dashboard/updateDonationCampaign/${donation._id}`}>
                                                <button className="inline-flex items-center gap-1.5 rounded-full bg-colorSecondary/15 px-3 py-1.5 text-xs font-semibold text-colorSecondary transition-colors hover:bg-colorSecondary/25">
                                                    <Pencil className="h-3.5 w-3.5" /> Edit
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handlePause(donation._id, isPaused ? 'false' : 'true')}
                                                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20 dark:text-colorSecondary">
                                                {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                                                {isPaused ? 'Resume' : 'Pause'}
                                            </button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button
                                                        aria-label={`More actions for ${donation.petName}`}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleViewDonors(donation._id)}>
                                                        <Users className="mr-2 h-4 w-4" /> View donors
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

            {filteredCampaigns.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-4 border-t border-border px-5 py-4">
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
                </div>
            )}

            <Modal
                isOpen={donatorsModalIsOpen}
                onRequestClose={() => setDonatorsModalIsOpen(false)}
                style={modalStyles}
                contentLabel="Donors for this campaign"
            >
                {donatorsModalIsOpen && (
                    <DonatorModal donators={donators} closeModal={() => setDonatorsModalIsOpen(false)} />
                )}
            </Modal>
        </motion.div>
    );
};

export default AllDonations;
