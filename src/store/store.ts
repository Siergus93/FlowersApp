import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../slices/counterSlice';
import flowerReducer from '../slices/flowersSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        flower: flowerReducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch