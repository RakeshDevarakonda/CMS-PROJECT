import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  content: "",
  tagInput: "",
  tags: [],
  cloudurl: [],
  publishPost: false,
  draftPost: false,
  isPostSubmiting: false,
  inputType: "",
  imageUrl: null,
  urlPreview: null,
  urlError: null,
  preview: null,
  isDragging: false,
  uploadStatus: null,
  errorMessage: null,
  isUploading: false,
};

const createPostSlice = createSlice({
  name: "createPost",
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setContent: (state, action) => {
      state.content = action.payload;
    },
    setTagInput: (state, action) => {
      state.tagInput = action.payload;
    },
    setTags: (state, action) => {
      state.tags = action.payload;
    },
    setCloudurl: (state, action) => {
      state.cloudurl = action.payload;
    },
    setPublishPost: (state) => {
      state.publishPost = !state.publishPost;
    },
    setDraftPost: (state) => {
      state.draftPost = !state.draftPost;
    },
    setPostSubmiting: (state) => {
      state.isPostSubmiting = !state.isPostSubmiting;
    },

    setInputType: (state, action) => {
      state.inputType = action.payload; // ✅ CORRECT
    },
    

    setImageUrl: (state, action) => {
      state.imageUrl = action.payload;
    },

    setUrlPreview: (state, action) => {
      state.urlPreview = action.payload;
    },
    setUrlError: (state, action) => {
      state.urlError = action.payload;
    },
    setPreview: (state, action) => {
      state.preview = action.payload;
    },

    setIsDragging: (state, action) => {
      state.isDragging = action.payload;
    },

    setIsUploading: (state, action) => {
      state.isUploading = action.payload;
    },
    setUploadStatus: (state, action) => {
      state.uploadStatus = action.payload;
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    setResetPost: (state) => {
      state.title = "";
      state.content = "";
      state.tagInput = "";
      state.tags = [];
      state.cloudurl = [];
      state.publishPost = false;
      state.draftPost = false;
      state.errorAndSuccesDialog = false;
      state.errorAndSuccesDialogMessage = null;
    },
  },
});

export const createPostReducer = createPostSlice.reducer;

export const {
  setErrorMessage,
  setUploadStatus,
  setIsUploading,
  setIsDragging,
  setUrlError,
  setPreview,
  setUrlPreview,
  setImageUrl,
  setPostSubmiting,
  setInputType,
  setResetPost,
  setTitle,
  setContent,
  setTagInput,
  setTags,
  setCloudurl,
  setPublishPost,
  setDraftPost,
} = createPostSlice.actions;

export const createPostSelector = (state) => state.createPostReducer;
