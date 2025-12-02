import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchCountry = async () => {
  const res = await axios.get('https://api.country.is');
  if (res.status !== 200) throw new Error('Failed to fetch');
  return res.data;
};

export const useTopBarApi = () => {
  const { data, error } = useQuery({
    queryKey: ['userCountry'],
    queryFn: fetchCountry,
  });

  const isIndia = data?.country?.toUpperCase() === 'IN';

  // Default (if loading or error)
  let whatsappNumber = '+1 (732) 485-2499';
  let whatsappLink = 'https://wa.me/17324852499';

  if (!error && data) {
    if (isIndia) {
      whatsappNumber = '+91-949-032-3388';
      whatsappLink = 'https://wa.me/919490323388';
    }
  }

  return {
    whatsappNumber,
    whatsappLink,
    isLoading: !data && !error,
    error,
  };
};
