import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchAllCourses = async () => {
  const response = await axios.get("https://api.test.hachion.co/courses/all");
  return Array.isArray(response.data) ? response.data : [];
};

export const useAllCourses = (key = "allCourses") => {
  return useQuery({
    queryKey: [key],
    queryFn: fetchAllCourses,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
