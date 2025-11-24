import { configureStore } from '@reduxjs/toolkit';
import coursesReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    courses: coursesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
