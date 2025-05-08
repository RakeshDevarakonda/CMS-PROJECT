import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataCount: {},
  statusCounts: [],
  articles: [],
  lastfivedatsstats: null,
  trendData: [],
};

const creatorDashboardSlice = createSlice({
  name: "creatorDashboard",
  initialState,
  reducers: {
    setDataCount: (state, action) => {
      console.log("Setting dataCount:", action.payload);
      state.dataCount = action.payload;
    },
    setStatusCounts: (state, action) => {
      state.statusCounts = action.payload;
    },

    setArticles: (state, action) => {
      state.articles = action.payload;
    },

    setTrendData: (state, action) => {
      state.trendData = action.payload;
    },

    setlastfivedatsstats: (state, action) => {
      state.lastfivedatsstats = action.payload;
    },
  },
});

export const creatorDashboardReducer = creatorDashboardSlice.reducer;

export const {
  setDataCount,
  setStatusCounts,
  setArticles,
  setlastfivedatsstats,
  setTrendData,
} = creatorDashboardSlice.actions;

export const creatorDashboardSelector = (state) => state.creatorDashboardReducer;
