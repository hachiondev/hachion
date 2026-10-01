import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from "@/lib/apiBase";

const fetchCorporateReviews = async () => {
  const res = await fetch(`${API_BASE_URL}/corporatereview`);
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
