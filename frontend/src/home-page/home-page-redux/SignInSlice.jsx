import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    email: "",
    password: "",
  },
  errors: {
    email: "",
    password: "",
  },
  showPassword: false,
  isSignInSubmitting: false,
};

const signInSlice = createSlice({
  name: "signin",
  initialState: initialState,
  reducers: {
    setSignInFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setSignInErrors: (state, action) => {
      state.errors = { ...state.errors, ...action.payload };
    },
    setSignInResetForm: (state) => {
      state.formData = initialState.formData;
      state.errors = initialState.errors;
    },
    setShowPassword: (state) => {
      state.showPassword = !state.showPassword;
    },


    setIsSignInSubmitting: (state) => {
      state.isSignInSubmitting = !state.isSignInSubmitting;
    },
  },
});

export const signInSliceReducer = signInSlice.reducer;

export const {
  setSignInFormData,
  setSignInErrors,
  setSignInResetForm,
  setShowPassword,
  setIsSignInSubmitting,

} = signInSlice.actions;

export const signInSliceSelector = (state) => state.signInSliceReducer;
