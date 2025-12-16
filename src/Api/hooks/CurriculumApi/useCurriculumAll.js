import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API = "https://api.test.hachion.co"; 

export function useCurriculumAll(courseName) {
  const normalize = (str) =>
    (str || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");

  const normalizedCourse = normalize(courseName);

  return useQuery({
    queryKey: ["curriculumAll", normalizedCourse],

    queryFn: async () => {
      const res = await axios.get(
        `${API}/curriculum/course/${normalizedCourse}`
      );
      const curriculum = res.data;

      return {
        uiCurriculum: curriculum,
        curriculum: curriculum,
      };
    },

    enabled: !!normalizedCourse,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
