import axios from "axios";
import { API_BASE_URL } from "@/lib/config";


const axiosPublic = axios.create({
    baseURL: API_BASE_URL
})

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;