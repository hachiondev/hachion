import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = "https://api.test.hachion.co";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/course-categories/all`);
      return Array.isArray(res.data) ? res.data : [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
