import { createSlice } from "@reduxjs/toolkit";

export const facebookSlice = createSlice({
  name: "facebookLogin",
  initialState: {
    value: {},
  },
  reducers: {
    loginFacebook: (state, action) => {
      return { ...state, value: { ...action.payload } }; // Assuming action.payload contains the Facebook login data
    },
    logoutFacebook: () => {
      return {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { loginFacebook, logoutFacebook } = facebookSlice.actions;

export default facebookSlice.reducer;
