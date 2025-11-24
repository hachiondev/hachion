import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { fetchCoursesSummary } from "./coursesSummarySlice";

// Thunk to fetch trending courses
export const fetchTrending = createAsyncThunk(
  "trending/fetchTrending",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      // ✅ STEP 1: Get cached course summary from Redux
      let allCourses = getState().coursesSummary.summary;

      // ✅ STEP 2: Fetch course summary ONLY if not available
      if (!allCourses.length) {
        const res = await dispatch(fetchCoursesSummary()).unwrap();
        allCourses = res;
      }

      // ✅ STEP 3: Fetch trending events list
      const trendingRes = await api.get("/trendingcourse");
      const trendingData = trendingRes.data || [];

      // ✅ STEP 4: Filter active trending courses
      const activeTrending = trendingData.filter((course) => course.status);

      // ✅ STEP 5: Return merged payload
      return { activeTrending, allCourses };
    } catch (err) {
      return rejectWithValue("Failed to load trending courses");
    }
  }
);

const trendingSlice = createSlice({
  name: "trending",
  initialState: {
    trendingCourses: [],
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrending.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.loading = false;
        const { activeTrending, allCourses } = action.payload;

        // ✅ Merge trending data with full course details
        const merged = activeTrending.map((trend) => {
          const courseDetails = allCourses.find(
            (c) => c.courseName === trend.course_name
          );
          return { ...trend, ...courseDetails };
        });

        state.trendingCourses = merged;

        // ✅ Generate unique categories
        state.categories = [
          "All",
          ...new Set(merged.map((c) => c.category_name)),
        ];
      })
      .addCase(fetchTrending.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default trendingSlice.reducer;