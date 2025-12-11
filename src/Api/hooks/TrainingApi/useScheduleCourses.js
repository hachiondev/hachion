import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// API function (axios)
const fetchScheduleCourses = async (timezone) => {
  const { data } = await axios.get(
    `https://api.hachion.co/schedulecourse?timezone=${timezone}`
  );
  return Array.isArray(data) ? data : [];
};

export function useScheduleCourses(timezone) {
  return useQuery({
    queryKey: ["schedule-courses", timezone],
    queryFn: () => fetchScheduleCourses(timezone),
        staleTime: 1000 * 60 * 5, // cache 5 minutes
        gcTime: Infinity, // ✅ Cache never gets garbage collected (formerly cacheTime)
    refetchOnWindowFocus: false, // ✅ Don't refetch when user returns to tab
    refetchOnMount: false, // ✅ Don't refetch on component remount
    refetchOnReconnect: false, // ✅ Don't refetch when internet reconnects
    retry: 1, // ✅ Only retry once if it fails
  });
}
