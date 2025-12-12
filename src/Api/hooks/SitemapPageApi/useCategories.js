import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "https://api.hachion.co/course-categories/all";

const fetchCategories = async () => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: "Bearer 98A4V2IB5X6V7B671Y18QPWMU9Q5TG4S",
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10,   // keep fresh for 10 mins
    cacheTime: 1000 * 60 * 30,   // keep cache for 30 mins
    retry: 2,                    // retry up to 2 times
    refetchOnWindowFocus: false, // prevent unwanted refresh
  });
};
