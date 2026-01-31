import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = "https://api.test.hachion.co";

export function useCheckEnrollmentForSessions(
  sessions,
  studentId,
  courseName
) {
  const hasSessions = Array.isArray(sessions) && sessions.length > 0;

  /**
   * 🔑 IMPORTANT
   * Create a STABLE key from sessions
   * (never pass array/object directly to queryKey)
   */
  const sessionKey = hasSessions
    ? sessions.map((s) => s.batchId).join("|")
    : "no-sessions";

  return useQuery({
    queryKey: [
      "enrollmentStatus",
      studentId || "anon",
      courseName || "no-course",
      sessionKey,
    ],

    enabled: hasSessions && !!studentId && !!courseName,

    staleTime: 5 * 60 * 1000, 
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,

    queryFn: async () => {
      if (!hasSessions) return [];

      const results = await Promise.all(
        sessions.map(async (sess) => {
          try {
            const res = await axios.get(
              `${API_BASE}/enroll/is-enrolled`,
              {
                params: {
                  studentId,
                  courseName,
                  batchId: sess.batchId || "",
                },
              }
            );

            return {
              ...sess,
              _isEnrolled: res.data?.enrolled ?? false,
              amount: res.data?.amount ?? 0,
            };
          } catch (e) {
            console.error(
              "Error checking enrollment for session",
              sess.id,
              e
            );

            
            return {
              ...sess,
              _isEnrolled: false,
              amount: 0,
            };
          }
        })
      );

      return results;
    },
  });
}
