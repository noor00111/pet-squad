import useAdmin from '@/hooks/useAdmin';
import Loading from '@/components/loading/Loading';
import React from 'react';
import { Navigate } from 'react-router-dom';

const DashboardRedirect = () => {
    const [admin, loadingAdmin] = useAdmin();

    if (loadingAdmin) {
        return <Loading></Loading>
    }

    return <Navigate to={admin ? "/dashboard/admin" : "/dashboard/user"} replace></Navigate>
};

export default DashboardRedirect;
