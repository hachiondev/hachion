import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from "@/lib/apiBase";
export const useGeoKeywordsByCourse = courseName => {
  return useQuery({
    queryKey: ['geoKeywords', courseName],
    queryFn: async () => {
      if (!courseName) return [];
      const res = await axios.get(`${API_BASE_URL}/api/admin/geo-keywords/by-course`, {
        params: {
          courseName
        }
      });
      return res.data?.geoKeywords || [];
    },
    enabled: !!courseName,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity
  });
};
