import { useQuery } from "@tanstack/react-query";
import { getDiscountRules } from "../../../../src/Components/UserPanel/HomePage/TrendingSection/services/discountsService";

export const useDiscountRules = () =>
  useQuery({
    queryKey: ["discount-rules"],
    queryFn: getDiscountRules,
    retry:1,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
