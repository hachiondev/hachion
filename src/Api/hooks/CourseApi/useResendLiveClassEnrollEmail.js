import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/lib/apiBase";

const API_BASE = `${API_BASE_URL}`;

export function useResendLiveClassEnrollEmail() {
  return useMutation({
    mutationFn: async ({ email, batchId }) => {
      const res = await axios.post(`${API_BASE}/enroll/resend-email-for-live`, { email, batchId });
      return res.data;
    },
  });
}
