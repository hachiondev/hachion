import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/lib/apiBase";
const API_URL = `${API_BASE_URL}/api/tools/all/flat`;
export function useGetAllToolsFlat() {
  return useQuery({
    queryKey: ["admin-tools-flat"],
    queryFn: async () => {
      const res = await axios.get(API_URL);
      return Array.isArray(res.data) ? res.data : [];
    },
    staleTime: 5 * 60 * 1000,
    // 5 mins
    refetchOnWindowFocus: false
  });
}