import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./formSlice";

const store = configureStore({
  reducer: {
    forms: formReducer,
  },
});

export default store;
