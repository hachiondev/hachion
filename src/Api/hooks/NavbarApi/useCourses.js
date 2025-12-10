import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await axios.get(
        "https://api.hachion.co/courses/names-and-categories"
      );
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 mins
  });
}
