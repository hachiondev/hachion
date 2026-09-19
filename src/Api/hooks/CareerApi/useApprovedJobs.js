import { useQuery } from "@tanstack/react-query";
import { getApprovedJobs } from "@/components/UserPanel/services/careerService";

export const useApprovedJobs = () => {
  return useQuery({
    queryKey: ["approved-jobs"],
    queryFn: getApprovedJobs,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
