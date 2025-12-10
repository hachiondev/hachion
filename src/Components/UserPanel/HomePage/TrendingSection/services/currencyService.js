import axios from "axios";

const FX_CACHE_KEY = "fxRatesUSD";
const FX_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export const getFxRates = async () => {
  try {
    const cached = JSON.parse(localStorage.getItem(FX_CACHE_KEY) || "null");
    const fresh = cached && (Date.now() - cached.t) < FX_TTL_MS;
    if (fresh && cached.rates) return cached.rates;

    const { data } = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
    const rates = data?.rates || {};
    localStorage.setItem(FX_CACHE_KEY, JSON.stringify({ t: Date.now(), rates }));
    return rates;
  } catch (e) {
    console.error("currencyService.getFxRates failed", e);
    return {};
  }
};
