import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const countryToCurrencyMap = {
  IN: "INR", US: "USD", GB: "GBP", AU: "AUD", CA: "CAD", AE: "AED", JP: "JPY",
  EU: "EUR", TH: "THB", DE: "EUR", FR: "EUR", QA: "QAR", CN: "CNY", RU: "RUB",
  KR: "KRW", BR: "BRL", MX: "MXN", ZA: "ZAR", NL: "EUR",
};

export const fetchGeoAndRates = createAsyncThunk(
  "currency/fetchGeoAndRates",
  async (_, { rejectWithValue }) => {
    try {
      // 1) Detect Country
      const geo = await axios.get("https://ipinfo.io/json?token=82aafc3ab8d25b");
      const country = geo?.data?.country || "US";

      // 2) Country → Currency
      const currency = countryToCurrencyMap[country] || "USD";

      // 3) If India or USA → no conversion
      if (country === "IN" || country === "US") {
        return { country, currency, fxFromUSD: 1 };
      }

      // 4) Try cached exchange rates
      const cached = JSON.parse(localStorage.getItem("fxRatesUSD") || "null");
      const fresh = cached && (Date.now() - cached.t < 6 * 60 * 60 * 1000);

      let rates = cached?.rates;

      // 5) If no cache or stale → fetch live FX rate
      if (!fresh) {
        const fxRes = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
        rates = fxRes.data.rates;

        // cache for 6 hours
        localStorage.setItem(
          "fxRatesUSD",
          JSON.stringify({ t: Date.now(), rates })
        );
      }

      return {
        country,
        currency,
        fxFromUSD: rates?.[currency] ?? 1,
      };
    } catch (err) {
      console.error("Geo/FX Failed:", err);
      return rejectWithValue("Geo / FX fetch failed");
    }
  }
);

const currencySlice = createSlice({
  name: "currency",
  initialState: {
    country: "US",
    currency: "USD",
    fxFromUSD: 1,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeoAndRates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGeoAndRates.fulfilled, (state, action) => {
        state.loading = false;
        state.country = action.payload.country;
        state.currency = action.payload.currency;
        state.fxFromUSD = action.payload.fxFromUSD;
      })
      .addCase(fetchGeoAndRates.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default currencySlice.reducer;
