import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import usePets from '@/hooks/usePets';
import { AuthContext } from '@/provider/AuthProvider';
import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const AdoptionRequest = () => {
    const axiosSecure = useAxiosSecure();
    const [adoptionRequest, setAdoptionRequest] = useState([]);
    const [myRequest, setMyRequest] = useState([]);
    const [, , refetch] = usePets();
    const [tab, setTab] = useState(0);
    const { user } = useContext(AuthContext);
    // console.log(user.email);

    const fetchAdoptionList = async () => {
        const res = await axiosSecure.get(`/adoption/request?email=${user.email}`)
        // console.log(res);
        setAdoptionRequest(res.data);
    }

    const fetchMyRequest = async () => {
        const res = await axiosSecure.get(`/adoption/myRequest?email=${user.email}`)
        // console.log(res);
        setMyRequest(res.data);
    }


    useEffect(() => {
        if (user?.email) {
            fetchAdoptionList();
            fetchMyRequest();
        }

    }, [user?.email]);



    const handleUpdateAdoption = async (_id, command) => {

        const updatedData = { command }
        console.log(updatedData);

        const adoptionRequest = await axiosSecure.put(`/adoption/update/${_id}`, updatedData);
        console.log(adoptionRequest);
        if (adoptionRequest.data.acknowledged) {
            refetch();
            Swal.fire({
                title: `Adoption Request ${command}ed`,
                icon: "success",
                draggable: true
            });
            fetchAdoptionList();
        }
    }


    return (

        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className='my-10'
        >

            <div>
                <button
                className={`rounded-lg px-5 py-2 mr-5 mb-7 font-semibold transition-colors ${tab === 0 ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30' : 'bg-secondary text-foreground hover:bg-secondary/70'}`}
                onClick={() => setTab(0)}>
                My Request</button>
                <button
                className={`rounded-lg px-5 py-2 font-semibold transition-colors ${tab === 1 ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30' : 'bg-secondary text-foreground hover:bg-secondary/70'}`}
                onClick={() => setTab(1)}>Adoption Request</button>
            </div>


            {
                tab === 0 && (
                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <Table>
                        <TableCaption>A list of Your Requested Pets.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Serial Number</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Number</TableHead>
                                <TableHead>Location</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>

                            {myRequest.map((petInfo, idx) => (
                                <TableRow key={petInfo._id} className="transition-colors hover:bg-secondary/60">
                                    <TableCell className="font-medium">{idx + 1}</TableCell>
                                    <TableCell>{petInfo.petName}</TableCell>
                                    <TableCell>{petInfo.phone}</TableCell>
                                    <TableCell>{petInfo.address}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </div>
                )
            }

            {
                tab === 1 && (
                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <Table>
                        <TableCaption>A list of Your Selected Pets.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Serial Number</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Number</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead className='text-center'>Action</TableHead>

                            </TableRow>
                        </TableHeader>
                        <TableBody>

                            {adoptionRequest.map((petInfo, idx) => (
                                <TableRow key={petInfo._id} className="transition-colors hover:bg-secondary/60">
                                    <TableCell className="font-medium">{idx + 1}</TableCell>
                                    <TableCell>{petInfo.petName}</TableCell>
                                    <TableCell>{petInfo.phone}</TableCell>
                                    <TableCell>{petInfo.address}</TableCell>
                                    <TableCell className="justify-center flex">
                                        <button
                                            onClick={() => handleUpdateAdoption(petInfo._id, 'accept')}
                                            className='px-5 py-1 rounded-lg bg-emerald-500 text-white mr-1 transition-transform hover:scale-105'>Accept</button>
                                        <button
                                            onClick={() => handleUpdateAdoption(petInfo._id, 'reject')}
                                            className='px-5 py-1 rounded-lg bg-destructive text-destructive-foreground mr-1 transition-transform hover:scale-105'>Reject</button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </div>
                )
            }
        </motion.div>

    );
};

export default AdoptionRequest;