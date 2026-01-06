import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useTrainerCourseReviews = (trainerName, courseName) => {
  return useQuery({
    queryKey: ["trainer-course-reviews", trainerName, courseName],

    queryFn: async () => {
      if (!trainerName || !courseName) return [];

      const url = `https://api.test.hachion.co/userreview/instructor/${encodeURIComponent(
        trainerName
      )}/${encodeURIComponent(courseName)}`;

      const res = await axios.get(url);
      return Array.isArray(res.data) ? res.data : [];
    },

    enabled: Boolean(trainerName && courseName),
  });
};
