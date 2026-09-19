import { useQuery } from '@tanstack/react-query';

const fetchCorporateReviews = async () => {
  const res = await fetch(`https://api.hachion.co/corporatereview`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export const useCorporateReviews = () => {
  return useQuery({
    queryKey: ['corporate-reviews'],
    queryFn: fetchCorporateReviews,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 1,
  });
};
