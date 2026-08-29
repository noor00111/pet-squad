import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { PawPrint, Quote, Star } from "lucide-react";
import adopter1 from "@/assets/images/adopter1.jpg";
import adopter2 from "@/assets/images/adopter2.jpg";
import adopter3 from "@/assets/images/adopter3.jpg";



const testimonials = [
    {
        id: 1,
        adopterName: "Sophia Davis",
        petName: "Max",
        petType: "Golden Retriever",
        quote: "Adopting Max was the best decision we ever made! He has brought so much warmth and energy into our home.",
        image: adopter1,
    },
    {
        id: 2,
        adopterName: "Emily Johnson",
        petName: "Luna",
        petType: "Tabby Cat",
        quote: "Luna has brought so much joy to our family! She fits right in and has become our daily source of happiness.",
        image: adopter2,
    },
    {
        id: 3,
        adopterName: "Michael Brown",
        petName: "Charlie",
        petType: "Puppy",
        quote: "Charlie is the perfect addition to our lives! The adoption process was smooth, and we couldn't be happier.",
        image: adopter3,
    },
    {
    id: 4,
    adopterName: "Daniel Wilson",
    petName: "Mittens",
    petType: "Kitten",
    quote: "Mittens is really so sweet! She's playful, affectionate, and quickly became everyone's favorite companion.",
    image: "https://i.ibb.co.com/Hf6BxBN6/kitten.png",
},
{
    id: 5,
    adopterName: "Olivia Martinez",
    petName: "Bella",
    petType: "Rabbit",
    quote: "Bella is the sweetest little bunny we could have asked for. The adoption experience was easy, and she's made our home feel complete.",
    image: "https://i.ibb.co.com/YB6cSwVk/rabbit-2.png",
},
];

const HappyTails = () => {
    return (
        <div className="px-6 max-w-6xl mx-auto text-center transition-all duration-300">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mx-auto mt-20 mb-10 max-w-xl"
            >
                <span className="inline-block font-bodyFont text-sm font-semibold uppercase tracking-[0.18em] text-colorSecondary">
                    Happy Tails
                </span>
              <SectionTitle
                title={"Stories From Our Adopters"}
                subTitle={"Every adoption creates a lifetime of love. Read inspiring stories from families who found their forever friend."}
            />
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-left">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                    loop
                    spaceBetween={28}
                    slidesPerView={1}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="pb-12 pt-10">

                    {testimonials.map((t) => (
                        <SwiperSlide key={t.id} className="h-auto pt-16">
                            <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }} className="group relative h-full">
                                <div className="absolute -top-16 left-8 z-10 h-24 w-24 overflow-hidden rounded-full border-4 border-colorSecondary/60 shadow-lg">
                                    <img src={t.image} alt={t.petName} className="h-full w-full object-cover" />
                                </div>

                                <div className="relative flex h-full flex-col rounded-3xl border border-border bg-card p-6 pt-11 shadow-sm transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-colorSecondary/10">
                                    <Quote className="absolute right-5 top-5 h-9 w-9 text-primary/10 dark:text-colorSecondary/10" />

                                    <div className="flex gap-0.5 text-colorSecondary">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className="h-3.5 w-3.5 fill-colorSecondary" />
                                        ))}
                                    </div>

                                    <p className="relative z-10 mt-3 flex-grow font-bodyFont text-base italic leading-relaxed text-foreground">
                                        "{t.quote}"
                                    </p>

                                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                                        <p className="font-headingFont text-sm font-semibold text-foreground">{t.adopterName}</p>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                            <PawPrint className="h-3 w-3 text-colorSecondary" />
                                            Adopted {t.petName}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </motion.div>
        </div>
    );
};

export default HappyTails;
