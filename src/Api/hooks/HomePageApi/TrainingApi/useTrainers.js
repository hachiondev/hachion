import { useQuery } from "@tanstack/react-query";
import { getTrainers } from "../../../../Components/UserPanel/HomePage/TrendingSection/services/trainersService";

export const useTrainers = () => {
  return useQuery({
    queryKey: ["trainers"],
    queryFn: getTrainers,
        staleTime: 1000 * 60 * 5, 
        gcTime: Infinity, 
    refetchOnWindowFocus: false, 
    refetchOnMount: false,
    refetchOnReconnect: false, 
    retry: 1, 
  });
};
