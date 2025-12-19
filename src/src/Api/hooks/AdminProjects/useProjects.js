import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get(
        "https://api.test.hachion.co/projects"
      );
      return res.data;
    },
    staleTime: 5 * 60 * 1000
  });
}
