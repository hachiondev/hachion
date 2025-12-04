import { useQuery } from "@tanstack/react-query";
import { getCoursesSummary, getTrendingCourses } from "../../../Components/UserPanel/TrendingSection/services/coursesService";
import { getTrainers } from "../../../Components/UserPanel/TrendingSection/services/trainersService";

export const useTrendingData = () => {
  return useQuery({
    queryKey: ["trending-courses"],
    queryFn: async () => {
      const [trendingRaw, summary, trainers] = await Promise.all([
        getTrendingCourses(),
        getCoursesSummary(),
        getTrainers(),
      ]);

      const activeTrending = (trendingRaw || []).filter(c => c?.status);

      const detailed = activeTrending.map(t => {
        const courseName = (t.course_name || "").trim();
        const courseDetails = summary.find(s => (s.courseName || "").trim() === courseName);
        const matchedTrainer = trainers.find(
          tr => (tr.course_name || "").trim().toLowerCase() === courseName.toLowerCase()
        );

        return {
          ...t,
          ...courseDetails,
          trainerName: matchedTrainer?.trainer_name || "",
        };
      });

      return detailed;
    },
    staleTime: 1000 * 60 * 5,
  });
};
