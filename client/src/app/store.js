import { configureStore } from "@reduxjs/toolkit";
import signInSlice from "../containers/SignIn/signInSlice";
import facebookSlice from "../components/FacebookLogin/facebookSlice";

export default configureStore({
  reducer: {
    phoneNumber: signInSlice,
    facebookLogin: facebookSlice,
  },
});
