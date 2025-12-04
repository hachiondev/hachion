import { useQuery } from "@tanstack/react-query";
import { getUserCountry } from "../../../Components/UserPanel/TrendingSection/services/geoService";
import { getFxRates } from "../../../Components/UserPanel/TrendingSection/services/currencyService";

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
    staleTime: 1000 * 60 * 60, // 1 hour
  });

