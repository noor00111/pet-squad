import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { ArrowUpRight, PawPrint } from "lucide-react";

const CATEGORY_EMOJI = {
  dog: '🐶',
  cat: '🐱',
  bird: '🐦',
  rabbit: '🐰',
  fish: '🐠',
  hamster: '🐹',
  panda: '🐼',
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const PetsCategory = () => {
  const axiosPublic = useAxiosPublic();

  const { data: pets = [] } = useQuery({
    queryKey: ['home-pets-for-category'],
    queryFn: async () => {
      const res = await axiosPublic.get('/pets/isNotAdopted');
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const categories = useMemo(() => {
    const map = new Map();
    pets.forEach((pet) => {
      if (!pet.category) return;
      if (!map.has(pet.category)) {
        map.set(pet.category, { category: pet.category, image: pet.image, name: pet.name, count: 0 });
      }
      map.get(pet.category).count += 1;
    });
    return Array.from(map.values());
  }, [pets]);

  if (categories.length === 0) return null;

  return (
    <div className="lg:px-20 px-6 py-12 transition-all duration-300">
      <SectionTitle
        subTitle={"Category"}
        title={"Find Out Which Furry Friend Fits You Best!"}
      />
      <div className="mt-8 px-2">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="pb-10"
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat.category}>
              <Link to={`/petListing?category=${cat.category}`} className="block group">
                <motion.div
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-colorSecondary/10"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}>
                  <div className="relative h-64 w-full overflow-hidden rounded-xl bg-secondary">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-card/90 opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                      <ArrowUpRight className="h-4 w-4 text-colorPrimary" />
                    </div>
                    <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm">
                      <PawPrint className="h-3 w-3 text-colorSecondary" />
                      {cat.count} available
                    </div>
                  </div>

                  <div className="p-4 text-center">
                    <p className="mt-1 font-bodyFont text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors duration-200 group-hover:text-colorSecondary">
                      {CATEGORY_EMOJI[cat.category] ?? '🐾'} {capitalize(cat.category)}
                    </p>
                    <p className="px-4 py-1.5 font-headingFont text-xl font-semibold text-foreground transition-colors duration-200 group-hover:text-colorPrimary">
                      {cat.name}
                    </p>
                  </div>
                </motion.div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default PetsCategory;
