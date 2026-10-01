import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/apiBase";

export function useCouponDiscount({ couponCode, enabled }) {
  return useQuery({
    queryKey: ["couponDiscount", couponCode],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/coupon-code/discount/${couponCode}`);
      const data = await res.json();
      return data;
    },
    enabled: enabled && !!couponCode,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
