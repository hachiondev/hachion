import { useQuery } from "@tanstack/react-query";
import { getLearnerReviews } from "../../../../Components/UserPanel/HomePage/LearnerSection/services/learnerService";

export const useLearnerReviews = () => {
  return useQuery({
    queryKey: ["learner-reviews"],
    queryFn: getLearnerReviews,
    staleTime: 1000 * 60 * 10, // 10 minutes
        gcTime: Infinity, // ✅ Cache never gets garbage collected (formerly cacheTime)
    refetchOnWindowFocus: false, // ✅ Don't refetch when user returns to tab
    refetchOnMount: false, // ✅ Don't refetch on component remount
    refetchOnReconnect: false, // ✅ Don't refetch when internet reconnects
    retry: 1, // ✅ Only retry once if it fails
  });
};
