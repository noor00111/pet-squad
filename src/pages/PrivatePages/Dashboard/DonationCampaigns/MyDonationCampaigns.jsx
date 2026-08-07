import DonatorModal from '@/components/donation/DonatorModal';
import CampaignProgressBar from '@/components/donation/CampaignProgressBar';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import useDonation from '@/hooks/useDonation';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import { Calendar, Gift, Heart, Pause, PawPrint, Pencil, Play, TrendingUp, Users, Wallet, Zap } from 'lucide-react';
import { staggerContainer, fadeUp } from '@/lib/motion';

const customStyles = {
  content: {
    top: '58%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    maxHeight: '85vh',
    overflowY: 'auto',
    padding: 0,
    border: 'none',
    borderRadius: '1rem',
    backgroundColor: 'transparent',
    boxShadow: '0 25px 60px -15px hsl(265, 60%, 20%, 0.45)',
  },
  overlay: {
    backgroundColor: 'hsla(265, 30%, 8%, 0.55)',
    backdropFilter: 'blur(2px)',
    zIndex: 50,
  },
};

const formatDate = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const MyDonationCampaigns = () => {
  const [donationCampaign, , refetch] = useDonation();
  const axiosSecure = useAxiosSecure();
  const [donatorsModalIsOpen, setDonatorsModalIsOpen] = useState(false);
  const [donators, setDonators] = useState([]);

  const handlePause = async (id, isPaused) => {
    const pauseStatus = { isPaused };

    const res = await axiosSecure.put(`/donationCampaign/${id}`, pauseStatus)

    if (res.data.modifiedCount > 0) {
      refetch();
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Campaign ${isPaused ? 'paused' : 'resumed'}`,
        showConfirmButton: false,
        timer: 1800,
      });
    }
  }

  const handleViewDonators = async (id) => {
    const res = await axiosSecure.get(`/donationCampaign/${id}/donations`)
    setDonators(res.data);
    setDonatorsModalIsOpen(true);
  }

  const closeModal = () => {
    setDonatorsModalIsOpen(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Helmet><title>My Donation Campaigns | Pet Squad</title></Helmet>

      {donationCampaign.length === 0 ? (
        <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center text-muted-foreground">
          <PawPrint className="mx-auto h-8 w-8 text-muted-foreground/60" />
          <p className="mt-3">You haven't created any donation campaigns yet.</p>
          <Link to="/dashboard/createDonationCampaign">
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25">
              <Gift className="h-4 w-4" /> Start a campaign
            </span>
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="hidden bg-gradient-to-r from-primary to-primary/80 px-6 py-4 text-primary-foreground lg:grid lg:grid-cols-[1.3fr_1fr_1.2fr_1.4fr] lg:gap-4">
            <span className="flex items-center gap-2 font-semibold"><PawPrint className="h-4 w-4" /> Pet Name</span>
            <span className="flex items-center gap-2 font-semibold"><Gift className="h-4 w-4" /> Maximum Donation Amount</span>
            <span className="flex items-center gap-2 font-semibold"><TrendingUp className="h-4 w-4" /> Progress</span>
            <span className="flex items-center gap-2 font-semibold"><Zap className="h-4 w-4" /> Actions</span>
          </div>

          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            animate="visible"
            className="divide-y divide-border"
          >
            {donationCampaign.map((campaign) => {
              const isPaused = !!campaign.isPaused;
              return (
                <motion.div
                  key={campaign._id}
                  variants={fadeUp}
                  className="grid grid-cols-1 gap-5 px-6 py-6 transition-colors hover:bg-secondary/40 lg:grid-cols-[1.3fr_1fr_1.2fr_1.4fr] lg:items-center lg:gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={campaign.image}
                      alt={campaign.petName}
                      className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-border"
                    />
                    <p className="font-headingFont text-lg font-semibold text-foreground">{campaign.petName}</p>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-colorSecondary">
                      <Wallet className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-headingFont text-base font-bold text-foreground">$ {' '} {Number(campaign.amount || 0).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Maximum Goal</p>
                    </div>
                  </div>

                  <CampaignProgressBar campaignId={campaign._id} goal={campaign.amount} />

                  <div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handlePause(campaign._id, !campaign.isPaused)}
                        className="inline-flex items-center gap-1.5 rounded-full border-2 border-primary/50 px-3.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground dark:text-colorSecondary"
                      >
                        {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                        {isPaused ? 'Unpause' : 'Pause'}
                      </button>

                      <Link to={`/dashboard/updateDonationCampaign/${campaign._id}`}>
                        <button className="inline-flex items-center gap-1.5 rounded-full border-2 border-colorSecondary/60 px-3.5 py-1.5 text-xs font-semibold text-colorSecondary transition-colors hover:bg-colorSecondary hover:text-violet-950">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                      </Link>

                      <button
                        onClick={() => handleViewDonators(campaign._id)}
                        className="inline-flex items-center gap-1.5 rounded-full border-2 border-emerald-500/60 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-500 hover:text-white dark:text-emerald-400"
                      >
                        <Users className="h-3.5 w-3.5" /> View Donators
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="flex items-center gap-4 px-6 py-6">
            <span className="h-px flex-1 bg-border" />
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-colorSecondary">
                <Heart className="h-4 w-4" />
              </span>
              Every donation makes a paw-sitive impact. Thank you!
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
        </div>
      )}

      <Modal
        isOpen={donatorsModalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Donors for this campaign">
        {donatorsModalIsOpen && (
          <DonatorModal donators={donators} closeModal={closeModal} />
        )}
      </Modal>
    </motion.div>
  );
};

export default MyDonationCampaigns;
