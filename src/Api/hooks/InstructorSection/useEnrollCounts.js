import { useQueries } from "@tanstack/react-query";
import axios from "axios";

/**
 * Fetch enroll counts per (trainer, course)
 * Logic unchanged, only React Query v5 safe
 */
export const useEnrollCounts = ({ trainers = [] }) => {
  const unique = new Map();

  trainers.forEach((t) => {
    if (!t?.trainer_name || !t?.course_name) return;
    const key = `${t.trainer_name}::${t.course_name}`;
    if (!unique.has(key)) {
      unique.set(key, t);
    }
  });

  const uniqueTrainers = Array.from(unique.values());

  // ✅ React Query v5 returns { queries }
  const { queries } = useQueries({
    queries: uniqueTrainers.map((t) => ({
      queryKey: ["enrollCount", t.trainer_name, t.course_name],
      queryFn: async () => {
        const res = await axios.get(
          "https://api.test.hachion.co/enroll/count",
          {
            params: {
              trainerName: t.trainer_name,
              courseName: t.course_name,
            },
          }
        );
        return res.data?.count ?? 0;
      },
      enabled: true,
      staleTime: 1000 * 60 * 10,
      retry: 1,
    })),
  });

  // ✅ Always guard
  if (!Array.isArray(queries)) return {};

  return queries.reduce((acc, q) => {
    if (!q?.data || !Array.isArray(q.queryKey)) return acc;

    const [, trainer, course] = q.queryKey;
    if (!trainer || !course) return acc;

    acc[`${trainer}::${course}`] = q.data;
    return acc;
  }, {});
};
