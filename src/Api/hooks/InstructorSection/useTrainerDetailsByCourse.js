import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/lib/apiBase";

export function useTrainerDetailsByCourse(courseName) {
  return useQuery({
    queryKey: ["trainerDetailsByCourse", courseName],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/coursedetails/by-course`, {
        params: { courseName },
      });
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: !!courseName,
    staleTime: 5 * 60 * 1000,
  });
}
