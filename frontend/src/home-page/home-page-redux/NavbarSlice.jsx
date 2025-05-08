import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerOpen: false,

};

const menuBarSlice = createSlice({
  name: "menuBar",
  initialState: initialState,
  reducers: {
    setDrawerToggle: (state) => {
      state.drawerOpen = !state.drawerOpen;
    },


  },
});



export const menuBarReducer = menuBarSlice.reducer;

export const {setDrawerToggle} = menuBarSlice.actions;

export const menuBarSelector = (state) => state.menuBarReducer;




