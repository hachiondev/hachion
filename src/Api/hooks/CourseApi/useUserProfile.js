import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useUserProfile() {
  
  const user = JSON.parse(localStorage.getItem("loginuserData")) || null;
  const email = user?.email || null;

  return useQuery({
    queryKey: ["userProfile", email],
    enabled: !!email, 

    queryFn: async () => {
      const res = await axios.get(
        "https://api.test.hachion.co/api/v1/user/myprofile",
        { params: { email } }
      );

      const data = res.data || {};

      return {
        email,
        ...data, 
      };
    },

    staleTime: 5 * 60 * 1000,
  });
}
