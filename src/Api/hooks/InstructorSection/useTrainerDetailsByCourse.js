import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useTrainerDetailsByCourse(courseName) {
  return useQuery({
    queryKey: ["trainerDetailsByCourse", courseName],
    queryFn: async () => {
      const res = await axios.get(
        "https://api.test.hachion.co/courses/by-course",
        { params: { courseName } }
      );

      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: !!courseName,   
    staleTime: 5 * 60 * 1000, 
  });
}
