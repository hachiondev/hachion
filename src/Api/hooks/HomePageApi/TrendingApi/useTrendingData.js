import { useMemo } from "react";
import { useCoursesSummary } from "../TrainingApi/useCoursesSummary";
import { useTrainers } from "../TrainingApi/useTrainers";
import { useTrendingCourses } from "../TrainingApi/useTrendingCourses";

export const useTrendingData = () => {
  const { data: trendingRaw = [], isLoading: loadingTrending } = useTrendingCourses();
  const { data: summary = [], isLoading: loadingSummary } = useCoursesSummary();
  const { data: trainers = [], isLoading: loadingTrainers } = useTrainers();

  const loading = loadingTrending || loadingSummary || loadingTrainers;

  const detailed = useMemo(() => {
    const activeTrending = (trendingRaw || []).filter(c => c?.status);

    return activeTrending.map(t => {
      const courseName = (t.course_name || "").trim();

      const courseDetails = summary.find(
        s => (s.courseName || "").trim() === courseName
      );

      const matchedTrainer = trainers.find(
        tr =>
          (tr.course_name || "").trim().toLowerCase() ===
          courseName.toLowerCase()
      );

      return {
        ...t,
        ...courseDetails,
        trainerName: matchedTrainer?.trainer_name || "",
      };
    });
  }, [trendingRaw, summary, trainers]);

  return {
    data: detailed,
    loading,
  };
};
