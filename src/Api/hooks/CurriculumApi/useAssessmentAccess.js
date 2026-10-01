import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/lib/apiBase";

export function useAssessmentAccess({ studentId, courseName, assessmentFileName, enabled }) {
  return useQuery({
    queryKey: ["assessmentAccess", studentId, courseName, assessmentFileName],
    enabled: enabled && !!studentId && !!courseName && !!assessmentFileName,
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/enroll/course/check`, {
        params: { studentId, courseName, assessmentFileName },
      });
      return res.data;
    },
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}
