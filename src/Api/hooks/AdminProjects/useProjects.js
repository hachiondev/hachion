import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/apiBase";
export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/projects`);
      return res.data;
    },
    staleTime: 5 * 60 * 1000
  });
}