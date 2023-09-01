import { createSlice } from "@reduxjs/toolkit";

export const signInSlice = createSlice({
  name: "phoneNumber",
  initialState: {
    value: "", // Initialize with an empty string
  },
  reducers: {
    logout: (state) => {
      state.value = "";
    },
    login: (state, action) => {
      // Receive the action as a parameter
      state.value = action.payload; // Set value to the action payload (userPhoneNumber)
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = signInSlice.actions;

export default signInSlice.reducer;
