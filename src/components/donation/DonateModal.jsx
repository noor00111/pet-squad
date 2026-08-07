import React from 'react';
import { motion } from 'framer-motion';
import { loadStripe } from "@stripe/stripe-js";
import SectionTitle from '../SectionTitle/SectionTitle';
import CheckoutForm from '@/pages/PrivatePages/DonateAmount/CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';



const stripePromise = loadStripe(import.meta.env.VITE_Payment_Gateway_PK);

const DonateModal = ({donation, initialAmount, onSuccess}) => {

    return (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-card p-6 rounded-2xl"
          >
            <SectionTitle title={"Donate now!!"}
                        subTitle={"Your generosity can bring hope and change lives!"}>
            </SectionTitle>

              <div>
                <Elements stripe={stripePromise}>
                <CheckoutForm donation={donation} initialAmount={initialAmount} onSuccess={onSuccess}></CheckoutForm>
            </Elements>
            </div>
          </motion.div>
    );
};

export default DonateModal;