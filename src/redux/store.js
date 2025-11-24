import { configureStore } from "@reduxjs/toolkit";
import trendingReducer from "./slices/trendingSlice";
import discountReducer from "./slices/discountSlice";
import currencyReducer from "./slices/currencySlice";
import teensReducer from "./slices/teensSlice";
import trainerReducer from "./slices/trainerSlice";
import coursesSummaryReducer from "./slices/coursesSummarySlice";

const store = configureStore({
  reducer: {
    trending: trendingReducer,
    teens: teensReducer,
    discounts: discountReducer,
    currency: currencyReducer,
    trainers: trainerReducer,
    coursesSummary: coursesSummaryReducer,
  },
});

export default store;
