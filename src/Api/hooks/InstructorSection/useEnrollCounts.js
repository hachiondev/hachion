import { useQueries } from "@tanstack/react-query";
import axios from "axios";

/**
 * Fetch enroll counts per (trainer, course)
 * Logic intentionally unchanged from component
 */
export const useEnrollCounts = ({
  trainers = [],
  enrollCounts = {},
  countKey,
}) => {
  const enrollQueries = useQueries({
    queries: Array.isArray(trainers)
      ? trainers
          .filter((t) => enrollCounts[countKey(t)] == null)
          .map((t) => ({
            queryKey: ["enrollCount", t.trainer_name, t.course_name],
            queryFn: async () => {
              try {
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
              } catch {
                return 0;
              }
            },
            enabled: !!t?.trainer_name && !!t?.course_name,
            staleTime: 1000 * 60 * 10,
            cacheTime: 1000 * 60 * 30,
            retry: 1,
          }))
      : [],
  });

  return enrollQueries;
};
