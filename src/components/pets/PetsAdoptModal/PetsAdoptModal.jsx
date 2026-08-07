import useAxiosSecure from '@/hooks/useAxiosSecure';
import usePets from '@/hooks/usePets';
import { AuthContext } from '@/provider/AuthProvider';
import { motion } from 'framer-motion';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const PetsAdoptModal = ({ pet, closeModal }) => {
    const axiosSecure = useAxiosSecure();
     const { user } = useContext(AuthContext);
     const [, , refetch] = usePets();
     const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        const phone = e.target.phone.value;
        const address = e.target.address.value;

        const adoptionData = {
            petId: pet._id,
            petName: pet.name,
            petImage: pet.image,
            userName: user.displayNamename,
            adopterEmail: user.email,
            ownerEmail: pet.ownerEmail,
            phone,
            address,
            date: new Date(),
            status: "pending",
        }

        const adoption = await axiosSecure.post('/adoption', adoptionData);
        if (adoption.data.insertedId) {
            refetch();
            Swal.fire("adopton done");
        }
        navigate('/dashboard/adoptionRequest')
    }

return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 flex justify-center items-center z-50 font-bodyFont"
    >
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-card w-96 max-h-[85vh] overflow-y-auto p-6 rounded-2xl border border-border shadow-xl"
        >
            <h2 className="text-3xl font-semibold mb-4 text-center text-colorPrimary font-headingFont">{pet.name}</h2>
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                    <label className="block text-colorSecondary font-medium">User Name</label>
                    <input
                    name='name'
                        type="text"
                        className="w-full border border-border rounded-md px-3 py-2 bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-colorSecondary transition-shadow"
                        required
                        value={user.displayName}
                        readOnly
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-colorSecondary font-medium">Email</label>
                    <input
                    name='email'
                        type="email"
                        className="w-full border border-border rounded-md px-3 py-2 bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-colorSecondary transition-shadow"
                        required
                        value={user.email}
                        readOnly
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-colorSecondary font-medium">Phone Number</label>
                    <input
                    name='phone'
                        type="text"
                        placeholder='Enter Your Number'
                        className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-colorSecondary transition-shadow"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-colorSecondary font-medium">Address</label>
                    <textarea
                     name='address'
                     placeholder='Enter Your Current Address'
                        className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-colorSecondary transition-shadow"
                        required
                    />
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-md shadow-primary/30 hover:bg-primary/90 transition-colors w-full"
                >
                    Submit
                </motion.button>
            </form>
            <button
                onClick={closeModal}
                className="mt-4 text-colorPrimary hover:underline w-full"
            >
                Close
            </button>
        </motion.div>
    </motion.div>
);
};

export default PetsAdoptModal;