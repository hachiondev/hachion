import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await axios.put(
        `https://api.test.hachion.co/projects/${id}`,
        payload
      );
      return res.data; // updated project
    },

    onSuccess: (updatedProject) => {
      queryClient.setQueryData(["projects"], (oldProjects = []) =>
        oldProjects.map((p) =>
          p.projectId === updatedProject.projectId ? updatedProject : p
        )
      );
    },
  });
}
