import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import SectionTitle from '@/components/SectionTitle/SectionTitle';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import PetsCard from '@/components/pets/PetsCard/PetsCard';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { ChevronLeft, ChevronRight, PawPrint, Search } from 'lucide-react';

const PAGE_SIZE = 12;

const CATEGORY_EMOJI = {
    dog: '🐶',
    cat: '🐱',
    bird: '🐦',
    rabbit: '🐰',
    fish: '🐠',
    hamster: '🐹',
    panda: '🐼',
};


const NotAdoptedPetListing = () => {
    const listingPets = useLoaderData();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
    const [category] = useState([...new Set(listingPets.map(pet => pet.category).filter(Boolean))]);
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "");
    const [page, setPage] = useState(1);

    const searchPetName = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    }

    const handleCategorySelect = (nextCategory) => {
        const value = selectedCategory === nextCategory ? "" : nextCategory;
        setSelectedCategory(value);
        setPage(1);
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (value) next.set('category', value); else next.delete('category');
            return next;
        }, { replace: true });
    }

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("");
        setPage(1);
        setSearchParams({}, { replace: true });
    }

    const visiblePets = listingPets.filter((pet) => {
        const matchesCategory = !selectedCategory || pet.category === selectedCategory;
        const matchesSearch = !searchTerm || pet.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const hasActiveFilters = Boolean(searchTerm || selectedCategory);

    const totalPages = Math.max(1, Math.ceil(visiblePets.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const pagedPets = visiblePets.slice(startIdx, startIdx + PAGE_SIZE);

    return (
        <div className="pb-16">
            <Helmet><title>List of Pets | Pet Squad</title></Helmet>

            <SectionTitle
                subTitle={"Cherished Companions"}
                title={"The Pets We Love"}
            ></SectionTitle>

            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mx-auto max-w-3xl px-4 sm:px-6">

                <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm transition-all focus-within:border-primary focus-within:shadow-md">
                    <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <input
                        value={searchTerm}
                        onChange={searchPetName}
                        type="text"
                        placeholder="Search by name..."
                        className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    />
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                    <button
                        type="button"
                        onClick={() => handleCategorySelect("")}
                        className={`rounded-full border px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${
                            selectedCategory === ""
                                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }`}
                    >
                        All
                    </button>
                    {category.map((item) => (
                        <button
                            type="button"
                            key={item}
                            onClick={() => handleCategorySelect(item)}
                            className={`rounded-full border px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${
                                selectedCategory === item
                                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                            }`}
                        >
                            {CATEGORY_EMOJI[item?.toLowerCase()] ?? '🐾'} {item}
                        </button>
                    ))}
                </div>
            </motion.div>

            <div className="mx-auto mt-4 flex max-w-3xl items-center justify-between px-4 text-sm text-muted-foreground sm:px-6">
                <span>
                    {visiblePets.length > 0 && `Showing ${startIdx + 1}–${Math.min(startIdx + PAGE_SIZE, visiblePets.length)} of ${visiblePets.length} ${visiblePets.length === 1 ? 'pet' : 'pets'}`}
                </span>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="font-semibold text-primary transition-colors hover:text-primary/80">
                        Clear filters
                    </button>
                )}
            </div>

            {visiblePets.length > 0 ? (
                <>
                    <motion.div
                        key={`${selectedCategory}-${searchTerm}-${currentPage}`}
                        variants={staggerContainer(0.06)}
                        initial="hidden"
                        animate="visible"
                        className='grid grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 xl:grid-cols-4'>
                        {pagedPets.map((pet, index) => (
                            <motion.div key={pet._id ?? index} variants={fadeUp}>
                                <PetsCard pet={pet} />
                            </motion.div>
                        ))}
                    </motion.div>

                    {totalPages > 1 && (
                        <div className="mx-auto flex max-w-3xl items-center justify-center gap-1.5 px-4 pb-10 sm:px-6">
                            <button
                                type="button"
                                aria-label="Previous page"
                                disabled={currentPage === 1}
                                onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:hover:bg-transparent"
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
                                            type="button"
                                            onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
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
                                type="button"
                                aria-label="Next page"
                                disabled={currentPage === totalPages}
                                onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:hover:bg-transparent"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mx-4 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-card/50 py-20 text-center sm:mx-6"
                >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-3xl">
                        <PawPrint className="h-7 w-7 text-muted-foreground" />
                    </span>
                    <div>
                        <p className="font-headingFont text-xl font-semibold text-foreground">No pets found</p>
                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            Try a different search or category — check back soon, new arrivals are added regularly.
                        </p>
                    </div>
                    {hasActiveFilters && (
                        <Button onClick={clearFilters} className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
                            Clear filters
                        </Button>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default NotAdoptedPetListing;