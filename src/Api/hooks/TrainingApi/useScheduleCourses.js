import { useQuery } from "@tanstack/react-query";

export function useScheduleCourses(timezone) {
  return useQuery({
    queryKey: ["schedule-courses", timezone],
    queryFn: async () => {
      const res = await fetch(
        `https://api.hachion.co/schedulecourse?timezone=${timezone}`
      );
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });
}
