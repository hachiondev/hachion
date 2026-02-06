
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const checkInstallmentStatus = async (studentId, courseName, batchId) => {
  const response = await axios.get(
    "https://api.test.hachion.co/razorpay/checkInstallment",
    {
      params: { studentId, courseName, batchId },
    }
  );
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

