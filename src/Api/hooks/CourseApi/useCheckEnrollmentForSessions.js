import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = "https://api.test.hachion.co";

export function useCheckEnrollmentForSessions(sessions, studentId, courseName) {
  const hasSessions = Array.isArray(sessions) && sessions.length > 0;

  return useQuery({
    queryKey: [
      "enrollmentStatus",
      studentId || "anon",
      courseName || "no-course",
      hasSessions ? sessions.map((s) => s.id) : [],
    ],
    
    enabled: hasSessions,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      
      if (!hasSessions) return [];

      
      if (!studentId || !courseName) {
        return sessions;
      }
      const results = await Promise.all(
        sessions.map(async (sess) => {
          try {
            const res = await axios.get(`${API_BASE}/enroll/is-enrolled`, {
              params: {
                studentId,
                courseName,
                batchId: sess.batchId || "",
              },
            });
return {
  ...sess,
  _isEnrolled: res.data?.enrolled ?? false,
  amount: res.data?.amount ?? 0, // 👈 NEW: used to switch Enroll → Enrolled
};

          } catch (e) {
            console.error("Error checking enrollment for session", sess.id, e);
            return { ...sess, _isEnrolled: false };
          }
        })
      );

      return results;
    },
  });
}
