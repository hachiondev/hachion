import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "https://api.test.hachion.co/api/tools";

export function useDeleteToolItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, category_name, courseName }) => {
      const res = await axios.delete(
        `${API_URL}/item/${itemId}`,
        {
          params: { category_name, courseName },
        }
      );
      return res.data;
    },

    onSuccess: () => {
      // 🔄 refresh flat list automatically
      queryClient.invalidateQueries(["toolsFlat"]);
    },
  });
}
