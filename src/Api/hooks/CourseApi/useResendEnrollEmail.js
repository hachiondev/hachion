import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/lib/apiBase";

const API_BASE = `${API_BASE_URL}`;

export function useResendEnrollEmail() {
  return useMutation({
    mutationFn: async ({ email, batchId }) => {
      const res = await axios.post(`${API_BASE}/enroll/resend-email-by-session`, { email, batchId });
      return res.data;
    },
  });
}
