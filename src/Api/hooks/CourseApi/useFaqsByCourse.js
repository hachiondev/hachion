import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = "https://api.test.hachion.co";

export function useFaqsByCourse(courseName) {
  return useQuery({
    queryKey: ["faqsByCourse", courseName],
    enabled: !!courseName,
    queryFn: async () => {
      const encodedCourseName = encodeURIComponent(courseName.trim());

      const res = await axios.get(
        `${API_BASE}/faq/course/${encodedCourseName}`
      );

      return res.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
