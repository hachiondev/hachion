import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API = `https://api.hachion.co`;

// See useCourseByName.js for why `initialData` exists — same server-seeded
// hydration pattern, used here to avoid a server-rendered "Loading
// curriculum..." placeholder on the course-details page. Callers must pass
// data already shaped as `{ uiCurriculum, curriculum }` (matching queryFn's
// return shape) keyed off the same normalizedCourse this hook computes.
export function useCurriculumAll(courseName, options = {}) {
  const normalizedCourse = decodeURIComponent(courseName || "")
    .toLowerCase()
    .replace(/[\s\-_]/g, "");
  return useQuery({
    queryKey: ["curriculumAll", normalizedCourse],
    queryFn: async () => {
      const res = await axios.get(`${API}/curriculum/course/${normalizedCourse}`);
      return {
        uiCurriculum: res.data,
        curriculum: res.data,
      };
    },
    enabled: !!normalizedCourse,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
}
