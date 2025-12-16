
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = "https://api.test.hachion.co";

export function useCreateRazorpayOrder(amount) {
  return useQuery({
    queryKey: ["createRazorpayOrder", amount],
    queryFn: async () => {
      if (!amount || amount <= 0) {
        throw new Error("Invalid amount for Razorpay order");
      }

      const res = await axios.post(
        `${API_BASE}/razorpay/create-razorpay-order`,
        null,
        { params: { amount } }
      );

      return res.data; 
    },
    enabled: false,              
    retry: false,
    refetchOnWindowFocus: false, 
    refetchOnReconnect: false,  
  });
}

export function useCreatePaypalOrder({ amount, returnUrl }) {
  return useQuery({
    queryKey: ["createPaypalOrder", { amount, returnUrl }],
    queryFn: async () => {
      if (!amount || amount <= 0) {
        throw new Error("Invalid amount for PayPal order");
      }

      const res = await axios.post(`${API_BASE}/create-order`, null, {
        params: { amount, returnUrl },
      });

      return res.data;
    },
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
