import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useBlogs() {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await axios.get("https://api.test.hachion.co/allblogs");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
