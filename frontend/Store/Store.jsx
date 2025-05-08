import { configureStore } from "@reduxjs/toolkit";
import { menuBarReducer } from "../src/home-page/home-page-redux/NavbarSlice";
import { signUpFormDataReducer } from "../src/home-page/home-page-redux/SignupSlice";
import { signInSliceReducer } from "../src/home-page/home-page-redux/SignInSlice";
import { globalReduxReducer } from "../src/global-redux/GlobalRedux";
import { createPostReducer } from "./../src/global-redux/CreatePostsSlice";
import { manageContentReducer } from "../src/global-redux/ManageContentSlice";
import { profileReducer } from "../src/global-redux/profileManagementSlice";
import { creatorDashboardReducer } from "../src/global-redux/CreatorDashBoardslice";
import { adminDashboardReducer } from "../src/global-redux/AdminDashboardSlice";
import { moderatorDashboardReducer } from "../src/global-redux/ModeratorDashboardSlice";

const reducer = {
  menuBarReducer,
  createPostReducer,
  manageContentReducer,
  signUpFormDataReducer,
  signInSliceReducer,
  globalReduxReducer,
  profileReducer,
  creatorDashboardReducer,
  adminDashboardReducer,
  moderatorDashboardReducer,
};

export const store = configureStore({
  reducer: reducer,
});
