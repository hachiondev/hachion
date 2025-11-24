import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchCoursesSummary = createAsyncThunk(
  "courses/fetchCoursesSummary",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/courses/summary");
      const rawCourses = res.data || [];

      const formattedCourses = rawCourses.map((row) => ({
        id: row[0],
        courseName: row[1],
        courseImage: row[2],
        numberOfClasses: row[3],
        level: row[4],
        amount: row[5],
        discount: row[6],
        total: row[7],
        iamount: row[8],
        idiscount: row[9],
        itotal: row[10],
        category_name: row[11],
      }));

      return formattedCourses;
    } catch (err) {
      return rejectWithValue("Failed to fetch course summaries");
    }
  }
);

const coursesSummarySlice = createSlice({
  name: "courses",
  initialState: { summary: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoursesSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCoursesSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchCoursesSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default coursesSummarySlice.reducer;