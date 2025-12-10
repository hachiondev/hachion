import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// API function (axios)
const fetchScheduleCourses = async (timezone) => {
  const { data } = await axios.get(
    `https://api.hachion.co/schedulecourse?timezone=${timezone}`
  );
  return Array.isArray(data) ? data : [];
};

export function useScheduleCourses(timezone) {
  return useQuery({
    queryKey: ["schedule-courses", timezone],
    queryFn: () => fetchScheduleCourses(timezone),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
