import { useQuery } from "@tanstack/react-query";
import { getUserCountry } from "../../../../Components/UserPanel/HomePage/TrendingSection/services/geoService";
import { getFxRates } from "../../../../Components/UserPanel/HomePage/TrendingSection/services/currencyService";

const countryToCurrencyMap = {
  IN: "INR", US: "USD", GB: "GBP", AU: "AUD", CA: "CAD", AE: "AED",
  JP: "JPY", EU: "EUR", TH: "THB", DE: "EUR", FR: "EUR", QA: "QAR",
  CN: "CNY", RU: "RUB", KR: "KRW", BR: "BRL", MX: "MXN", ZA: "ZAR", NL: "EUR"
};

export const useGeoData = () =>
  useQuery({
    queryKey: ["geo"],
    queryFn: async () => {
      const country = await getUserCountry();
      const currency = countryToCurrencyMap[country] || "USD";
      const rates = await getFxRates();
      return {
        country,
        currency,
        fxFromUSD: (rates && rates[currency]) || 1,
      };
    },
    staleTime: 1000 * 60 * 5, // cache 5 minutes
    gcTime: Infinity, // ✅ Cache never gets garbage collected (formerly cacheTime)
    refetchOnWindowFocus: false, // ✅ Don't refetch when user returns to tab
    refetchOnMount: false, // ✅ Don't refetch on component remount
    refetchOnReconnect: false, // ✅ Don't refetch when internet reconnects
    retry: 1, // ✅ Only retry once if it fails
  });

