import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = `https://api.hachion.co`;

// See useCourseByName.js for why `initialData` exists — same server-seeded
// hydration pattern, used here to avoid a server-rendered "Loading FAQs..."
// placeholder on the course-details page.
export function useFaqsByCourse(courseName, options = {}) {
  return useQuery({
    queryKey: ["faqsByCourse", courseName],
    enabled: !!courseName,
    queryFn: async () => {
      const encodedCourseName = encodeURIComponent(courseName.trim());
      const res = await axios.get(`${API_BASE}/faq/course/${encodedCourseName}`);
      return res.data || [];
    },
    ...options,
  });
}
