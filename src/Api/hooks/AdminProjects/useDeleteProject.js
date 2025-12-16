import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(
        `https://api.test.hachion.co/projects/${id}`
      );
      return { id, message: res.data };
    },

    onSuccess: ({ id }) => {
      queryClient.setQueryData(["projects"], (oldProjects = []) =>
        oldProjects.filter(project => project.projectId !== id)
      );
    },
  });
}
