import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useAssessmentAccess({ studentId, courseName, assessmentFileName, enabled }) {
  return useQuery({
    queryKey: ["assessmentAccess", studentId, courseName, assessmentFileName],
    enabled: enabled && !!studentId && !!courseName && !!assessmentFileName,
    queryFn: async () => {
      const res = await axios.get(`https://api.hachion.co/enroll/course/check`, {
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
