import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GEO_URL = "https://ipinfo.io?token=9da91c409ab4b2";
const RATES_URL = "https://api.exchangerate-api.com/v4/latest/USD";

const currencyMap = {
  IN: "INR",
  US: "USD",
  GB: "GBP",
  AU: "AUD",
  CA: "CAD",
  AE: "AED",
  JP: "JPY",
  EU: "EUR",
  TH: "THB",
  DE: "EUR",
  FR: "EUR",
  QA: "QAR",
  CN: "CNY",
  RU: "RUB",
  KR: "KRW",
  BR: "BRL",
  MX: "MXN",
  ZA: "ZAR",
  NL: "EUR",
};

const fetchUserCurrency = async () => {
  const res = await axios.get(GEO_URL);
  const countryCode = res.data?.country?.toUpperCase() || "US";
  return currencyMap[countryCode] || "USD";
};

const fetchExchangeRates = async () => {
  const cached = localStorage.getItem("exchangeRates");
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      localStorage.removeItem("exchangeRates");
    }
  }

  const res = await axios.get(RATES_URL);
  const rates = res.data?.rates || {};
  localStorage.setItem("exchangeRates", JSON.stringify(rates));
  return rates;
};

export function useCurrency() {
  const { data: currency = "USD" } = useQuery({
    queryKey: ["userCurrency"],
    queryFn: fetchUserCurrency,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const { data: rates } = useQuery({
    queryKey: ["exchangeRates"],
    queryFn: fetchExchangeRates,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const exchangeRate =
    currency === "USD" ? 1 : rates?.[currency] || 1;

  return { currency, exchangeRate };
}
