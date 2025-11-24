import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchGeoAndRates = createAsyncThunk(
  "currency/fetchGeoAndRates",
  async (_, { rejectWithValue }) => {
    try {
      const geo = await axios.get("https://ipinfo.io/json?token=82aafc3ab8d25b");
      const country = geo?.data?.country || "US";

      const map = {
        IN: "INR", US: "USD", GB: "GBP", AU: "AUD", CA: "CAD", AE: "AED", JP: "JPY",
        EU: "EUR", TH: "THB", DE: "EUR", FR: "EUR", QA: "QAR", CN: "CNY", RU: "RUB",
        KR: "KRW", BR: "BRL", MX: "MXN", ZA: "ZAR", NL: "EUR",
      };

      const currency = map[country] || "USD";

      if (country === "IN" || country === "US") {
        return { country, currency, fxFromUSD: 1 };
      }

      const response = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
      return { country, currency, fxFromUSD: response.data.rates[currency] ?? 1 };

    } catch (err) {
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
