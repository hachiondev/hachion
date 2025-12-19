import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useRequestBatchForCourse() {
  return useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post(
        "https://api.test.hachion.co/requestbatch/course/add",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    },
  });
}
