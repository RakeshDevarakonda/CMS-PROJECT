// formSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signUpFormData: {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  signUpFormDataErrors: {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  showPassword: false,
  showConfirmPassword: false,

  isSignUpSubmitting: false,
};

const signUpFormDataSlice = createSlice({
  name: "signupformdata",
  initialState,
  reducers: {
    setSignUpFormData: (state, action) => {
      state.signUpFormData = { ...state.signUpFormData, ...action.payload };
    },
   
    setSignUpFormDataErrors: (state, action) => {
      state.signUpFormDataErrors = {
        ...state.signUpFormDataErrors,
        ...action.payload,
      };
    },
    setResetForm: (state) => {
      state.signUpFormData = initialState.signUpFormData;
      state.signUpFormDataErrors = initialState.signUpFormDataErrors;
    },
    setShowPassword: (state) => {
      state.showPassword = !state.showPassword;
    },
    setShowConfirmPassword: (state) => {
      state.showConfirmPassword = !state.showConfirmPassword;
    },



    setSignUpSubmitting: (state) => {
      state.isSignUpSubmitting = !state.isSignUpSubmitting;
    },
  },
});

export const signUpFormDataReducer = signUpFormDataSlice.reducer;

export const {
  setSignUpSubmitting,
  setShowPassword,
  setShowConfirmPassword,
  setSignUpFormData,
  setSignUpFormDataErrors,
  setResetForm,

} = signUpFormDataSlice.actions;

export const signUpFormDataSelector = (state) => state.signUpFormDataReducer;
