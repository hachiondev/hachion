import { useQueries } from "@tanstack/react-query";
import axios from "axios";

const normalize = (val) =>
  val
    ?.replace(/\+/g, " ")
    ?.trim()
    ?.toLowerCase();

export const useEnrollCounts = ({ trainers = [] }) => {
  const unique = new Map();

  trainers.forEach((t) => {
    const trainerName = normalize(
  t.trainer_name || t.trainerName
);

const courseName = normalize(
  t.course_name || t.courseName
);


    if (!trainerName || !courseName) return;

    const key = `${trainerName.trim().toLowerCase()}::${courseName
      .trim()
      .toLowerCase()}`;

    if (!unique.has(key)) {
      unique.set(key, { trainerName, courseName });
    }
  });

  const uniqueTrainers = Array.from(unique.values());

  // ✅ CORRECT v5 USAGE
  const queries = useQueries({
    queries: uniqueTrainers.map((t) => ({
      queryKey: ["enrollCount", t.trainerName, t.courseName],
      queryFn: async () => {
        const res = await axios.get(
          "https://api.test.hachion.co/enroll/count",
          {
            params: {
              trainerName: t.trainerName,
              courseName: t.courseName.replace(/\s/g, "+"),
            },
          }
        );
        return res.data?.count ?? 0;
      },
      staleTime: 1000 * 60 * 10,
      retry: 1,
    })),
  });
return Array.isArray(queries)
  ? queries.reduce((acc, q) => {
      if (!q || !Array.isArray(q.queryKey) || q.queryKey.length < 3) {
        return acc;
      }

      if (q.data == null) return acc;

      const [, trainer, course] = q.queryKey;

      acc[
        `${trainer.trim().toLowerCase()}::${course
          .trim()
          .toLowerCase()}`
      ] = q.data;

      return acc;
    }, {})
  : {};

};
