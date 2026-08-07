import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FaRegComments, FaRegCalendarAlt, FaUser } from "react-icons/fa";
import SectionTitle from '@/components/SectionTitle/SectionTitle';
import { motion } from "framer-motion";
import { FaArrowRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Blog = () => {
    const blogPosts = [
        {
            title: "Preparing Your Home for a New Pet",
            description: "Learn how to make your home safe and comfortable before bringing in a new furry friend.",
            image: "https://i.ibb.co.com/Jjb2PcBz/81-6-Q-Ps-SDL-AC-UF1000-1000-QL80.jpg",
            author: "Admin",
            date: "January 15, 2025",
            comments: 5,
        },
        {
            title: "Best Foods for Your Adopted Pet",
            description: "A guide to choosing the right diet for your newly adopted cat or dog.",
            image: "https://i.ibb.co.com/tTGWvMW9/Dog-Food-in-Bowl-and-Dog-Biscuits.jpg",
            author: "Sarah P.",
            date: "February 5, 2025",
            comments: 2,
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 mb-10 transition-all duration-300">
            <SectionTitle title={"Blogs & News"} subTitle={"Tips and Advice"} />
            
            <motion.div
                className="grid md:grid-cols-2 gap-8 mt-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                {blogPosts.map((post, index) => (
                    <motion.div
                        key={index}
                        variants={cardVariants}
                        whileHover={{ y: -6 }}
                        transition={{ duration: 0.3 }}
                        className="group"
                    >
                        <Card className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-xl hover:shadow-colorSecondary/10">
                            <div className="relative h-52 overflow-hidden bg-muted">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <CardContent className="flex flex-grow flex-col justify-between p-6">
                                <div>
                                    <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <FaUser className="text-colorSecondary" /> {post.author}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <FaRegCalendarAlt className="text-colorSecondary" /> {post.date}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <FaRegComments className="text-colorSecondary" /> {post.comments} comments
                                        </span>
                                    </div>
                                    <h3 className="mt-2 font-headingFont text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-colorSecondary">
                                        {post.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {post.description}
                                    </p>
                                </div>
                                <Link
                                    to="/petCare"
                                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-colorPrimary transition-colors hover:text-colorPrimary/80"
                                >
                                    Read More <FaArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default Blog;