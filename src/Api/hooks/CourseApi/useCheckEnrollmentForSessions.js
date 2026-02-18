import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = "https://api.test.hachion.co";

export function useCheckEnrollmentForSessions(
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
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,

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

            
            if (enrolled && amount > 0) {
              return {
                ...sess,
                _isEnrolled: true,
                amount,
              };
            }

            // 🟡 Case B: Enrolled but amount = 0 → check installments
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

    
    if ((total > 0 && clicked === total) || allPaid) {
      return {
        ...sess,
        _isEnrolled: true,   
        amount: 0,
        _installmentsCompleted: true,
      };
    }

    
    return {
      ...sess,
      _isEnrolled: true,  
      amount: 0,
      _installmentsCompleted: false,
    };
  } catch (e) {
    console.error(
      "Error checking installment progress for session",
      sess.id,
      e
    );

    
    return {
      ...sess,
      _isEnrolled: true,
      amount: 0,
    };
  }
}
            return {
              ...sess,
              _isEnrolled: true,
              amount: 0,
            };
          } catch (e) {
            console.error("Error checking enrollment for session", sess.id, e);

            return {
              ...sess,
              _isEnrolled: true,
              amount: 0,
            };
          }
        })
      );

      return results;
    },
  });
}
