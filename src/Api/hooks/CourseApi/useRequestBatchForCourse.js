import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/lib/apiBase";

export function useRequestBatchForCourse() {
  return useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post(`${API_BASE_URL}/requestbatch/course/add`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
  });
}
