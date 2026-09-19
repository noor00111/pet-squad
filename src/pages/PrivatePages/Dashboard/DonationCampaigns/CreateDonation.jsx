import useAxiosPublic from '@/hooks/useAxiosPublic';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { AuthContext } from '@/provider/AuthProvider';
import React, { useContext, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {Calendar, CheckCircle2, FileText, Gift, Heart, Loader2, PawPrint, ShieldCheck, Star, UploadCloud, User} from 'lucide-react';

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_API = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const DECORATIONS = [
    { top: '6%', left: '4%', icon: Star, size: 14, color: 'text-colorSecondary/60', duration: 6, delay: 0 },
    { top: '14%', left: '92%', icon: Heart, size: 14, color: 'text-rose-400/60', duration: 7, delay: 0.6 },
    { top: '55%', left: '2%', icon: Heart, size: 11, color: 'text-primary/50', duration: 6.5, delay: 1.2 },
    { top: '80%', left: '95%', icon: Star, size: 12, color: 'text-colorSecondary/50', duration: 7.5, delay: 1.8 },
];

const TIPS = [
    'Add a clear and cute photo',
    'Write a heartfelt description',
    'Set a realistic goal amount',
    'Share your campaign with friends',
];

const IconInput = ({ icon: Icon, suffix, ...props }) => (
    <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary/70 dark:text-colorSecondary/80">
            <Icon className="h-4 w-4" />
        </span>
        <input
            {...props}
            className={`w-full rounded-xl border border-border bg-secondary/40 py-2.5 pl-10 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 dark:border-white/10 dark:bg-white/5 ${suffix ? 'pr-9' : 'pr-3'}`}
        />
        {suffix && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                {suffix}
            </span>
        )}
    </div>
);

