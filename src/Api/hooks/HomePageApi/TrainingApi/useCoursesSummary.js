import { useQuery } from "@tanstack/react-query";
import { getCoursesSummary } from "../../../../components/UserPanel/HomePage/TrendingSection/services/coursesService";

export const useCoursesSummary = () => {
  return useQuery({
    queryKey: ["coursesSummary"],
    queryFn: getCoursesSummary,
    staleTime: 1000 * 60 * 5,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};
