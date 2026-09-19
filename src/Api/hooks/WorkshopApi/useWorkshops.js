import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchWorkshops = async () => {
  const { data } = await axios.get(`https://api.hachion.co/workshopschedule`);
  return Array.isArray(data) ? data : [];
};

// CRA's Workshop.jsx/WorkshopDetails.jsx/WorkshopEntries.jsx each fetched
// this same endpoint independently (3 redundant network calls across the two
// pages). One shared react-query hook gives all three the same cached data.
export const useWorkshops = () => {
  return useQuery({
    queryKey: ["workshops"],
    queryFn: fetchWorkshops,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