const CreateDonation = () => {
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [shortDescLength, setShortDescLength] = useState(0);
    const [longDescLength, setLongDescLength] = useState(0);

    const { ref: rhfImageRef, onChange: rhfImageOnChange, ...imageRegisterRest } = register('image', { required: 'A pet photo is required' });

    const readPreview = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const handleDroppedFiles = (fileList) => {
        if (!fileList || fileList.length === 0) return;
        if (fileInputRef.current) {
            fileInputRef.current.files = fileList;
        }
        setValue('image', fileList, { shouldValidate: true });
        readPreview(fileList[0]);
    };

    const onSubmit = async (data) => {
        const imageFile = { image: data.image[0] }
        const res = await axiosPublic.post(image_hosting_API, imageFile, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        });
        if (res.data.success) {
            const donationData = {
                petName: data.name,
                image: res.data.data.display_url,
                amount: data.amount,
                "last date": data.lastDate,
                "short description": data.shortDescription,
                "long description": data.longDescription,
                "date and time": new Date(res.data.data.time * 1000).toLocaleString(),
                campaignOwnerEmail: user.email,
                campaignOwnerName: user.displayName,
            }

            const donation = await axiosSecure.post('/donationCampaign', donationData);

            if (donation.data.insertedId) {
                reset();
                setImagePreview(null);
                setShortDescLength(0);
                setLongDescLength(0);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Created Donation Campaign Successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/dashboard/myDonationCampaigns')
            }
        }
    };

    return (
        <div className="relative mx-auto max-w-4xl">
            <div className="pointer-events-none absolute inset-0 overflow-visible">
                {DECORATIONS.map(({ top, left, icon: Icon, size, color, duration, delay }, i) => (
                    <motion.span
                        key={i}
                        style={{ top, left }}
                        className={`absolute ${color}`}
                        animate={{ y: [0, -10, 0], rotate: [0, 12, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}>
                        <Icon size={size} fill="currentColor" />
                    </motion.span>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xl shadow-primary/10 dark:border-white/10 sm:p-10">
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-colorSecondary/15 blur-[80px]" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/15 blur-[80px]" />

                <div className="relative z-10 flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
                    <div className="flex gap-8 items-center sm:items-start">
                       <div>
                         <h1 className="mt-3 font-headingFont text-3xl font-bold text-foreground">
                            Create Donation Campaign
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Help more pets get the care and love they deserve!
                        </p>
                       </div>
                    </div>

                    <motion.img
                        src="https://i.ibb.co.com/DHs2Mggw/puppy.png"
                        alt="A friendly puppy waiting for donations"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                        transition={{ opacity: { duration: 0.6 }, scale: { duration: 0.6 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 } }}
                        className="h-28 w-28 shrink-0 object-contain drop-shadow-xl sm:h-36 sm:w-36"
                    />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 mt-8 space-y-5">
                    <div>
                        <label className="text-sm font-semibold text-foreground">Pet Image *</label>
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                handleDroppedFiles(e.dataTransfer.files);
                            }}
                            onClick={() => fileInputRef.current?.click()}
                            className={`mt-1.5 flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed p-5 transition-colors ${
                                isDragging
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border bg-secondary/30 hover:border-primary/40 dark:border-white/15 dark:bg-white/5'
                            }`}
                        >
                            <input
                                {...imageRegisterRest}
                                ref={(el) => { rhfImageRef(el); fileInputRef.current = el; }}
                                onChange={(e) => {
                                    rhfImageOnChange(e);
                                    readPreview(e.target.files?.[0]);
                                }}
                                type="file"
                                accept="image/*"
                                className="hidden"
                            />
                            {imagePreview ? (
                                <img src={imagePreview} alt="Selected pet" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                            ) : (
                                <motion.span
                                    animate={{ y: [0, -3, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-colorSecondary"
                                >
                                    <UploadCloud className="h-5 w-5" />
                                </motion.span>
                            )}
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-foreground">
                                    {imagePreview ? 'Photo selected' : (
                                        <>Drag &amp; drop an image here, <span className="font-normal text-muted-foreground">or click to browse</span></>
                                    )}
                                </p>
                                <p className="text-xs text-muted-foreground">JPG, PNG or WEBP (max. 5MB)</p>
                            </div>
                        </div>
                        {errors.image && <p className="mt-1 text-xs font-medium text-destructive">{errors.image.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-semibold text-foreground">Name *</label>
                            <div className="mt-1.5">
                                <IconInput
                                    icon={User}
                                    type="text"
                                    placeholder="Please enter the name of your pet"
                                    {...register('name', { required: 'Pet name is required' })}
                                />
                            </div>
                            {errors.name && <p className="mt-1 text-xs font-medium text-destructive">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-foreground">Amount *</label>
                            <div className="mt-1.5">
                                <IconInput
                                    icon={Gift}
                                    suffix="$"
                                    type="number"
                                    min="1"
                                    placeholder="Maximum Donation Amount"
                                    {...register('amount', { required: 'A goal amount is required' })}
                                />
                            </div>
                            {errors.amount && <p className="mt-1 text-xs font-medium text-destructive">{errors.amount.message}</p>}
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-foreground">Last Date *</label>
                            <div className="mt-1.5">
                                <IconInput
                                    icon={Calendar}
                                    type="date"
                                    {...register('lastDate', { required: 'An end date is required' })}
                                />
                            </div>
                            {errors.lastDate && <p className="mt-1 text-xs font-medium text-destructive">{errors.lastDate.message}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-foreground">Short Description *</label>
                                <span className="text-xs text-muted-foreground">{shortDescLength}/150</span>
                            </div>
                            <div className="mt-1.5">
                                <IconInput
                                    icon={FileText}
                                    type="text"
                                    maxLength={150}
                                    placeholder="Enter a short description"
                                    {...register('shortDescription', { required: 'A short description is required' })}
                                    onChange={(e) => setShortDescLength(e.target.value.length)}
                                />
                            </div>
                            {errors.shortDescription && <p className="mt-1 text-xs font-medium text-destructive">{errors.shortDescription.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-foreground">Long Description *</label>
                                <span className="text-xs text-muted-foreground">{longDescLength}/1000</span>
                            </div>
                            <div className="relative mt-1.5">
                                <span className="pointer-events-none absolute left-3 top-3 text-primary/70 dark:text-colorSecondary/80">
                                    <FileText className="h-4 w-4" />
                                </span>
                                <textarea
                                    maxLength={1000}
                                    placeholder="Provide detailed information about the pet, its needs, and how the funds will be used."
                                    {...register('longDescription', { required: 'A detailed description helps donors trust your campaign' })}
                                    onChange={(e) => setLongDescLength(e.target.value.length)}
                                    className="h-40 w-full resize-y rounded-xl border border-border bg-secondary/40 py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 dark:border-white/10 dark:bg-white/5"
                                ></textarea>
                            </div>
                            {errors.longDescription && <p className="mt-1 text-xs font-medium text-destructive">{errors.longDescription.message}</p>}
                        </div>

                        {/* Tips card */}
                        <div className="relative overflow-hidden rounded-2xl bg-secondary/50 p-5 dark:bg-white/5">
                            <PawPrint className="pointer-events-none absolute -bottom-4 -right-4 h-28 w-28 text-primary/5 dark:text-white/5" />
                            <h3 className="relative flex items-center gap-2 text-sm font-bold text-foreground">
                                <PawPrint className="h-4 w-4 text-primary dark:text-colorSecondary" /> Tips for a great campaign
                            </h3>
                            <ul className="relative mt-3 space-y-2">
                                {TIPS.map((tip) => (
                                    <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 p-3.5 font-semibold text-primary-foreground shadow-md shadow-primary/30 transition-shadow hover:shadow-lg disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                 Create Campaign 
                            </>
                        )}
                    </motion.button>

                    <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 text-primary dark:text-colorSecondary" /> Your information is safe and secure with us.
                    </p>
                </form>
            </motion.div>

        </div>
    );
};

export default CreateDonation;
