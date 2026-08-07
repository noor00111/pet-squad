import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { ArrowUpRight, Heart, MapPin, PawPrint } from 'lucide-react';


const PetsCard = ({ pet }) => {

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -8 }}
            className="group relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-0.5 rounded-[1.75rem] bg-gradient-to-br from-primary via-colorSecondary to-primary opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-60" />

            <Link
                to={`/petDetails/${pet._id}`}
                className="relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow duration-300 group-hover:shadow-2xl group-hover:shadow-primary/20">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary">
                    <img
                        src={pet.image}
                        alt={pet.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"/>

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/10 transition-opacity duration-300" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-colorSecondary/0 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-40" />

                    <span className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-colorSecondary text-amber-950 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <ArrowUpRight className="h-4 w-4" />
                    </span>

                    <div className="absolute inset-x-0 bottom-0 p-4">
                        <h2 className="font-headingFont text-2xl font-bold leading-tight text-white drop-shadow-md">
                            {pet.name}
                        </h2>
                        {pet.location && (
                            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-white/85">
                                <MapPin className="h-3 w-3 shrink-0" /> {pet.location}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-border/60 px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <PawPrint className="h-3.5 w-3.5 text-primary" />
                        {pet.age ? `${pet.age} ${Number(pet.age) === 1 ? 'year' : 'years'} old` : 'Age unknown'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-colorSecondary/15 px-3.5 py-1.5 text-xs font-bold text-colorSecondary transition-colors group-hover:bg-colorSecondary group-hover:text-amber-950">
                        Meet {pet.name?.split(' ')[0] ?? 'me'}
                    </span>
                </div>
            </Link>
        </motion.div>
    );
};

export default PetsCard;
