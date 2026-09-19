import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchEnrollAll = async () => {
  const res = await axios.get(`https://api.hachion.co/enroll`);
  return Array.isArray(res.data) ? res.data : [];
};

export const useEnrollAll = () => {
  return useQuery({
    queryKey: ["enrollAll"],
    queryFn: fetchEnrollAll,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
