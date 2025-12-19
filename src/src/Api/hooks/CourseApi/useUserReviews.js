import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = "https://api.test.hachion.co";

export function useUserReviews() {
  return useQuery({
    queryKey: ["userReviews"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/userreview`);

      const filtered = res.data.filter(
        (item) =>
          item.videoLink &&
          item.videoLink !== null &&
          item.videoLink !== "" &&
          item.videoLink.includes("http")
      );

      return filtered;
    },
    staleTime: 5 * 60 * 1000,
  });
}
