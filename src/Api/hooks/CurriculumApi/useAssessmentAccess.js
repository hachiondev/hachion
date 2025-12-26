import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useAssessmentAccess({
  studentId,
  courseName,
  assessmentFileName,
  enabled,
}) {
  return useQuery({
    queryKey: ["assessmentAccess", studentId, courseName, assessmentFileName],

    enabled: enabled && !!studentId && !!courseName && !!assessmentFileName,

    queryFn: async () => {
      const res = await axios.get(
        "https://api.test.hachion.co/enroll/course/check",
        {
          params: {
            studentId,
            courseName,
            assessmentFileName,
          },
        }
      );

      return res.data;
    },
    gcTime: Infinity, // ✅ Cache never gets garbage collected (formerly cacheTime)
    refetchOnWindowFocus: false, // ✅ Don't refetch when user returns to tab
    refetchOnMount: false, // ✅ Don't refetch on component remount
    refetchOnReconnect: false, // ✅ Don't refetch when internet reconnects
    retry: 1, // ✅ Only retry once if it fails
  });
}
