import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { fetchCoursesSummary } from "./coursesSummarySlice";

export const fetchSummerEvents = createAsyncThunk(
  "summer/fetchSummerEvents",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      // ✅ STEP 1: Get cached course summary from Redux
      let allCourses = getState().coursesSummary.summary;

      // ✅ STEP 2: Fetch summary only if not already loaded
      if (!allCourses.length) {
        const res = await dispatch(fetchCoursesSummary()).unwrap();
        allCourses = res;
      }

      // ✅ STEP 3: Fetch summer events list
      const summerRes = await api.get("/summerevents");
      const summerData = summerRes.data || [];

      // ✅ STEP 4: Filter only active events
      const activeEvents = summerData.filter((event) => event.status);

      // ✅ STEP 5: Return data for reducer
      return { activeEvents, allCourses };
    } catch (err) {
      return rejectWithValue("Failed to load summer events");
    }
  }
);

const teensSlice = createSlice({
  name: "teens",
  initialState: {
    summerEvents: [],
    categories: [],
    loading: false,
    loaded: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummerEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSummerEvents.fulfilled, (state, action) => {
        state.loading = false;

        const { activeEvents, allCourses } = action.payload;

        // ✅ Merge summer event data with course summary
        const merged = activeEvents.map((event) => {
          const courseDetails = allCourses.find(
            (c) => c.courseName === event.course_name
          );
          return { ...event, ...courseDetails };
        });

        state.summerEvents = merged;

        // ✅ Extract unique categories
        state.categories = [
          "All",
          ...new Set(merged.map((c) => c.category_name)),
        ];
      })
      .addCase(fetchSummerEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.loaded = true;
      });
  },
});

export default teensSlice.reducer;