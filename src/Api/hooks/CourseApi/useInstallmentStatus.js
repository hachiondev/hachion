import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/lib/apiBase";

const checkInstallmentStatus = async (studentId, courseName, batchId) => {
  const response = await axios.get(`${API_BASE_URL}/razorpay/checkInstallment`, {
    params: { studentId, courseName, batchId },
  });
  return response.data;
};

export const useInstallmentStatus = (studentId, courseName, batchId) => {
  return useQuery({
    queryKey: ["installmentStatus", studentId, courseName, batchId],
    queryFn: () => checkInstallmentStatus(studentId, courseName, batchId),
    enabled: !!studentId && !!courseName && !!batchId,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};
