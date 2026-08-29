import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';
import { AuthContext } from '@/provider/AuthProvider';
import { Helmet } from 'react-helmet-async';
import SocialLogin from './SocialLogin';
import { setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import auth from '@/firebase/firebase.config';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import loginImg from "@/assets/images/auth.png";


const SUPPORT_EMAIL = 'mail@gmail.com';

const Login = () => {

    const { loginUser, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    const from = location.state?.from?.pathname || "/";

    const handleLogin = async (e) => {
        e.preventDefault();

        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
            const result = await loginUser(email, password);
            const user = result.user;
            setUser(user);
            Swal.fire({
                title: 'Welcome back! You’re now logged in and ready to explore!',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            });
            navigate(from, { replace: true });
        } catch (error) {
            toast.error("Something is wrong!!");
        }
    }


    return (
        <div>
            <Helmet>
                <title>Login | Pet Squad</title>
            </Helmet>

            <div className="relative grid min-h-screen items-center justify-center gap-10 overflow-hidden bg-secondary px-4 py-10 lg:grid-cols-2 lg:px-10">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-primary/20 blur-[110px]"
                        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-colorSecondary/20 blur-[110px]"
                        animate={{ x: [0, -25, 0], y: [0, -20, 0] }}
                        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                </div>

                  <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                    className="relative z-10 flex flex-col items-center gap-2 text-center">
                   <img src={loginImg} alt="" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative z-10 mx-auto w-full max-w-md rounded-[1.75rem] border border-border bg-card/90 p-8 shadow-xl shadow-primary/10 backdrop-blur-sm sm:p-10">
                    <h2 className="flex items-center justify-center gap-2 text-center font-headingFont text-2xl font-bold text-foreground">
                        Welcome Back!
                    </h2>
                  

                    <form
                        onSubmit={handleLogin}
                        className="space-y-4 mt-6">

                        <div>
                            <Label htmlFor="email" className="text-foreground/80">
                                Email Address
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
                            <Label htmlFor="password" className="text-foreground/80">
                                Password
                            </Label>
                            <div className="relative mt-1">
                                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    className="pl-9 pr-9 transition-shadow duration-200 focus-visible:ring-2 focus-visible:ring-colorSecondary"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground">
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-muted-foreground">
                                <input type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 rounded border-border accent-primary"/>
                                Remember me
                            </label>
                            <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Password reset request')}`}
                                className="text-colorPrimary hover:underline">
                                Forgot Password?
                            </a>
                        </div>


                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                type="submit"
                                className="w-full gap-2 bg-primary dark:bg-colorPrimary/40 text-primary-foreground dark:text-white font-medium py-2 px-4 rounded-full shadow-md shadow-primary/30 transition hover:bg-primary/90">
                               Login
                            </Button>
                        </motion.div>
                        <SocialLogin></SocialLogin>
                    </form>


                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        <p>
                            New here? Create an account now!
                            <Link to="/register"
                                className="text-colorPrimary text-lg hover:underline font-medium ml-2">
                                     Register
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>

    );
};

export default Login;
