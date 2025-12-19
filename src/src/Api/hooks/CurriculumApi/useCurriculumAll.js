import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API = "https://api.test.hachion.co";

export function useCurriculumAll(courseName) {
  const normalizedCourse = decodeURIComponent(courseName || "")
    .toLowerCase()
    .replace(/[\s\-_]/g, "");

  return useQuery({
    queryKey: ["curriculumAll", normalizedCourse],

    queryFn: async () => {
      const res = await axios.get(
        `${API}/curriculum/course/${normalizedCourse}`
      );

      return {
        uiCurriculum: res.data,
        curriculum: res.data,
      };
    },

    enabled: !!normalizedCourse,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
