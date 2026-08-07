import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { AuthContext } from '@/provider/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import React, { useContext, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ArrowUpDown, Calendar, ChevronLeft, ChevronRight, Gift, HandCoins, Inbox, PawPrint, Undo2, Wallet } from 'lucide-react';

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'amountDesc', label: 'Highest amount' },
];

const dateFromObjectId = (id) => {
    if (!id || id.length < 8) return null;
    const seconds = parseInt(id.substring(0, 8), 16);
    return new Date(seconds * 1000);
};

const formatDate = (date) => {
    if (!date || Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const MyDonation = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const [sortBy, setSortBy] = useState('latest');
    const [page, setPage] = useState(1);

    const { data: myDonation = [], refetch } = useQuery({
        queryKey: ['myDonation', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/myDonation/${user.email}`);
            return res.data;
        },
    });

    const handleRefund = async (donation) => {
        const confirm = await Swal.fire({
            title: `Refund your donation to ${donation.name}?`,
            text: 'This will cancel your contribution to this campaign.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, refund',
            confirmButtonColor: '#e11d48',
        });
        if (!confirm.isConfirmed) return;

        const res = await axiosSecure.delete(`/myDonation/refund/${donation._id}`);
        if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your donation was refunded',
                showConfirmButton: false,
                timer: 2000,
            });
        }
    };

    const sortedDonations = useMemo(() => {
        const list = myDonation.map((d) => ({ ...d, _createdAt: dateFromObjectId(d._id) }));
        if (sortBy === 'oldest') {
            list.sort((a, b) => (a._createdAt ?? 0) - (b._createdAt ?? 0));
        } else if (sortBy === 'amountDesc') {
            list.sort((a, b) => Number(b.donatedAmount || 0) - Number(a.donatedAmount || 0));
        } else {
            list.sort((a, b) => (b._createdAt ?? 0) - (a._createdAt ?? 0));
        }
        return list;
    }, [myDonation, sortBy]);

    const totalPages = Math.max(1, Math.ceil(sortedDonations.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const visibleDonations = sortedDonations.slice(startIdx, startIdx + PAGE_SIZE);

    const totalDonated = useMemo(
        () => myDonation.reduce((sum, d) => sum + Number(d.donatedAmount || 0), 0),
        [myDonation]
    );

    const changeSort = (value) => {
        setSortBy(value);
        setPage(1);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="rounded-2xl border border-border bg-card shadow-sm"
        >
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 pb-0">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-colorSecondary">
                        <HandCoins className="h-5 w-5" />
                    </span>
                    <div>
                        <h2 className="font-headingFont text-xl font-semibold text-foreground">My Donations</h2>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            {myDonation.length > 0
                                ? `You've given $ ${totalDonated.toLocaleString()} across ${myDonation.length} donation${myDonation.length === 1 ? '' : 's'}.`
                                : "Track the campaigns you've supported."}
                        </p>
                    </div>
                </div>
                {myDonation.length > 0 && (
                    <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3.5 py-2">
                        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                        <select
                            value={sortBy}
                            onChange={(e) => changeSort(e.target.value)}
                            className="bg-transparent text-sm font-medium text-foreground outline-none"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>Sort by: {opt.label}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="mt-5 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Pet</TableHead>
                            <TableHead>Donated Amount</TableHead>
                            <TableHead>Donated On</TableHead>
                            <TableHead className="text-right">Refund</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {visibleDonations.length === 0 && (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={5} className="py-14 text-center">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Inbox className="h-8 w-8" />
                                        <p className="text-sm font-medium">You haven't donated to any campaigns yet</p>
                                        <Link to="/donationCampaigns">
                                            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25">
                                                <Gift className="h-4 w-4" /> Browse campaigns
                                            </span>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}

                        {visibleDonations.map((donation, idx) => (
                            <motion.tr
                                key={donation._id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, delay: idx * 0.02 }}
                                className="border-b transition-colors hover:bg-secondary/50">
                                <TableCell className="font-medium text-muted-foreground">{startIdx + idx + 1}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={donation.image}
                                            alt={donation.name}
                                            className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
                                        />
                                        <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                                            {donation.name}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                                        <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
                                        {Number(donation.donatedAmount || 0).toLocaleString()} 
                                    </span>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {formatDate(donation._createdAt)}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handleRefund(donation)}
                                            className="inline-flex items-center gap-1.5 rounded-full border-2 border-destructive/50 px-3.5 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
                                        >
                                            <Undo2 className="h-3.5 w-3.5" /> Refund
                                        </button>
                                    </div>
                                </TableCell>
                            </motion.tr>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {sortedDonations.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-5 py-4">
                    <p className="text-sm text-muted-foreground">
                        Showing {startIdx + 1} to {Math.min(startIdx + PAGE_SIZE, sortedDonations.length)} of {sortedDonations.length} donations
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
    );
};

export default MyDonation;
