import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = "http://localhost:8081";

export function useCourseByName(courseName) {
  return useQuery({
    queryKey: ["courseByName", courseName],
    queryFn: async () => {
      const res = await axios.get(
        `${API_BASE}/courses/getByCourseName/${encodeURIComponent(courseName)}`
      );
      return Array.isArray(res.data) ? res.data[0] : null;
    },
    enabled: !!courseName,
    staleTime: 5 * 60 * 1000,
  });
}
