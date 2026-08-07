
import axios from "axios";
import {AuthContext} from "@/provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import useAuth from "./useAuth";
import { API_BASE_URL } from "@/lib/config";



const axiosSecure = axios.create({
    baseURL: API_BASE_URL
})
const useAxiosSecure = () => {
    
    const {logoutUser} = useAuth();
    const navigate = useNavigate();

    useEffect(() =>{
        const requestInterceptor =  axiosSecure.interceptors.request.use( config => {
        const token = localStorage.getItem('access-token');
        if(token){
            config.headers.authorization = `Bearer ${token}`;
            }  
            return config;
        });
   
    const responseInterceptor = axiosSecure.interceptors.response.use(response => response,
    async error => {
        const hadToken = !!localStorage.getItem('access-token');
        if(
            hadToken &&
            (error.response?.status === 401 || error.response?.status === 403))
            {
                await logoutUser();
                navigate('/login');
            }
            return Promise.reject(error);
        });

    return () => {
        axiosSecure.interceptors.request.eject(requestInterceptor);
        axiosSecure.interceptors.response.eject(responseInterceptor);
    };
    }, [logoutUser, navigate]);
    
        return axiosSecure;
}

export default useAxiosSecure;