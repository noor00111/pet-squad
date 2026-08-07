import {AuthContext} from '@/provider/AuthProvider';
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaGithub, FaGoogle } from "react-icons/fa";
import { PawPrint } from 'lucide-react';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import Swal from 'sweetalert2';

const SocialLogin = () => {
    const { loginWithGoogle, setUser,loginWithGithub } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();

    const handleGoogleLogin = () => {
        loginWithGoogle()
            .then(res => {
                const user = res.user;
                const userInfoInDB =
                {
                    email: res.user?.email,
                    photo: res.user?.photoURL,
                    name: res.user?.displayName,
                    role: "user"
                };
                axiosPublic.post('/users', userInfoInDB)
                    .then(() => {
                        setUser(user);
                        navigate("/");
                    })
            })
    }

    const handleGithub = () => {
        loginWithGithub()
            .then(res => {
                const user = res.user;
                const userInfoInDB =
                {
                    email: res.user?.email,
                    photo: res.user?.photoURL,
                    name: res.user?.displayName,
                    role: "user"
                };
                axiosPublic.post('/users', userInfoInDB)
                .then(() => {
                    setUser(user);
                    navigate("/");
                })
            })
    }

    return (
        <div className=''>
             <div className="flex items-center justify-center gap-3 my-4">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-primary dark:text-colorSecondary">
                    <PawPrint className="h-3.5 w-3.5" />
                </span>
                <div className="flex-grow border-t border-border"></div>
            </div>
            <p>
                <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogleLogin}
                    type="button"
                    className="w-full border border-border rounded-full py-2.5 my-2.5 flex justify-center items-center gap-2 text-foreground shadow-sm transition-colors hover:bg-secondary"><FaGoogle size={18}></FaGoogle> Continue with Google</motion.button>
            </p>
            <p>
                <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGithub}
                    type="button"
                    className="w-full border border-border rounded-full py-2.5 flex justify-center items-center gap-2 text-foreground shadow-sm transition-colors hover:bg-secondary"> <FaGithub size={18}/> Continue with GitHub</motion.button>
            </p>
        </div>
    );
};

export default SocialLogin;