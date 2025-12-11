import { useQuery } from "@tanstack/react-query";
import { getTrainers } from "../../../../src/Components/UserPanel/HomePage/TrendingSection/services/trainersService";

export const useTrainers = () => {
  return useQuery({
    queryKey: ["trainers"],
    queryFn: getTrainers,
        staleTime: 1000 * 60 * 5, // cache 5 minutes
        gcTime: Infinity, // ✅ Cache never gets garbage collected (formerly cacheTime)
    refetchOnWindowFocus: false, // ✅ Don't refetch when user returns to tab
    refetchOnMount: false, // ✅ Don't refetch on component remount
    refetchOnReconnect: false, // ✅ Don't refetch when internet reconnects
    retry: 1, // ✅ Only retry once if it fails
  });
};
