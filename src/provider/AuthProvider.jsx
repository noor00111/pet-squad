import React, { createContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import auth from '@/firebase/firebase.config';
import useAxiosPublic from '@/hooks/useAxiosPublic';


const googleAuthProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
export const AuthContext = createContext("");

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosPublic = useAxiosPublic();

    const loginUser = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    const registerUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const userUpdateProfile = (updatedData) => {
        return updateProfile(auth.currentUser, updatedData);
    }

    const logoutUser = () => {
        setLoading(true);
        return signOut(auth);
    }

    const loginWithGoogle = () => {
        return signInWithPopup(auth, googleAuthProvider);
    }

    const loginWithGithub = () => {
        return signInWithPopup(auth, githubProvider);
    }

   

    //------set observer to get the current user------
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                const userInfo = { email: currentUser.email };
                axiosPublic.post('/jwt', userInfo)
                    .then(res => {
                        if (res.data.token) {
                            localStorage.setItem('access-token', res.data.token);
                        }
                    })
                    .catch(() => {
                        localStorage.removeItem('access-token');
                    })
                    .finally(() => {
                        setLoading(false);
                    })
            }
            else {
                localStorage.removeItem('access-token');
                setLoading(false);
            }
        });

        return () => {
            return unsubscribe();
        };
    }, [axiosPublic]);

    const userInfo = {
        user,
        setUser,
        loading,
        loginUser,
        registerUser,
        userUpdateProfile,
        logoutUser,
        loginWithGoogle,
        loginWithGithub

    }

    return (
        <AuthContext.Provider value={userInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;