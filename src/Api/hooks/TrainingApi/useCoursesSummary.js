import { useQuery } from "@tanstack/react-query";
import { getCoursesSummary } from "../../../../src/Components/UserPanel/HomePage/TrendingSection/services/coursesService";
export const useCoursesSummary = () => {
  return useQuery({
    queryKey: ["coursesSummary"],
    queryFn: getCoursesSummary,
    staleTime: 1000 * 60 * 5,
  });
};
