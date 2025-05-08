import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contentCurrentPageNumber: 0,
  contentRowsPerPage: 5,
  contentFilteredData: [],
  contentSearchQuery: "",
  finalSearchterm: "",
  contentStatusFilter: "All",
  contentDateFilter: "All",
  contentCustomStartDate: "",
  contentCustomEndDate: "",
  contentOpenDateDialog: false,
  contentShowFilter: true,
  contentSelectedOpportunity: null,
  contentPostDetailsDialog: false,
  contentTotalData: [],
  contentDataCount: 0,
  finalStartDate: null,
  finalEndDate: null,
  sortOrder: "desc",
  contentDeleteId: null,
  moderatorStatusFilter: "",
  isDeleting: false,
  moderatorPostStatusChange: {
    id: null,
    status: null,
    source: null,
    version: null,
  },

  adminPostStatusChange: {
    id: null,
    status: null,
    source: null,
    version: null,
  },
  versionposts: null,
  versionList: {},
  manageUsersTotalData: {
    creator: [],
    moderator: [],
    admin: [],
  },
  selectedFilterType: "All Posts",

  contentSearchUsername: "",
  finalSearchUsername: "",
  isSearchModeratorName: "false",
  adminPostStatusDetails: {},
};

const manageContentSlice = createSlice({
  name: "manageContent",
  initialState,
  reducers: {
    setContentCurrentPageNumber: (state, action) => {
      state.contentCurrentPageNumber = action.payload;
    },
    setContentRowsPerPage: (state, action) => {
      state.contentRowsPerPage = action.payload;
    },
    setContentFilteredData: (state, action) => {
      state.contentFilteredData = action.payload;
    },
    setContentSearchQuery: (state, action) => {
      state.contentSearchQuery = action.payload;
    },
    setContentStatusFilter: (state, action) => {
      state.contentStatusFilter = action.payload;
    },
    setContentDateFilter: (state, action) => {
      state.contentDateFilter = action.payload;
    },
    setContentTotalData: (state, action) => {
      state.contentTotalData = action.payload;
    },
    setContentCustomStartDate: (state, action) => {
      state.contentCustomStartDate = action.payload;
    },
    setContentCustomEndDate: (state, action) => {
      state.contentCustomEndDate = action.payload;
    },
    setContentOpenDateDialog: (state, action) => {
      state.contentOpenDateDialog = action.payload;
    },
    setContentShowFilter: (state, action) => {
      state.contentShowFilter = action.payload;
    },
    setContentSelectedOpportunity: (state, action) => {
      state.contentSelectedOpportunity = action.payload;
    },

    togglePostDetailsDialog: (state) => {
      state.contentPostDetailsDialog = !state.contentPostDetailsDialog;
    },

    SetContentDeleteMessage: (state, action) => {
      state.errorAndSuccesDialogMessage = action.payload;
    },
    setContentDataCount: (state, action) => {
      state.contentDataCount = action.payload;
    },

    setFinalStartDates: (state, action) => {
      state.finalStartDate = action.payload;
    },
    setFinalEndDates: (state, action) => {
      state.finalEndDate = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },

    setContentDeleteId: (state, action) => {
      state.contentDeleteId = action.payload;
    },
    setModeratorStatusFilter: (state, action) => {
      state.moderatorStatusFilter = action.payload;
    },

    setFinalSearchterm: (state, action) => {
      state.finalSearchterm = action.payload;
    },

    setContentSearchUsername: (state, action) => {
      state.contentSearchUsername = action.payload;
    },

    setFinalSearchUsername: (state, action) => {
      state.finalSearchUsername = action.payload;
    },
    toggleDeleting: (state) => {
      state.isDeleting = !state.isDeleting;
    },

    setModeratorPostStatusChange: (state, action) => {
      state.moderatorPostStatusChange = {
        ...state.moderatorPostStatusChange,
        ...action.payload,
      };
    },
    setAdminPostStatusChange: (state, action) => {
      state.adminPostStatusChange = {
        ...state.adminPostStatusChange,
        ...action.payload,
      };
    },
    setVersionposts: (state, action) => {
      state.versionposts = action.payload;
    },
    setVersionList: (state, action) => {
      state.versionList = action.payload;
    },
    setManageUsersTotalData: (state, action) => {
      state.manageUsersTotalData = action.payload;
    },

    setSelectedFilterType: (state, action) => {
      state.selectedFilterType = action.payload;
    },

    toggleIsSearchModeratorName: (state, action) => {
      state.isSearchModeratorName = action.payload;
    },
    setAdminPostStatusDetails: (state, action) => {
      state.adminPostStatusDetails = action.payload;
    },
  },
});

export const manageContentReducer = manageContentSlice.reducer;

export const {
  setAdminPostStatusDetails,
  toggleIsSearchModeratorName,
  setFinalSearchUsername,
  setContentSearchUsername,
  setSelectedFilterType,
  setManageUsersTotalData,
  setAdminPostStatusChange,
  setVersionList,
  setModeratorPostStatusChange,
  setVersionposts,
  toggleDeleting,
  setModeratorStatusFilter,
  setFinalSearchterm,
  togglePostDetailsDialog,
  setSortOrder,
  setContentCurrentPageNumber,
  setFinalStartDates,
  setFinalEndDates,
  setContentRowsPerPage,
  setContentFilteredData,
  setContentSearchQuery,
  setContentStatusFilter,
  setContentDateFilter,
  setContentCustomStartDate,
  setContentCustomEndDate,
  setContentOpenDateDialog,
  setContentShowFilter,
  setContentSelectedOpportunity,

  setContentTotalData,
  SetContentDeleteMessage,
  setContentDataCount,
  setContentDeleteId,
} = manageContentSlice.actions;

export const manageContentSelector = (state) => state.manageContentReducer;
