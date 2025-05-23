import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: true,
  errorAndSuccesDialog: false,
  errorAndSuccesDialogMessage: "",
  isUserLogged: false,
  userDetails: null,
  isAuthChecked: false,
  isUserLoggedout: false,
  showBackdrop: false,
};

const globalReduxSlice = createSlice({
  name: "globalredux",
  initialState: initialState,
  reducers: {
    setIsUserLogged: (state, action) => {
      state.isUserLogged = action.payload;
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    setUserLogout: (state) => {
      state.isUserLogged = false;
      state.userDetails = null;
      state.isAuthChecked = false;
    },
    setAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    },
    setJustLoggedOut: (state, action) => {
      state.isUserLoggedout = action.payload;
    },
    toggleDarkMode: (state, action) => {
      state.darkMode =
        typeof action.payload === "boolean" ? action.payload : !state.darkMode;

      localStorage.setItem("darkMode", JSON.stringify(state.darkMode));
    },
    toggleErrorAndSuccesDialog: (state, action) => {
      if (typeof action.payload === "boolean") {
        state.errorAndSuccesDialog = action.payload;
      } else {
        state.errorAndSuccesDialog = !state.errorAndSuccesDialog;
      }
    },

    toggleBackdrop: (state) => {
      state.showBackdrop = !state.showBackdrop;
    },

    setErrorAndSuccesDialogMessage: (state, action) => {
      state.errorAndSuccesDialogMessage = action.payload;
    },
  },
});

export const globalReduxReducer = globalReduxSlice.reducer;

export const {
  setIsUserLogged,
  toggleBackdrop,
  setUserDetails,
  setUserLogout,
  setAuthChecked,
  setJustLoggedOut,
  toggleDarkMode,
  toggleErrorAndSuccesDialog,
  setErrorAndSuccesDialogMessage,
} = globalReduxSlice.actions;

export const globalReduxSelector = (state) => state.globalReduxReducer;
