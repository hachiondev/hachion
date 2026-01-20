import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "https://api.test.hachion.co/api/tools";

/**
 * ✅ Extract original filename
 * Example:
 * CRMCourses_SalesforceAdmin_Java2.webp → Java2.webp
 */
const extractOriginalFileName = (imageUrl) => {
  if (!imageUrl) return null;

  const fileName = imageUrl.split("/").pop();
  const parts = fileName.split("_");

  // remove category + course prefix
  return parts.length >= 3
    ? parts.slice(2).join("_")
    : fileName;
};

/**
 * ✅ Convert existing image URL → Multipart File
 * (Frontend-only, no backend change)
 */
async function imageUrlToFile(imageUrl) {
  const fullUrl = `https://api.test.hachion.co/uploads/test/tools_images/${imageUrl}`;

  const response = await fetch(fullUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch original image");
  }

  const blob = await response.blob();
  const cleanFileName = extractOriginalFileName(imageUrl);

  return new File([blob], cleanFileName, { type: blob.type });
}

/**
 * ✅ Fallback default image (only if no image exists)
 */
async function getDefaultImageFile() {
  const response = await fetch("/default-tool.png");
  const blob = await response.blob();
  return new File([blob], "default-tool.png", { type: blob.type });
}

export function useAddTools() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ category_name, courseName, rows }) => {
      const formData = new FormData();

      // ✅ MUST match backend @RequestParam names
      formData.append("category_name", category_name);
      formData.append("courseName", courseName);

      for (const row of rows) {
        formData.append("toolsName", row.toolsName);
        formData.append("toolsLink", row.toolsLink);

        /**
         * ✅ Image handling priority:
         * 1. User uploaded File
         * 2. Existing tool image (convert URL → File)
         * 3. Default fallback image
         */
        if (row.toolImages instanceof File) {
          // User uploaded image
          formData.append("toolImages", row.toolImages);

        } else if (typeof row.toolImages === "string" && row.toolImages) {
          // Checkbox-selected existing tool image
          const originalImageFile = await imageUrlToFile(row.toolImages);
          formData.append("toolImages", originalImageFile);

        } else {
          // True fallback
          const defaultImage = await getDefaultImageFile();
          formData.append("toolImages", defaultImage);
        }
      }

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
