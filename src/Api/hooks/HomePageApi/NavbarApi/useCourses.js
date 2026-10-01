import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/lib/apiBase";
export function useCourses({ enabled = true } = {}) {
  return useQuery({
    queryKey: ["courses"],
    enabled,
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/courses/names-and-categories`);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    // 5 mins
    gcTime: Infinity,
    // ✅ Cache never gets garbage collected (formerly cacheTime)
    refetchOnWindowFocus: false,
    // ✅ Don't refetch when user returns to tab
    refetchOnMount: false,
    // ✅ Don't refetch on component remount
    refetchOnReconnect: false,
    // ✅ Don't refetch when internet reconnects
    retry: 1 // ✅ Only retry once if it fails
  });
}