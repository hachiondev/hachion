import { useQuery } from "@tanstack/react-query";
import { getLearnerReviews } from "../../../../Components/UserPanel/HomePage/LearnerSection/services/learnerService";

export const useLearnerReviews = () => {
  return useQuery({
    queryKey: ["learner-reviews"],
    queryFn: getLearnerReviews,

    // 🔥 Always treat data as stale so it refetches
    staleTime: 0,

    // 🔥 Refetch every time component mounts
    refetchOnMount: "always",

    // Optional behaviors
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,

    retry: 1,
  });
};