// src/Api/hooks/BlogsApi/useRecentBlogs.js
import { useQuery } from "@tanstack/react-query";
import { getRecentBlogs } from "../../../../src/Components/UserPanel/HomePage/TrendingBlogSection/services/blogsService";

export const useRecentBlogs = () => {
  return useQuery({
    queryKey: ["recent-blogs"],
    queryFn: getRecentBlogs,
    staleTime: 1000 * 60 * 5,
  });
};