import { useQuery } from "@tanstack/react-query";
import { getLearnerReviews } from "../../../../src/Components/UserPanel/HomePage/LearnerSection/services/learnerService";

export const useLearnerReviews = () => {
  return useQuery({
    queryKey: ["learner-reviews"],
    queryFn: getLearnerReviews,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
