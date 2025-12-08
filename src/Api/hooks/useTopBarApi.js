import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchCountry = async () => {
  const res = await axios.get('https://api.country.is');
  if (res.status !== 200) throw new Error('Failed to fetch');
  return res.data;
};

export const useTopBarApi = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['userCountry'],
    queryFn: fetchCountry,
    staleTime: Infinity, // ✅ Data never becomes stale
    gcTime: Infinity, // ✅ Cache never gets garbage collected (formerly cacheTime)
    refetchOnWindowFocus: false, // ✅ Don't refetch when user returns to tab
    refetchOnMount: false, // ✅ Don't refetch on component remount
    refetchOnReconnect: false, // ✅ Don't refetch when internet reconnects
    retry: 1, // ✅ Only retry once if it fails
  });

  const isIndia = data?.country?.toUpperCase() === 'IN';

  // Default values (US number)
  let whatsappNumber = '+1 (732) 485-2499';
  let whatsappLink = 'https://wa.me/17324852499';

  // Update if we have data and user is in India
  if (!error && data && isIndia) {
    whatsappNumber = '+91-949-032-3388';
    whatsappLink = 'https://wa.me/919490323388';
  }

  return {
    whatsappNumber,
    whatsappLink,
    isLoading,
    error,
  };
};