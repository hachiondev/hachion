import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useBlogs() {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await axios.get("https://api.hachion.co/allblogs");

      if (!res.data || res.data.length === 0) {
        throw new Error("No blogs found");
      }

      return res.data;
    },
    retry: false, // optional: stop retrying
  });
}

