import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "https://api.test.hachion.co/api/tools/all/flat";

export function useGetAllToolsFlat() {
  return useQuery({
    queryKey: ["admin-tools-flat"],
    queryFn: async () => {
      const res = await axios.get(API_URL);
      return Array.isArray(res.data) ? res.data : [];
    },
    staleTime: 5 * 60 * 1000, // 5 mins
    refetchOnWindowFocus: false,
  });
}
