import { useQuery } from "@tanstack/react-query";

export function useCouponDiscount({ couponCode, enabled }) {
  return useQuery({
    queryKey: ["couponDiscount", couponCode],
    queryFn: async () => {
      const res = await fetch(
        `https://api.test.hachion.co/coupon-code/discount/${couponCode}`
      );
      const data = await res.json();
      return data;
    },
    enabled: enabled && !!couponCode,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
