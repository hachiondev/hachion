import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/lib/apiBase";
const API_URL = `${API_BASE_URL}/api/tools`;
export function useDeleteToolItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      itemId,
      category_name,
      courseName
    }) => {
      const res = await axios.delete(`${API_URL}/item/${itemId}`, {
        params: {
          category_name,
          courseName
        }
      });
      return res.data;
    },
    onSuccess: () => {
      // 🔄 refresh flat list automatically
      queryClient.invalidateQueries(["toolsFlat"]);
    }
  });
}