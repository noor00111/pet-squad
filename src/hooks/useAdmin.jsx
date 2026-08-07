import React, { useContext } from 'react';
import useAxiosSecure from './useAxiosSecure';
import { AuthContext } from '@/provider/AuthProvider';
import { useQuery } from '@tanstack/react-query';

const useAdmin = () => {
    const axiosSecure = useAxiosSecure();
    const {user, loading} = useContext(AuthContext)

    const { data: admin, isPending: loadingAdmin } = useQuery({
        queryKey: [user?.email, 'admin'],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/admin/${user.email}`);
            return res.data?.admin;
        }
    })
    return [admin, loadingAdmin];
}



export default useAdmin;