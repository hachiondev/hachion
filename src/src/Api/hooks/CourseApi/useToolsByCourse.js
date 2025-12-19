import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useToolsByCourse(courseName) {
  return useQuery({
    queryKey: ["toolsByCourse", courseName],
    enabled: !!courseName,
    queryFn: async () => {
      const res = await axios.get(
        "https://api.test.hachion.co/api/tools/by-course",
        {
          params: { courseName },
        }
      );
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
