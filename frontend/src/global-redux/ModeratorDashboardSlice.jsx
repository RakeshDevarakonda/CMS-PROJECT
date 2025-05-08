import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataCount: {},
  statusCounts: [],
  lastfivedatsstats: null,
  trendData: [],
};

const moderatorDashboardSlice = createSlice({
  name: "moderatorDashboard",
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

    setlastfivedatsstats: (state, action) => {
      state.lastfivedatsstats = action.payload;
    },
  },
});

export const moderatorDashboardReducer = moderatorDashboardSlice.reducer;

export const {
  setlastfivedatsstats,
  setDataCount,
  setStatusCounts,
  setTrendData,
} = moderatorDashboardSlice.actions;

export const moderatorDashboardSelector = (state) =>
  state.moderatorDashboardReducer;
