import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profileData: {
    name:"",
    email:"",
    avatar:"",
    role:"",
    mobileNumber :"",
    isActive:null
  },
  passwordVisible: {
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  },
  allpasswords: {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  },

  preveiwImageUrl: null,
  isSubmitting: false,
  isEditing: false,

};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profileData = action.payload;
    },
    updateProfile: (state, action) => {
      state.profileData = { ...state.profileData, ...action.payload };
    },

    toggleEditing: (state) => {
      state.isEditing = !state.isEditing;
    },
    resetProfile: (state) => {
      return initialState;
    },
    updatePasswords: (state, action) => {
      state.allpasswords = { ...state.allpasswords, ...action.payload };
    },
    togglePasswordVisibility(state, action) {
      const { field } = action.payload;
      state.passwordVisible[field] = !state.passwordVisible[field];
    },

    previewImage: (state, action) => {
      state.preveiwImageUrl = action.payload;
    },
    submittingData: (state) => {
      state.isSubmitting = !state.isSubmitting;
    },
   
  },
});
export const profileReducer = profileSlice.reducer;
export const {
  updateProfile,
  setProfile,
  toggleEditing,
  previewImage,
  resetProfile,
  togglePasswordVisibility,
  updatePasswords,
  submittingData,
} = profileSlice.actions;
export const profileSelector = (state) => state.profileReducer;
