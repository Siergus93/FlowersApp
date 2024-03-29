import { configureStore } from '@reduxjs/toolkit';
import flowerReducer from './flowersSlice';

export const store = configureStore({
  reducer: {
    flower: flowerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
