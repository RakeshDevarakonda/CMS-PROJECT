import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataCount: {},
  statusCounts: [],

  trendData: [],
};

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    setDataCount: (state, action) => {
     
      state.dataCount = action.payload;
    },
    setStatusCounts: (state, action) => {
      state.statusCounts = action.payload;
    },


    setTrendData: (state, action) => {
      state.trendData = action.payload;
    },

  },
});

export const adminDashboardReducer = adminDashboardSlice.reducer;

export const {
  setDataCount,
  setStatusCounts,
  setTrendData,
} = adminDashboardSlice.actions;

export const adminDashboardSelector = (state) => state.adminDashboardReducer;
