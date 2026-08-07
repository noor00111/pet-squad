import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

const useCampaignDonations = (campaignId) => {
    const axiosSecure = useAxiosSecure();

    const { data: donations = [], isPending, isError } = useQuery({
        queryKey: ['campaignDonations', campaignId],
        queryFn: async () => (await axiosSecure.get(`/donationCampaign/${campaignId}/donations`)).data,
        enabled: !!campaignId,
        retry: false,
    });

    const raised = donations.reduce((sum, d) => sum + Number(d.donatedAmount || 0), 0);

    return { donations, raised, donorsCount: donations.length, isPending, isError };
};

export default useCampaignDonations;
