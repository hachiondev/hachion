import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/lib/apiBase";

const fetchAllStudents = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/v1/user/students`);
  return response.data;
};

const getStudentByEmail = async (email) => {
  const allStudents = await fetchAllStudents();
  const matchedStudent = allStudents.find((student) => student.email === email);
  return matchedStudent || null;
};

export const useStudentDetails = (email) => {
  return useQuery({
    queryKey: ["studentDetails", email],
    queryFn: () => getStudentByEmail(email),
    enabled: !!email,
    staleTime: 5 * 60 * 1000,
  });
};
