import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import { AuthContext } from '@/provider/AuthProvider';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const CheckoutForm = ({ donation, onSuccess, initialAmount }) => {

    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const axiosSecure = useAxiosSecure();
    const axiosPublic = useAxiosPublic();
    const { user } = useContext(AuthContext);

    const showThankYou = async () => {
        let recommended = [];
        try {
            const res = await axiosPublic.get(`/donationCampaign?page=0&limit=4`);
            recommended = (res.data.campaigns || []).filter((c) => c._id !== donation._id).slice(0, 3);
        } catch {
            recommended = [];
        }

        const recommendedHtml = recommended.length ? `
                <h3 style="font-weight: bold; margin-top: 12px;">More campaigns that need your help</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 12px;">
                    ${recommended.map((c) => `
                        <a href="/donationDetails/${c._id}" style="
                            display: block; width: 150px; padding: 12px; border: 1px solid #e5e0d8;
                            border-radius: 12px; text-decoration: none; color: inherit; text-align: left;">
                            <img src="${c.image}" alt="${c.petName}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 8px;" />
                            <p style="margin: 8px 0 2px; font-weight: 600; font-size: 0.9rem;">${c.petName}</p>
                            <p style="margin: 0; font-size: 0.8rem; color: #8a5a1a;">Goal: ${c.amount} </p>
                        </a>
                    `).join('')}
                </div>
            `
            : '';

        Swal.fire({
            title: 'Thank you for your donation!',
            html: `<p>Your generosity helps ${donation.petName} get closer to their goal.</p>${recommendedHtml}`,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: 'Close'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const amount = e.target.amount.value;

        const res = await axiosSecure.post("/create-payment-intent", { amount });
        const clientSecret = res.data.clientSecret;

        if (!stripe || !elements) {
            return
        }

        const card = elements.getElement(CardElement)
        if (card === null) {
            return
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        })

        if (error) {
            setError(error.message);
        }
        else {
            setError('');
        }

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    email: user?.email || 'anonymous',
                    name: user?.displayName || 'anonymous'
                }
            }
        })
        if (confirmError) {
            setError(confirmError.message);
        }
        else {
            if (paymentIntent.status === 'succeeded') {
                setTransactionId(paymentIntent.id)

                const donationData = {
                    campaignId: donation._id,
                    image: donation.image,
                    name: donation.petName,
                    donatedAmount: amount,
                    transactionId: paymentIntent.id,
                    donorEmail: user.email,
                }
                const res = await axiosSecure.post('/myDonation', donationData);

                if (res.data?.donateResult?.insertedId) {
                    onSuccess?.();
                    await showThankYou();
                }
            }
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="rounded-lg border border-border bg-background p-3">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#3f2d5c',
                                '::placeholder': {
                                    color: '#a99bc2',
                                },
                            },
                            invalid: {
                                color: '#e0245e',
                            },
                        },
                    }}
                />
                </div>

                <Label htmlFor="email" className="text-foreground/80 font-bodyFont">
                    Donation Amount
                </Label>
                <Input
                    name="amount"
                    id="amount"
                    type="number"
                    min="1"
                    defaultValue={initialAmount || ''}
                    placeholder="Enter your amount"
                    className="mt-1 font-bodyFont focus-visible:ring-2 focus-visible:ring-colorSecondary transition-shadow"
                    required
                />
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="font-bodyFont bg-primary my-4 px-4 py-2 rounded shadow-md shadow-primary/30 text-primary-foreground transition-colors hover:bg-primary/90"
                    type="submit"
                    disabled={!stripe}
                >
                    Donate
                </motion.button>
                <p className="text-sm font-bodyFont text-destructive">{error}</p>
                {transactionId && <p className="text-emerald-500"> Your transaction id: {transactionId}</p>}
            </form>
        </div>
    );
};

export default CheckoutForm;
