import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/lib/apiBase";

const API_BASE = `${API_BASE_URL}`;

export function useUserReviewsByCourse(courseName) {
  return useQuery({
    queryKey: ["userReviewsByCourse", courseName],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/userreview/by-course`, {
        params: { courseName },
      });
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: !!courseName,
    staleTime: 5 * 60 * 1000,
  });
}
