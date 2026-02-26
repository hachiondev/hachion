import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = "https://api.test.hachion.co";

export function useCheckEnrollmentForSessionsForNewEnroll(
  sessions,
  studentId,
  courseName
) {
  const hasSessions = Array.isArray(sessions) && sessions.length > 0;

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
refetchOnWindowFocus: true,      
refetchOnReconnect: false,
refetchOnMount: "always",        

    queryFn: async () => {
      if (!hasSessions) return [];

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

            const enrolled = res.data?.enrolled ?? false;
            const amount = Number(res.data?.amount ?? 0);

            // ❌ Not enrolled at all
            if (!enrolled) {
              return {
                ...sess,
                _isEnrolled: false,
                amount: 0,
              };
            }

            // ✅ Enrolled and fully paid
            if (enrolled && amount > 0) {
              return {
                ...sess,
                _isEnrolled: true,
                amount,
                _installmentsCompleted: true,
              };
            }

            // 🟡 Enrolled but amount = 0 → check installments
            if (enrolled && amount === 0) {
              try {
                const progressRes = await axios.get(
                  `${API_BASE}/enroll/installment-progress`,
                  {
                    params: {
                      studentId,
                      courseName,
                      batchId: sess.batchId || "",
                    },
                  }
                );

                const progress = progressRes.data;

                const clicked = Number(progress?.checkboxClicked ?? 0);
                const total = Number(progress?.numberOfInstallments ?? 0);
                const allPaid = progress?.allInstallmentsPaid === true;

                const installmentsCompleted =
                  (total > 0 && clicked === total) || allPaid;

                return {
                  ...sess,
                  _isEnrolled: true, // ✅ IMPORTANT
                  amount: 0,
                  _installmentsCompleted: installmentsCompleted,
                };
              } catch (e) {
                console.error(
                  "Error checking installment progress for session",
                  sess.id,
                  e
                );

                return {
                  ...sess,
                  _isEnrolled: true, // still enrolled
                  amount: 0,
                  _installmentsCompleted: false,
                };
              }
            }

            // Fallback (should not usually hit)
            return {
              ...sess,
              _isEnrolled: false,
              amount: 0,
            };
          } catch (e) {
            console.error("Error checking enrollment for session", sess.id, e);

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