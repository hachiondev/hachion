import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = "https://api.test.hachion.co";

export function useGeneralFaqs() {
  return useQuery({
    queryKey: ["generalFaqs"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/general-faq`);

      // Map API response to UI-friendly format
      return Array.isArray(res.data)
        ? res.data.map((item) => ({
            q: item.faqTitle || "",
            a: item.description || "",
          }))
        : [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}
