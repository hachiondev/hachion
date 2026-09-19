import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = `/api/sitemap-categories`;

const fetchCategories = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
// Ported from the CRA app's src/Api/hooks/SitemapPageApi/useCategories.js —
// same path/behavior, imported by the Courses listing page and its Sidebar.
// Distinct from src/Api/hooks/HomePageApi/NavbarApi/useCategories.js, which
// is a separate, lighter hook used only by NavbarTop.jsx.
export const useCategories = (initialData) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    ...(initialData ? { initialData } : {}),
    staleTime: 1000 * 60 * 10, // keep fresh for 10 mins
    gcTime: 1000 * 60 * 30, // keep cache for 30 mins (formerly cacheTime)
    retry: 2, // retry up to 2 times
    refetchOnWindowFocus: false, // prevent unwanted refresh
  });
};
