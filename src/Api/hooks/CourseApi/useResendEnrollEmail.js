import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = "https://api.test.hachion.co";

export function useResendEnrollEmail() {
  return useMutation({
    mutationFn: async ({ email, batchId }) => {
      const res = await axios.post(`${API_BASE}/enroll/resend-email-by-session`, {
        email: email,
        batchId: batchId,
      });
      return res.data;
    },
  });
}
