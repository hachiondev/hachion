// src/Api/hooks/BlogsApi/useRecentBlogs.js
import { useQuery } from "@tanstack/react-query";
import { getRecentBlogs } from "../../../../Components/UserPanel/HomePage/TrendingBlogSection/services/blogsService";

export const useRecentBlogs = () => {
  return useQuery({
    queryKey: ["recent-blogs"],
    queryFn: getRecentBlogs,
       staleTime: 1000 * 60 * 5, // cache 5 minutes
        gcTime: Infinity, // ✅ Cache never gets garbage collected (formerly cacheTime)
    refetchOnWindowFocus: false, // ✅ Don't refetch when user returns to tab
    refetchOnMount: false, // ✅ Don't refetch on component remount
    refetchOnReconnect: false, // ✅ Don't refetch when internet reconnects
    retry: 1, // ✅ Only retry once if it fails
  });
};