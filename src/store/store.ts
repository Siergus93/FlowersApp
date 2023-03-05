import { configureStore } from '@reduxjs/toolkit';
import flowerReducer from '../slices/flowersSlice';

export const store = configureStore({
  reducer: {
    flower: flowerReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
