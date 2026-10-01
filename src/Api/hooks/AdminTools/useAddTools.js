import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/lib/apiBase";
const API_URL = `${API_BASE_URL}/api/tools`;
export function useAddTools() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      category_name,
      courseName,
      rows
    }) => {
      const formData = new FormData();
      formData.append("category_name", category_name);
      formData.append("courseName", courseName);
      rows.forEach((row, index) => {
        formData.append("toolsName", row.toolsName);
        formData.append("toolsLink", row.toolsLink);
        if (row.toolImages instanceof File) {
          formData.append("toolImages", row.toolImages);
          formData.append("imageUrls", "");
        } else if (typeof row.toolImages === "string" && row.toolImages) {
          formData.append("toolImages", new Blob([]));
          formData.append("imageUrls", row.toolImages);
        } else {
          formData.append("toolImages", new Blob([]));
          formData.append("imageUrls", "");
        }
      });
      const res = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-tools-flat"]);
    }
  });
}