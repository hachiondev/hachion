import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = "https://api.test.hachion.co";

export function useProjectsByCourseName(courseName) {
  return useQuery({
    queryKey: ["projectsByCourse", courseName],
    queryFn: async () => {
      const res = await axios.get(
        `${API_BASE}/projects/by-course/${encodeURIComponent(courseName)}`
      );
      return res.data || [];
    },
    enabled: !!courseName,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
