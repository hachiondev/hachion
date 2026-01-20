import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "https://api.test.hachion.co/api/tools";

export function useAddTools() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ category_name, courseName, rows }) => {
      const formData = new FormData();

      
      formData.append("category_name", category_name);
      formData.append("courseName", courseName);

      rows.forEach((row) => {
        formData.append("toolsName", row.toolsName);
        formData.append("toolsLink", row.toolsLink);

        if (row.toolImages instanceof File) {
          
          formData.append("toolImages", row.toolImages);

        } else if (typeof row.toolImages === "string" && row.toolImages) {
          
          formData.append("imageUrls", row.toolImages);
        }
      });

      const res = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    },

    onSuccess: () => {
      
      queryClient.invalidateQueries(["admin-tools-flat"]);
    },
  });
}
