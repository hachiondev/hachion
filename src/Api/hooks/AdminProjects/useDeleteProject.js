import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/apiBase";
export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async id => {
      const res = await axios.delete(`${API_BASE_URL}/projects/${id}`);
      return {
        id,
        message: res.data
      };
    },
    onSuccess: ({
      id
    }) => {
      queryClient.setQueryData(["projects"], (oldProjects = []) => oldProjects.filter(project => project.projectId !== id));
    }
  });
}