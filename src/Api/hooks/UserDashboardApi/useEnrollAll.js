import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchEnrollAll = async () => {
  const res = await axios.get(
    "https://api.test.hachion.co/enroll"
  );
  return Array.isArray(res.data) ? res.data : [];
};

export const useEnrollAll = () => {
  return useQuery({
    queryKey: ["enrollAll"],
    queryFn: fetchEnrollAll,
    staleTime: 1000 * 60 * 10, // 10 mins
    cacheTime: 1000 * 60 * 30, // 30 mins
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
