import React, { useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import Swal from 'sweetalert2';
import {ChevronLeft, ChevronRight, Copy, Filter, Inbox, MoreVertical, PawPrint, Search, ShieldCheck, UserPlus, X} from 'lucide-react';

const PAGE_SIZE = 10;

const FILTER_OPTIONS = [
    { value: 'all', label: 'All users' },
    { value: 'admin', label: 'Admins only' },
    { value: 'member', label: 'Members only' },
];

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();
    const [roleFilter, setRoleFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [addAdminOpen, setAddAdminOpen] = useState(false);
    const [query, setQuery] = useState('');

    const { data: users = [], isPending, refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => (await axiosSecure.get('/users')).data,
    });

    const handleMakeAdmin = (user) => {
        axiosSecure.patch(`/users/admin/${user._id}`).then((res) => {
            if (res.data.modifiedCount > 0) {
                refetch();
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `${user.name} is an admin now`,
                    showConfirmButton: false,
                    timer: 2000,
                });
            }
        });
    };

    const handleCopyEmail = (email) => {
        navigator.clipboard?.writeText(email);
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Email copied',
            showConfirmButton: false,
            timer: 1200,
        });
    };

    const filteredUsers = useMemo(() => {
        let list = [...users];
        if (roleFilter === 'admin') list = list.filter((u) => u.role === 'admin');
        if (roleFilter === 'member') list = list.filter((u) => u.role !== 'admin');
        return list;
    }, [users, roleFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const visibleUsers = filteredUsers.slice(startIdx, startIdx + PAGE_SIZE);

    const changeFilter = (value) => {
        setRoleFilter(value);
        setPage(1);
    };

    const candidateAdmins = useMemo(() => {
        const q = query.trim().toLowerCase();
        return users
            .filter((u) => u.role !== 'admin')
            .filter((u) => !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
            .slice(0, 8);
    }, [users, query]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="rounded-2xl border border-border bg-card shadow-sm">

            <div className="flex flex-wrap items-center justify-between gap-4 p-5 pb-0">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-colorSecondary">
                        <ShieldCheck className="h-5 w-5" />
                    </span>
                    <div>
                        <h2 className="font-headingFont text-xl font-semibold text-foreground">Users</h2>
                        <p className="mt-0.5 text-sm text-muted-foreground">Manage all registered users in the platform.</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                                {FILTER_OPTIONS.find((f) => f.value === roleFilter)?.label}
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

                    <motion.button
                        onClick={() => setAddAdminOpen(true)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25">
                        <UserPlus className="h-4 w-4" /> Add New Admin
                    </motion.button>
                </div>
            </div>

            <div className="mt-5 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Profile Image</TableHead>
                            <TableHead className="text-right">Role / Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isPending && visibleUsers.length === 0 && (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={5} className="py-14 text-center">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Inbox className="h-8 w-8" />
                                        <p className="text-sm font-medium">No users found</p>
                                        <p className="text-xs">Try a different filter.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}

                        {visibleUsers.map((user, idx) => {
                            const isAdmin = user.role === 'admin';
                            return (
                                <motion.tr
                                    key={user._id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, delay: idx * 0.02 }}
                                    className="border-b transition-colors hover:bg-secondary/50">
                                    <TableCell className="font-medium text-muted-foreground">{startIdx + idx + 1}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                                            {user.name}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                    <TableCell>
                                        <img
                                            src={user.photo}
                                            alt={user.name}
                                            className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            {isAdmin ? (
                                                <span className="inline-flex items-center rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary dark:bg-primary/20 dark:text-colorSecondary">
                                                    Admin
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleMakeAdmin(user)}
                                                    className="inline-flex items-center rounded-full border-2 border-primary/40 px-3.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground dark:text-colorSecondary">
                                                    Make Admin
                                                </button>
                                            )}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button
                                                        aria-label={`More actions for ${user.name}`}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleCopyEmail(user.email)}>
                                                        <Copy className="mr-2 h-4 w-4" /> Copy email
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

            {filteredUsers.length > 0 && (
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

            <AnimatePresence>
                {addAdminOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setAddAdminOpen(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(265,30%,8%)]/55 p-4 backdrop-blur-[2px]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-headingFont text-lg font-semibold text-foreground">Add new admin</h3>
                                <button
                                    onClick={() => setAddAdminOpen(false)}
                                    aria-label="Close"
                                    className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Search an existing member by name or email, then promote them to admin.
                            </p>

                            <div className="relative mt-4">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    autoFocus
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search by name or email…"
                                    className="w-full rounded-xl border border-border bg-secondary/40 py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50"
                                />
                            </div>

                            <ul className="mt-3 max-h-64 space-y-1 overflow-y-auto">
                                {candidateAdmins.length === 0 && (
                                    <li className="py-8 text-center text-sm text-muted-foreground">No matching members.</li>
                                )}
                                {candidateAdmins.map((user) => (
                                    <li key={user._id} className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-secondary/60">
                                        <div className="flex min-w-0 items-center gap-2.5">
                                            <img src={user.photo} alt={user.name} className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-border" />
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
                                                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                handleMakeAdmin(user);
                                                setAddAdminOpen(false);
                                                setQuery('');
                                            }}
                                            className="shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground dark:text-colorSecondary">
                                            Make Admin
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AllUsers;
