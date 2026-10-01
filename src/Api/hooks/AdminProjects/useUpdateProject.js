import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/apiBase";
export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload
    }) => {
      const res = await axios.put(`${API_BASE_URL}/projects/${id}`, payload);
      return res.data; // updated project
    },
    onSuccess: updatedProject => {
      queryClient.setQueryData(["projects"], (oldProjects = []) => oldProjects.map(p => p.projectId === updatedProject.projectId ? updatedProject : p));
    }
  });
}