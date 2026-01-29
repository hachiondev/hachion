// src/queries/installmentQueries.js
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const checkInstallmentStatus = async (email, courseId) => {
  const response = await axios.get('https://api.test.hachion.co/api/v1/installment/status', {
    params: { email, courseId }
  });
  return response.data;
};

export const useInstallmentStatus = (email, courseId) => {
  return useQuery({
    queryKey: ['installmentStatus', email, courseId],
    queryFn: () => checkInstallmentStatus(email, courseId),
    enabled: !!email && !!courseId,
    refetchOnWindowFocus: true,
    staleTime: 0, // Always fetch fresh data
  });
};