
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const checkInstallmentStatus = async (studentId, courseName) => {
  const response = await axios.get(
    "https://api.test.hachion.co/razorpay/checkInstallment",
    {
      params: { studentId, courseName },
    }
  );
  return response.data;
};

export const useInstallmentStatus = (studentId, courseName) => {
  return useQuery({
    queryKey: ["installmentStatus", studentId, courseName],
    queryFn: () => checkInstallmentStatus(studentId, courseName),
    enabled: !!studentId && !!courseName, 
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};
