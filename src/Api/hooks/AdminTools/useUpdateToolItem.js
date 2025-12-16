import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "https://api.test.hachion.co/api/tools/item";

export function useUpdateToolItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      category_name,
      courseName,
      toolsName,
      toolsLink,
      toolImage,
    }) => {
      const formData = new FormData();

      formData.append("category_name", category_name);
      formData.append("courseName", courseName);
      formData.append("toolsName", toolsName);
      formData.append("toolsLink", toolsLink);

      if (toolImage) {
        formData.append("toolImage", toolImage);
      }

      const res = await axios.put(
        `${API_URL}/${itemId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data;
    },

    onSuccess: () => {
      // 🔥 refresh table after update
      queryClient.invalidateQueries(["admin-tools-flat"]);
    },
  });
}
