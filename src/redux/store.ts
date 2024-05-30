import { configureStore } from "@reduxjs/toolkit";
import sliceReducer from "./todoSlice";

const store = configureStore({
  reducer: {
    todos: sliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
