import { useQuery } from "@tanstack/react-query";
import { getAllBlogs } from "../../../../components/UserPanel/HomePage/TrendingBlogSection/services/blogsService";

// Full blog list (object-shaped, not the array-row /blog/recent or
// /blog/filter formats) — powers BlogDetails' sidebar "Recent Post" list,
// Previous/Next navigation, and Related Blogs, all derived client-side from
// this one array, matching the CRA source.
export const useAllBlogs = () => {
  return useQuery({
    queryKey: ["all-blogs"],
    queryFn: getAllBlogs,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
