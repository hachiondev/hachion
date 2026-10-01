import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/apiBase";
export function useAddProjects() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async payload => {
      const res = await axios.post(`${API_BASE_URL}/projects/bulk`, payload, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      return res.data; // List<ProjectResponse>
    },
    onSuccess: newProjects => {
      // Update existing cached projects without refetch
      queryClient.setQueryData(["projects"], (oldProjects = []) => {
        // Merge new projects
        const merged = [...newProjects, ...oldProjects];

        // Optional: keep backend sorting (courseCategory ASC)
        return merged.sort((a, b) => a.courseCategory.localeCompare(b.courseCategory));
      });
    }
  });
}