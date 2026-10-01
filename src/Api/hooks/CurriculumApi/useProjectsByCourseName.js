import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/lib/apiBase";

const API_BASE = `${API_BASE_URL}`;

export function useProjectsByCourseName(courseName) {
  return useQuery({
    queryKey: ["projectsByCourse", courseName],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/projects/by-course/${encodeURIComponent(courseName)}`);
      return res.data || [];
    },
    enabled: !!courseName,
    staleTime: 5 * 60 * 1000,
  });
}
