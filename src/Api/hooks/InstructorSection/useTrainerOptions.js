import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchTrainerOptions = async () => {
  const res = await axios.get(
    "https://api.test.hachion.co/trainersnames-unique"
  );
  return Array.isArray(res.data) ? res.data : [];
};

export const useTrainerOptions = () => {
  return useQuery({
    queryKey: ["trainerOptions"],
    queryFn: fetchTrainerOptions,
    staleTime: 1000 * 60 * 10, // 10 mins
    cacheTime: 1000 * 60 * 30, // 30 mins
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
