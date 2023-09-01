import { configureStore } from "@reduxjs/toolkit";
import signInSlice from "../containers/SignIn/signInSlice"; // Correct the file path

export default configureStore({
  reducer: {
    phoneNumber: signInSlice,
  },
});
