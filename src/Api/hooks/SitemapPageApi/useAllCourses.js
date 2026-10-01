import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/lib/apiBase";

const fetchAllCourses = async () => {
  const response = await axios.get(`${API_BASE_URL}/courses/all`);
  return Array.isArray(response.data) ? response.data : [];
};

export const useAllCourses = (key = "allCourses", initialData) => {
  return useQuery({
    queryKey: [key],
    queryFn: fetchAllCourses,
    ...(initialData ? { initialData } : {}),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
