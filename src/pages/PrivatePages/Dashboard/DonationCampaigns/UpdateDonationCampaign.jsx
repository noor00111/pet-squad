import useAxiosPublic from '@/hooks/useAxiosPublic';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { AuthContext } from '@/provider/AuthProvider';
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


const UpdateDonationCampaign = () => {
    const { petName, amount, lastDate, shortDescription, longDescription, _id } = useLoaderData();
    // console.log(donationCampaign);

    const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
    const image_hosting_API = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset } = useForm();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();


    const onSubmit = async (data) => {

        const imageFile = { image: data.image[0] }
        const res = await axiosPublic.post(image_hosting_API, imageFile, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        });
        if (res.data.success) {
            const updateDonationData = {
                petName: data.name,
                image: res.data.data.display_url,
                amount: data.amount,
                "last date": data.lastDate,
                "short description": data.shortDescription,
                "long description": data.longDescription,
                campaignOwnerEmail: user.email,
            }

            const updateDonationRes = await axiosSecure.put(`/donationCampaign/${_id}`, updateDonationData);
            console.log(updateDonationRes.data);

            if (updateDonationRes.data.modifiedCount > 0) {
                reset();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `Your donation information has been updated successfully!`,
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/dashboard/myDonationCampaigns');
            }
        }
    }
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-2xl mx-auto p-10 bg-card border border-border shadow-lg shadow-primary/10 rounded-2xl"
        >
            <Helmet><title>Edit Donation | Pet Squad</title></Helmet>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-full my-6">
                    <input {...register('image', { required: true })} type="file" className="file-input w-full max-w-xs" />
                </div>

                <div className="w-full my-6">
                    <label>
                        <span className="text-sm font-medium text-foreground/80">Name*</span>
                    </label>
                    <input
                        defaultValue={petName}
                        type="text"
                        placeholder="Please enter the name of your pet"
                        {...register('name', { required: true })}
                        className="w-full mt-1 border border-border bg-background text-foreground p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-colorSecondary transition-shadow" />
                </div>

                <div className="w-full my-6">
                    <label>
                        <span className="text-sm font-medium text-foreground/80">Amount*</span>
                    </label>
                    <input
                        defaultValue={amount}
                        type="text"
                        placeholder="Enter the maximum amount"
                        {...register('amount', { required: true })}
                        className="w-full mt-1 border border-border bg-background text-foreground p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-colorSecondary transition-shadow" />
                </div>

                <div className="w-full my-6">
                    <label>
                        <span className="text-sm font-medium text-foreground/80">Last Date</span>
                    </label>
                    <input
                        defaultValue={lastDate}
                        type="date"
                        placeholder="Enter"
                        {...register('lastDate', { required: true })}
                        className="w-full mt-1 border border-border bg-background text-foreground p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-colorSecondary transition-shadow" />
                </div>

                <div className="w-full my-6">
                    <label>
                        <span className="text-sm font-medium text-foreground/80">Short Description</span>
                    </label>
                    <input
                        defaultValue={shortDescription}
                        type="text"
                        placeholder="Enter a short description"
                        {...register('shortDescription', { required: true })}
                        className="w-full mt-1 border border-border bg-background text-foreground p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-colorSecondary transition-shadow" />
                </div>

                <div>
                    <label>
                        <span className="text-sm font-medium text-foreground/80">Long Description</span>
                    </label>
                    <textarea {...register('longDescription')}
                        defaultValue={longDescription}
                        className="w-full mt-1 border border-border bg-background text-foreground p-2 rounded-lg h-28 focus:outline-none focus:ring-2 focus:ring-colorSecondary transition-shadow" placeholder="Provide detailed information"></textarea>
                </div>

                <div className='flex justify-center'>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="bg-primary px-6 py-2 rounded-md text-primary-foreground mt-5 shadow-md shadow-primary/30 transition-colors hover:bg-primary/90 font-headingFont">
                        Submit</motion.button>
                </div>


            </form>
        </motion.div>
    );
};

export default UpdateDonationCampaign;