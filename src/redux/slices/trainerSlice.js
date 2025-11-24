import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchTrainers = createAsyncThunk(
  "trainers/fetchTrainers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/trainers");
      return res.data || [];
    } catch (err) {
      return rejectWithValue("Failed to load trainers");
    }
  }
);

const trainerSlice = createSlice({
  name: "trainers",
  initialState: {
    trainers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrainers.fulfilled, (state, action) => {
        state.loading = false;
        state.trainers = action.payload;
      })
      .addCase(fetchTrainers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default trainerSlice.reducer;
