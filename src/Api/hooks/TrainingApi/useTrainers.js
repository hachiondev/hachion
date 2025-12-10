import { useQuery } from "@tanstack/react-query";
import { getTrainers } from "../../../../src/Components/UserPanel/HomePage/TrendingSection/services/trainersService";

export const useTrainers = () => {
  return useQuery({
    queryKey: ["trainers"],
    queryFn: getTrainers,
    staleTime: 1000 * 60 * 5,
  });
};
