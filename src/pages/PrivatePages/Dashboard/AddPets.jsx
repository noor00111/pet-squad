import React, { useContext, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { Formik } from 'formik';
import Select from 'react-select'
import Swal from "sweetalert2";
import { AuthContext } from '@/provider/AuthProvider';
import {Calendar, FileText, Heart, Loader2, MapPin, PawPrint, ShieldCheck, Sparkles, Star, UploadCloud, User} from 'lucide-react';

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_API = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const DECORATIONS = [
    { top: '6%', left: '4%', icon: Star, size: 14, color: 'text-colorSecondary/60', duration: 6, delay: 0 },
    { top: '14%', left: '92%', icon: Heart, size: 14, color: 'text-rose-400/60', duration: 7, delay: 0.6 },
    { top: '55%', left: '2%', icon: Heart, size: 11, color: 'text-primary/50', duration: 6.5, delay: 1.2 },
    { top: '80%', left: '95%', icon: Star, size: 12, color: 'text-colorSecondary/50', duration: 7.5, delay: 1.8 },
];

const IconInput = ({ icon: Icon, error, ...props }) => (
    <div>
        <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary/70 dark:text-colorSecondary/80">
                <Icon className="h-4 w-4" />
            </span>
            <input
                {...props}
                className="w-full rounded-xl border border-border bg-secondary/40 py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 dark:border-white/10 dark:bg-white/5"
            />
        </div>
        {error && <p className="mt-1 text-xs font-medium text-destructive">{error}</p>}
    </div>
);

const AddPets = () => {
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const petCategories = [
        { value: 'cat', label: 'Cat' },
        { value: 'dog', label: 'Dog' },
        { value: 'bird', label: 'Bird' },
        { value: 'panda', label: 'Panda' },
        { value: 'rabbit', label: 'Rabbit' },
        { value: 'fish', label: 'Fish' },
        { value: 'hamster', label: 'Hamster' },
    ]

    const readPreview = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
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
                    <div className="flex flex-1 flex-col items-center sm:items-start">
                       
                        <h1 className="mt-3 font-headingFont text-3xl font-bold text-foreground">
                            Add Your Pet
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Help us find a loving home for your furry friend 🐾
                        </p>
                    </div>

                    <motion.img
                        src="https://i.ibb.co.com/DHs2Mggw/puppy.png"
                        alt="A friendly puppy waiting for a home"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                        transition={{ opacity: { duration: 0.6 }, scale: { duration: 0.6 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 } }}
                        className="h-28 w-28 shrink-0 object-contain sm:h-36 sm:w-36"
                    />
                </div>

                <Formik
                    initialValues={{
                        image: null,
                        name: "",
                        age: "",
                        category: "",
                        location: "",
                        shortDescription: "",
                        longDescription: "",
                    }}

                    validate={(values) => {
                        const errors = {};
                        if (!values.name) {
                            errors.name = "Pet name is required";
                        }
                        if (!values.age) {
                            errors.age = "Pet age is required";
                        }
                        if (!values.category) {
                            errors.category = "Pet category is required";
                        }
                        if (!values.location) {
                            errors.location = "Location is required";
                        }
                        return errors;
                    }}

                    onSubmit={async (values, { resetForm }) => {
                        const formData = new FormData();
                        formData.append('image', values.image);

                        const res = await axiosPublic.post(image_hosting_API, formData, {
                            headers: {
                                'content-type': 'multipart/form-data'
                            }
                        });

                        if (res.data.success) {
                            const petData = {
                                image: res.data.data.url,
                                name: values.name,
                                age: values.age,
                                category: values.category,
                                location: values.location,
                                "short description": values.shortDescription,
                                "long description": values.longDescription,
                                "date and time": new Date(res.data.data.time * 1000).toLocaleString(),
                                ownerEmail: user.email,
                                adopted: "false"
                            }

                            const pets = await axiosSecure.post('/pets', petData);
                            resetForm();
                            setImagePreview(null);
                            if (pets.data.insertedId) {
                                Swal.fire(`Your ${values.name} has been added successfully!`);
                            }
                        }
                    }}
                >

                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                        isSubmitting,
                    }) => (

                        <form onSubmit={handleSubmit} className="relative z-10 mt-8 space-y-5">

                            <div>
                                <label className="text-sm font-semibold text-foreground">Pet Image</label>
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setIsDragging(false);
                                        const file = e.dataTransfer.files?.[0];
                                        if (file) {
                                            setFieldValue('image', file);
                                            readPreview(file);
                                        }
                                    }}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`mt-1.5 flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed p-5 transition-colors ${
                                        isDragging
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border bg-secondary/30 hover:border-primary/40 dark:border-white/15 dark:bg-white/5'
                                    }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            setFieldValue('image', file || null);
                                            readPreview(file);
                                        }}
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
                                            {values.image ? values.image.name : (
                                                <>Click to upload <span className="font-normal text-muted-foreground">or drag &amp; drop</span></>
                                            )}
                                        </p>
                                        <p className="text-xs text-muted-foreground">JPG, PNG or WEBP (max. 5MB)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="text-sm font-semibold text-foreground">Full Name *</label>
                                    <div className="mt-1.5">
                                        <IconInput
                                            icon={User}
                                            type="text"
                                            name="name"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.name}
                                            placeholder="Enter pet name"
                                            error={touched.name && errors.name}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-foreground">Age</label>
                                    <div className="mt-1.5">
                                        <IconInput
                                            icon={Calendar}
                                            type="text"
                                            name="age"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.age}
                                            placeholder="Enter pet age"
                                            error={touched.age && errors.age}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-foreground">Category *</label>
                                    <div className="relative mt-1.5">
                                        <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-primary/70 dark:text-colorSecondary/80">
                                            <PawPrint className="h-4 w-4" />
                                        </span>
                                        <Select
                                            options={petCategories}
                                            value={petCategories.find((c) => c.value === values.category) || null}
                                            onChange={(option) => setFieldValue("category", option?.value || "")}
                                            onBlur={handleBlur}
                                            placeholder="Select category"
                                            unstyled
                                            classNames={{
                                                control: () => 'w-full rounded-xl border border-border bg-secondary/40 py-1 pl-8 pr-2 text-sm dark:border-white/10 dark:bg-white/5',
                                                placeholder: () => 'text-muted-foreground',
                                                singleValue: () => 'text-foreground',
                                                input: () => 'text-foreground',
                                                menu: () => 'z-20 mt-1 overflow-hidden rounded-xl border border-border bg-card shadow-lg dark:border-white/10',
                                                option: ({ isFocused, isSelected }) =>
                                                    `cursor-pointer px-3 py-2 text-sm ${
                                                        isSelected ? 'bg-primary text-primary-foreground' : isFocused ? 'bg-secondary text-foreground dark:bg-white/10' : 'text-foreground'
                                                    }`,
                                                indicatorSeparator: () => 'hidden',
                                                dropdownIndicator: () => 'text-muted-foreground pr-2',
                                            }}
                                        />
                                    </div>
                                    {touched.category && errors.category && (
                                        <p className="mt-1 text-xs font-medium text-destructive">{errors.category}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-foreground">Location</label>
                                    <div className="mt-1.5">
                                        <IconInput
                                            icon={MapPin}
                                            type="text"
                                            name="location"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.location}
                                            placeholder="Enter location"
                                            error={touched.location && errors.location}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-foreground">Short Description</label>
                                    <span className="text-xs text-muted-foreground">{values.shortDescription.length}/120</span>
                                </div>
                                <div className="relative mt-1.5">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary/70 dark:text-colorSecondary/80">
                                        <FileText className="h-4 w-4" />
                                    </span>
                                    <input
                                        type="text"
                                        name="shortDescription"
                                        maxLength={120}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.shortDescription}
                                        placeholder="A short note about the pet"
                                        className="w-full rounded-xl border border-border bg-secondary/40 py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 dark:border-white/10 dark:bg-white/5"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-foreground">Long Description</label>
                                    <span className="text-xs text-muted-foreground">{values.longDescription.length}/500</span>
                                </div>
                                <div className="relative mt-1.5">
                                    <span className="pointer-events-none absolute left-3 top-3 text-primary/70 dark:text-colorSecondary/80">
                                        <FileText className="h-4 w-4" />
                                    </span>
                                    <textarea
                                        name="longDescription"
                                        maxLength={500}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.longDescription}
                                        placeholder="Detailed information about the pet"
                                        className="h-32 w-full resize-y rounded-xl border border-border bg-secondary/40 py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 dark:border-white/10 dark:bg-white/5"
                                    ></textarea>
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
                                        Submit Pet
                                    </>
                                )}
                            </motion.button>

                            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                                <ShieldCheck className="h-3.5 w-3.5 text-primary dark:text-colorSecondary" /> Your information is safe &amp; secure with us.
                            </p>
                        </form>
                    )}
                </Formik>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.08, rotate: 8 }}
                className="absolute -bottom-4 left-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30"
            >
                <PawPrint className="h-5 w-5" />
            </motion.div>
        </div>
    );
};

export default AddPets;
