import { useQuery } from "@tanstack/react-query";

export const useUserMe = (getCookieFn) => {
  return useQuery({
    queryKey: ["user-me"],
    queryFn: async () => {
      const res = await fetch("https://api.hachion.co/api/me", {
        credentials: "include",
      });

      if (!res.ok) return null;
      const user = await res.json();

      // Add picture fallback from cookie
      user.picture = user.picture || getCookieFn("avatar") || "";

      return user;
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // cache 5 minutes
    gcTime: Infinity, // ✅ Cache never gets garbage collected (formerly cacheTime)
    refetchOnWindowFocus: false, // ✅ Don't refetch when user returns to tab
    refetchOnMount: false, // ✅ Don't refetch on component remount
    refetchOnReconnect: false, // ✅ Don't refetch when internet reconnects
    retry: 1, // ✅ Only retry once if it fails
  });
};
