import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchDiscountRules = createAsyncThunk(
  "discounts/fetchDiscountRules",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/discounts-courses");
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return rejectWithValue("Failed to load discount rules");
    }
  }
);

const discountSlice = createSlice({
  name: "discounts",
  initialState: {
    rules: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscountRules.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDiscountRules.fulfilled, (state, action) => {
        state.loading = false;
        state.rules = action.payload;
      })
      .addCase(fetchDiscountRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default discountSlice.reducer;
