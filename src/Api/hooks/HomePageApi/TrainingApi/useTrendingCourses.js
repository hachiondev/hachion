import { useQuery } from "@tanstack/react-query";
import { getTrendingCourses } from "../../../../components/UserPanel/HomePage/TrendingSection/services/coursesService";

export const useTrendingCourses = () => {
  return useQuery({
    queryKey: ["trending-courses-raw"],
    queryFn: getTrendingCourses,
    staleTime: 1000 * 60 * 5,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};
