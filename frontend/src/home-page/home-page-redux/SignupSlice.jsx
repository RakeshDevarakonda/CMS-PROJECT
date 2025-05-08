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
    role: "",
  },
  showPassword: false,
  selectedRole: "Select Role",
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
      state.selectedRole = initialState.selectedRole;

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

    setSelectedRole: (state, action) => {
      state.selectedRole = action.payload;
    },
  },
});

export const signUpFormDataReducer = signUpFormDataSlice.reducer;

export const {
  setSelectedRole,
  setSignUpSubmitting,
  setShowPassword,
  setShowConfirmPassword,
  setSignUpFormData,
  setSignUpFormDataErrors,
  setResetForm,
} = signUpFormDataSlice.actions;

export const signUpFormDataSelector = (state) => state.signUpFormDataReducer;
