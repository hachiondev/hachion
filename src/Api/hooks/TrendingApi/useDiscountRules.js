import { useQuery } from "@tanstack/react-query";
import { getDiscountRules } from "../../../Components/UserPanel/TrendingSection/services/discountsService";

export const useDiscountRules = () =>
  useQuery({
    queryKey: ["discount-rules"],
    queryFn: getDiscountRules,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
