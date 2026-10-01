import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/lib/apiBase";

export function useToolsByCourse(courseName) {
  return useQuery({
    queryKey: ["toolsByCourse", courseName],
    enabled: !!courseName,
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/tools/by-course`, {
        params: { courseName },
      });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
