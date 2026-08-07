import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import usePets from '@/hooks/usePets';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { ArrowUpDown, ChevronLeft, ChevronRight, Inbox, MoreVertical, PawPrint, Pencil, Plus, Trash2 } from 'lucide-react';

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'nameAsc', label: 'Name A–Z' },
];

const AllPets = () => {
    const [pets, loading, refetch] = usePets();
    const axiosSecure = useAxiosSecure();
    const [sortBy, setSortBy] = useState('latest');
    const [page, setPage] = useState(1);

    const sortedPets = useMemo(() => {
        const list = [...pets];
        if (sortBy === 'oldest') {
            list.sort((a, b) => new Date(a['date and time']) - new Date(b['date and time']));
        } else if (sortBy === 'nameAsc') {
            list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        } else {
            list.sort((a, b) => new Date(b['date and time']) - new Date(a['date and time']));
        }
        return list;
    }, [pets, sortBy]);

    const totalPages = Math.max(1, Math.ceil(sortedPets.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const visiblePets = sortedPets.slice(startIdx, startIdx + PAGE_SIZE);

    const changeSort = (value) => {
        setSortBy(value);
        setPage(1);
    };

    const handleDelete = async (pet) => {
        const confirm = await Swal.fire({
            title: `Remove ${pet.name}?`,
            text: 'This pet listing will be permanently deleted.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            confirmButtonColor: '#e11d48',
        });
        if (!confirm.isConfirmed) return;

        const res = await axiosSecure.delete(`/pets/${pet._id}`);
        if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `${pet.name} was deleted`,
                showConfirmButton: false,
                timer: 2000,
            });
        }
    };

    const handleAdoptToggle = async (pet) => {
        const data = { adopted: pet.adopted === 'true' ? 'false' : 'true' };
        const res = await axiosSecure.patch(`/pets/adopt/${pet._id}`, data);
        if (res.data.modifiedCount > 0) {
            refetch();
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `${pet.name} marked as ${data.adopted === 'true' ? 'adopted' : 'not adopted'}`,
                showConfirmButton: false,
                timer: 2000,
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 pb-0">
                <div>
                    <h2 className="font-headingFont text-xl font-semibold text-foreground">All Pets</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Manage all pets in the platform.</p>
                </div>
                <div className="flex items-center gap-3">
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
                    <Link to="/dashboard/addPet">
                        <motion.span
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25"
                        >
                            <Plus className="h-4 w-4" /> Add a Pet
                        </motion.span>
                    </Link>
                </div>
            </div>

            <div className="mt-5 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!loading && visiblePets.length === 0 && (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={6} className="py-14 text-center">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Inbox className="h-8 w-8" />
                                        <p className="text-sm font-medium">No pets listed yet</p>
                                        <p className="text-xs">Pets added to the platform will show up here.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}

                        {visiblePets.map((pet, idx) => {
                            const isAdopted = pet.adopted === 'true';
                            return (
                                <motion.tr
                                    key={pet._id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, delay: idx * 0.02 }}
                                    className="border-b transition-colors hover:bg-secondary/50">

                                    <TableCell className="font-medium text-muted-foreground">{startIdx + idx + 1}</TableCell>
                                    <TableCell className="font-semibold text-foreground">{pet.name}</TableCell>
                                    <TableCell>
                                        <img
                                            src={pet.image}
                                            alt={pet.name}
                                            className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
                                        />
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{pet.ownerEmail}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                isAdopted
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'
                                            }`}
                                        >
                                            {isAdopted ? 'Adopted' : 'Not Adopted'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/dashboard/updatePet/${pet._id}`}>
                                                <button
                                                    aria-label={`Edit ${pet.name}`}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-primary transition-colors hover:bg-primary/10 dark:text-colorSecondary">
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                            </Link>
                                            <button
                                                aria-label={`Delete ${pet.name}`}
                                                onClick={() => handleDelete(pet)}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-destructive transition-colors hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
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
                                                    <DropdownMenuItem onClick={() => handleAdoptToggle(pet)}>
                                                        Mark as {isAdopted ? 'Not Adopted' : 'Adopted'}
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

            {sortedPets.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-4 border-t border-border px-5 py-4">
                    <div className="flex items-center gap-1.5">
                        <button
                            aria-label="Previous page"
                            disabled={currentPage === 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:hover:bg-transparent">
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
                                        }`}>
                                        {n}
                                    </button>
                                )
                            )}
                        <button
                            aria-label="Next page"
                            disabled={currentPage === totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:hover:bg-transparent">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default AllPets;
