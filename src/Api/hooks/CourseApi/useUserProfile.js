import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/lib/apiBase";

export function useUserProfile() {
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("loginuserData")) : null;
  const email = user?.email || null;
  return useQuery({
    queryKey: ["userProfile", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/v1/user/myprofile`, {
        params: { email },
      });
      const data = res.data || {};
      return { email, ...data };
    },
    staleTime: 5 * 60 * 1000,
  });
}
