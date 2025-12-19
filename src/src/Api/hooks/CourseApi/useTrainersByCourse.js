import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useTrainersByCourse(courseName) {
  return useQuery({
    queryKey: ["trainersByCourse", courseName],
    queryFn: async () => {
      const res = await axios.get(
        "https://api.test.hachion.co/trainernames/by-course",
        { params: { courseName } }
      );
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: !!courseName,          
    staleTime: 5 * 60 * 1000,       
  });
}
