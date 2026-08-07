import React, { useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/provider/AuthProvider";
import { Label } from '@/components/ui/label';
import Swal from 'sweetalert2'
import SocialLogin from './SocialLogin';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import { Camera, CheckCircle2, Circle, Eye, EyeOff, Heart, Lock, Mail, PawPrint, User } from 'lucide-react';

const Registration = () => {
    const { registerUser, setUser, userUpdateProfile } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    const [error, setError] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');

    const passwordChecks = [
        { label: 'At least 6 characters', met: password.length >= 6 },
        { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
        { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    ];

    const handleRegister = (e) => {
        e.preventDefault();

        const name = e.target.name.value;
        const email = e.target.email.value;
        const photo = e.target.photo.value;
        const password = e.target.password.value;


        if (password.length < 6) {
            setError({ ...error, password: "Must be at least 6 characters!!" })
            return;
        }
        const checkUpperCase = /[A-z]/;
        if (!checkUpperCase.test(password)) {
            setError({ ...error, password: 'Must include at least one uppercase letter!' })
            return;
        }
        const checkLowerCase = /[a-z]/;
        if (!checkLowerCase.test(password)) {
            setError({ ...error, password: 'Must include at least one lower letter!' })
            return;
        }


        registerUser(email, password)
            .then(result => {
                const user = result.user;
                // console.log(user);
                setUser(user);

                userUpdateProfile({ displayName: name, photoURL: photo })
                const userInfoInDB = {name, email, photo, role: "user"};
                axiosPublic.post('/users', userInfoInDB)
                    .then(res => {
                        if (res.data.insertedId) {
                            Swal.fire({
                                title: "Successfully registered! Let’s get started!!!",
                                icon: "success",
                                draggable: true
                            });
                            navigate("/")
                        }
                    })
            })
            .catch((error) => {
                toast.error(error.message);
            })

    };


    return (
        <div>
            <Helmet>
                <title>Register | Pet Squad</title>
            </Helmet>
            <div className="relative grid min-h-screen items-center justify-center gap-10 overflow-hidden bg-secondary px-4  lg:grid-cols-2 lg:px-10">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-primary/20 blur-[110px]"
                        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
                        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute -left-20 bottom-10 h-80 w-80 rounded-full bg-colorSecondary/20 blur-[110px]"
                        animate={{ x: [0, 25, 0], y: [0, -20, 0] }}
                        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative z-10 order-2 mx-auto my-10 w-full max-w-md rounded-[1.75rem] border border-border bg-card/90 p-8 shadow-xl shadow-primary/10 backdrop-blur-sm sm:p-10 lg:order-1">

                    <h2 className="flex items-center justify-center gap-2 text-center font-headingFont text-xl font-bold text-foreground">
                        Create an Account!
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                    </p>

                    <form
                        onSubmit={handleRegister}
                        className="space-y-4 mt-6">

                        <div>
                            <Label htmlFor="name">
                                Full Name*
                            </Label>
                            <div className="relative mt-1">
                                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="pl-9 transition-shadow duration-200 focus-visible:ring-2 focus-visible:ring-colorSecondary"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="email">
                                Email
                            </Label>
                            <div className="relative mt-1">
                                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="pl-9 transition-shadow duration-200 focus-visible:ring-2 focus-visible:ring-colorSecondary"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="password">
                                Password
                            </Label>
                            <div className="relative mt-1">
                                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError({}); }}
                                    className="pl-9 pr-9 transition-shadow duration-200 focus-visible:ring-2 focus-visible:ring-colorSecondary"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                                {passwordChecks.map((check) => (
                                    <span
                                        key={check.label}
                                        className={`inline-flex items-center gap-1 text-xs transition-colors ${check.met ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}
                                    >
                                        {check.met ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                                        {check.label}
                                    </span>
                                ))}
                            </div>

                            <AnimatePresence>
                                {error.password && (
                                    <motion.label
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="label block text-sm font-medium text-destructive"
                                    >
                                        {error.password}
                                    </motion.label>
                                )}
                            </AnimatePresence>
                        </div>

                        <div>
                            <Label htmlFor="photo">
                                Photo URL
                            </Label>
                            <div className="relative mt-1">
                                <Camera className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="photo"
                                    type="text"
                                    placeholder="Link to your profile photo"
                                    className="pl-9 transition-shadow duration-200 focus-visible:ring-2 focus-visible:ring-colorSecondary"
                                    required
                                />
                            </div>
                        </div>


                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                type="submit"
                                className="w-full gap-2 bg-primary dark:bg-colorPrimary/40 text-primary-foreground dark:text-white font-medium py-2 px-4 rounded-full shadow-md shadow-primary/30 transition hover:bg-primary/90"
                            >
                               Register
                            </Button>
                        </motion.div>
                        <SocialLogin></SocialLogin>
                    </form>


                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        <p>
                            Have already account?
                            <Link
                                to="/login"
                                className="text-colorPrimary text-lg hover:underline font-medium ml-2"
                            > Go to Login
                            </Link>
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                    className="relative z-10 order-1 flex flex-col items-center gap-2 text-center lg:order-2">
                    <h1 className="flex items-center gap-2 text-balance font-headingFont text-3xl font-bold leading-tight text-colorSecondary lg:text-4xl">
                        Every Pet Deserves  A Loving Family
                        <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Heart className="h-7 w-7 fill-purple-400 text-purple-600" />
                        </motion.span>
                    </h1>
                   
                    <motion.img
                        src="https://i.ibb.co.com/s9rmKKJS/reg.png"
                        alt="A dog, cat, rabbit, and cockatiel together, surrounded by hearts"
                        className=""
                        animate={{ y: [0, -12, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default Registration;
