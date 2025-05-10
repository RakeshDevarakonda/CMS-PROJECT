import React, {
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from "react";
import JoditEditor from "jodit-react";
import { colors } from "../utils/Colors.jsx";
import CircularProgress from "@mui/material/CircularProgress";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  TextField,
  Divider,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import {
  Save as SaveIcon,
  Send as SendIcon,
  InfoOutlined as InfoOutlinedIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  setTitle,
  setContent,
  setTagInput,
  setTags,
  setCloudurl,
  createPostSelector,
  setPublishPost,
  setDraftPost,
  setResetPost,
  setPostSubmiting,
  setInputType,
  setImageUrl,
  setUrlPreview,
} from "../global-redux/CreatePostsSlice.jsx";
import { CreatePostMutation } from "../creator/creator-tanstack-mutations/CreatePostMutation.jsx";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSinglePostEditQuery } from "../creator/creator-tanstack-queries/SinglePostEditQuery.jsx";
import {
  globalReduxSelector,
  setErrorAndSuccesDialogMessage,
  toggleErrorAndSuccesDialog,
} from "../global-redux/GlobalRedux.jsx";
import { useUpdateMutation } from "../creator/creator-tanstack-mutations/UpdateCreatorPostMutaion.jsx";
import BackDropLoader from "../utils/BackDropLoader.jsx";
import { useQueryClient } from "@tanstack/react-query";
import {
  setVersionList,
  setVersionposts,
} from "../global-redux/ManageContentSlice.jsx";
import { createAdminPostMutation } from "../admin/admin-tanstack-mutations/CreateAdminPostMutation.jsx";
import { useAdminSinglePostEditQuery } from "../admin/admin-tanstack-queries/GetAdminSinglePost.jsx";
import { useUpdateAdminPost } from "../admin/admin-tanstack-mutations/UpdateAdminPost.jsx";
import ImageInputSelector from "./UploadThumbnail.jsx";

const alpha = (color, opacity) => {
  if (color.startsWith("rgb") && !color.startsWith("rgba")) {
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const [, r, g, b] = match;
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  }

  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return color;
};

const CreatePost = () => {
  const { darkMode, userDetails } = useSelector(globalReduxSelector);

  const [thumbnailFile, setThumbnailFile] = useState(null);

  const validateThumbnail = () => {
    if (inputType !== "url" && inputType !== "upload") {
      dispatch(
        setErrorAndSuccesDialogMessage({
          message: "Please select  your thumbnail (URL or Upload)",
          type: "Error",
          buttonname: "Try Again",
        })
      );
      dispatch(toggleErrorAndSuccesDialog());
      return false;
    }

    if (inputType === "url") {
      if (!imageUrl || imageUrl.trim().length === 0 || urlError) {
        dispatch(
          setErrorAndSuccesDialogMessage({
            message: urlError || "Please enter a valid image URL",
            type: "Error",
            buttonname: "Try Again",
          })
        );
        dispatch(toggleErrorAndSuccesDialog());
        return false;
      }
    }

    if (inputType === "upload" && !thumbnailFile && !errorMessage) {
      dispatch(
        setErrorAndSuccesDialogMessage({
          message: "Please select an image file to upload",
          type: "Error",
          buttonname: "Try Again",
        })
      );
      dispatch(toggleErrorAndSuccesDialog());
      return false;
    }

    return true; // All checks passed
  };

  const handleThmbnailImage = (e) => {
    setThumbnailFile(e);
  };

  const mode = darkMode ? "dark" : "light";
  const { editid } = useParams();

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const version = queryParams.get("version");

  const dispatch = useDispatch();
  const {
    title,
    content,
    tagInput,
    tags,
    cloudurl,
    publishPost,
    draftPost,
    isPostSubmiting,
    urlError,
    imageUrl,
    inputType,
    errorMessage,
  } = useSelector(createPostSelector);

  const colorScheme = colors[mode] || colors.light;
  const isMobile = useMediaQuery("(max-width:600px)");
  const editor = useRef(null);
  const createPostMutation = CreatePostMutation();
  const { mutate: createAdminPost } = createAdminPostMutation();
  const { mutate: updatePost } = useUpdateMutation();
  const { mutate: updateAdminPost } = useUpdateAdminPost();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  let isCreator = userDetails?.role === "creator";
  let isAdmin = userDetails?.role === "admin";

  const {
    data: creatorSinglePost,
    isLoading: isCreatorLoading,
    isError: isCreatorError,
    error: creatorError,
  } = useSinglePostEditQuery({ editid, version, isCreator });

  const {
    data: adminSinglePost,
    isLoading: isAdminLoading,
    isError: isAdminError,
    error: adminError,
  } = useAdminSinglePostEditQuery({ editid, version, isAdmin });

  const singlePost = isAdmin ? adminSinglePost : creatorSinglePost;

  const isLoading = isAdmin ? isAdminLoading : isCreatorLoading;

  const isError = isAdmin ? isAdminError : isCreatorError;
  const error = isAdmin ? adminError : creatorError;

  useEffect(() => {
    if (isError) {
      dispatch(
        setErrorAndSuccesDialogMessage({
          message: error.message,
          type: "Error",
          buttonname: "Try Again",
        })
      );

      dispatch(toggleErrorAndSuccesDialog());
      dispatch(setResetPost());
      dispatch(setVersionList({}));
      dispatch(setVersionposts({}));
      navigate(-1);
    } else if (editid && singlePost) {
      dispatch(setTitle(singlePost.title));
      dispatch(setContent(singlePost.content));
      dispatch(setTags(singlePost.tags));

      dispatch(setInputType("url"));
      dispatch(setImageUrl(singlePost.thumbnailImage));
      dispatch(setUrlPreview(singlePost.thumbnailImage));
    } else {
      dispatch(setResetPost());
    }
  }, [editid, singlePost, isError, navigate, dispatch]);

  useEffect(() => {
    if (mode !== "dark") return;

    const style = document.createElement("style");
    style.id = "jodit-dark-mode";
    style.innerHTML = `
      .jodit-container {
        background-color: ${colorScheme.paper} !important;
        color: ${colorScheme.text} !important;
        border-color: ${colorScheme.divider} !important;
      }
      .jodit-workplace, .jodit-wysiwyg {
        background-color: ${colorScheme.paper} !important;
        color: ${colorScheme.text} !important;
      }
      .jodit-toolbar__box {
        background-color: ${alpha(colorScheme.paper, 0.95)} !important;
        border-color: ${colorScheme.divider} !important;
        box-shadow: 0 1px 4px ${colorScheme.shadow} !important;
      }
      .jodit-toolbar-button, .jodit-toolbar-button__icon, .jodit-icon, .jodit-ui-button {
        color: ${colorScheme.text} !important;
        fill: ${colorScheme.text} !important;
      }
      .jodit-toolbar-button:hover {
        background-color: ${alpha(colorScheme.primary, 0.1)} !important;
      }

      .jodit-toolbar-button__button:hover {
        background-color: ${alpha(colorScheme.primary, 0.1)} !important;
      }

    .jodit-ui-search__box {
  background-color:  ${alpha(colorScheme.paper, 0.1)} !important;
}

.jodit-ui-group 

      .jodit-status-bar {
        background-color: ${alpha(colorScheme.paper, 0.95)} !important;
        color: ${colorScheme.textSecondary} !important;
        border-color: ${colorScheme.divider} !important;
      }
      .jodit-ui-group_line_true, .jodit-toolbar-button__trigger, 
      .jodit-ui-group, .jodit-dialog__header {
        border-color: ${colorScheme.divider} !important;
      }
      .jodit-toolbar-content {
        background-color: ${alpha(colorScheme.paper, 0.95)} !important;
      }
      .jodit-status-bar__item.jodit-status-bar__item_powered {
        display: none !important;
      }
      .jodit-dialog {
        background-color: ${colorScheme.paper} !important;
        color: ${colorScheme.text} !important;
        border-color: ${colorScheme.divider} !important;
        box-shadow: 0 5px 15px ${colorScheme.shadow} !important;
      }
      .jodit-filebrowser__files.active {
        background-color: ${alpha(colorScheme.primary, 0.1)} !important;
        color: ${colorScheme.text} !important;
      }
      .jodit-filebrowser__files-item {
        border-color: ${colorScheme.divider} !important;
      }

      .jodit-ui-input__input{
       background-color: ${colorScheme.background} !important;
        color: ${colorScheme.text} !important;
      }
      .jodit-filebrowser__files-item:hover {
        background-color: ${alpha(colorScheme.primary, 0.05)} !important;
      }
      .jodit-ui-input {
        background-color: ${colorScheme.background} !important;
        color: ${colorScheme.text} !important;
        border-color: ${colorScheme.divider} !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const styleElement = document.getElementById("jodit-dark-mode");
      if (styleElement) styleElement.remove();
    };
  }, [mode, colorScheme]);

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      toolbarAdaptive: false,
      height: 500,
      width: "100%",
      askBeforePasteHTML: false,
      pastePlainText: true,
      theme: mode === "dark" ? "dark" : "default",
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "eraser",
        "ul",
        "ol",
        "font",
        "fontsize",
        "paragraph",
        "lineHeight",
        "subscript",
        "superscript",
        "classSpan",
        "image",
        "video",
        "file",
        "speechRecognize",
        "paste",
        "selectall",
        "table",
        "hr",
        "link",
        "indent",
        "outdent",
        "left",
        "center",
        "right",
        "justify",
        "brush",
        "copyformat",
        "undo",
        "redo",
        "find",
        "source",
        "fullsize",
        "preview",
      ],
      uploader: {
        url: `${API_BASE_URL}/api/addurls`,
        filesVariableName: () => "file",

        prepareData: (formData) => {
          dispatch(setPostSubmiting());
          const files = formData.getAll("file");

          // Log files for debugging
          console.log("Files to upload:", files);

          for (const file of files) {
            if (file.size > 5 * 1024 * 1024) {
              // 5 MB
              dispatch(toggleErrorAndSuccesDialog());
              dispatch(
                setErrorAndSuccesDialogMessage({
                  message: "Fle Size Cannot Greater Than 5 Mb",
                  type: "Error",
                  buttonname: "Close",
                })
              );
              dispatch(setPostSubmiting());
              throw new Error("File size exceeds limit"); // Stops further execution
            }
          }

          return formData;
        },

        error: function (err) {
          console.error("Upload error:", err);
          dispatch(toggleErrorAndSuccesDialog());
          dispatch(
            setErrorAndSuccesDialogMessage({
              message: "Upload failed. Please try again.",
              type: "Error",
              buttonname: "Close",
            })
          );
          dispatch(setPostSubmiting());
          return false;
        },

        isSuccess: (resp) => {
          if (!resp?.urls) {
            dispatch(toggleErrorAndSuccesDialog());
            dispatch(
              setErrorAndSuccesDialogMessage({
                message: "Error while uploading image",
                type: "Error",
                buttonname: "Try Again",
              })
            );
            dispatch(setPostSubmiting());
            return false; 
          }

          // Update cloud URLs & localStorage
          dispatch(setCloudurl([...cloudurl, ...resp.urls]));
          const localstorageUrls =
            JSON.parse(localStorage.getItem("allurls")) || [];
          localStorage.setItem(
            "allurls",
            JSON.stringify([...localstorageUrls, ...resp.urls])
          );

          return resp;
        },

        process: (resp) => {
          if (!resp.urls) {
            throw new Error("Server did not return URLs");
          }
          return {
            files: resp.urls,
            path: resp.urls,
            baseurl: "",
            error: 0,
            msg: "Files uploaded successfully",
          };
        },

        defaultHandlerSuccess: function (data) {
          if (!data.files?.length) {
            console.warn("No files were uploaded");
            return false;
          }

          // Insert all images into the editor
          data.files.forEach((filename) => {
            const elm = this.createInside.element("img");
            elm.setAttribute("src", filename);
            this.s.insertImage(elm, null, this.o.imageDefaultWidth);
          });

          dispatch(setPostSubmiting());
          return true;
        },

      
      },
      style: {
        background: colorScheme.paper,
        color: colorScheme.text,
      },
      showPlaceholder: false,
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      statusbar: {
        allowResizeX: true,
        allowResizeY: true,
      },
    }),
    [mode, colorScheme, cloudurl, dispatch]
  );

  const addTag = useCallback(() => {
    const formattedTag = tagInput.trim().toLowerCase();

    if (!formattedTag) return;

    if (tags.includes(formattedTag)) {
      alert("Tag already exists");
      return;
    }

    dispatch(setTags([...tags, formattedTag]));
    dispatch(setTagInput(""));
  }, [tagInput, tags, dispatch]);

  const removeTag = useCallback(
    (indexToRemove) => {
      dispatch(setTags(tags.filter((_, index) => index !== indexToRemove)));
    },
    [tags, dispatch]
  );

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTag();
      }
    },
    [addTag]
  );

  const savePost = useCallback(
    async (status) => {
      if (editid && singlePost) {
        if (!title.trim()) {
          dispatch(toggleErrorAndSuccesDialog());
          dispatch(
            setErrorAndSuccesDialogMessage({
              message: "Please add a title for your post",
              type: "Error",
              buttonname: "Close",
            })
          );
          return;
        }

        if (!content.trim() || content === "<p><br></p>") {
          dispatch(toggleErrorAndSuccesDialog());
          dispatch(
            setErrorAndSuccesDialogMessage({
              message: "Please add some content to your post",
              type: "Error",
              buttonname: "Close",
            })
          );
          return;
        }

        if (!tags || tags.length === 0) {
          dispatch(toggleErrorAndSuccesDialog());
          dispatch(
            setErrorAndSuccesDialogMessage({
              message: "Please Add Atleast One Tag",
              type: "Error",
              buttonname: "Close",
            })
          );
          return;
        }

        const localurls = JSON.parse(localStorage.getItem("allurls")) || [];
        const allUrls = Array.from(new Set([...cloudurl, ...localurls]));
        const unusedUrls = allUrls.filter((url) => !content.includes(url));
        let FormDataSend = new FormData();

        FormDataSend.append("content", content);
        FormDataSend.append("tags", JSON.stringify(tags));
        FormDataSend.append("title", title);
        FormDataSend.append("status", status);
        FormDataSend.append("urls", JSON.stringify(unusedUrls));
        FormDataSend.append("id", singlePost._id);
        FormDataSend.append("thumbnailType", inputType);

        if (!validateThumbnail()) {
          return;
        }

        if (inputType === "url") {
          FormDataSend.append("thumbnailUrl", imageUrl);
        } else {
          FormDataSend.append("thumbnailFile", thumbnailFile);
        }

        dispatch(status === "pending" ? setPublishPost() : setDraftPost());
        dispatch(setPostSubmiting());
        if (isCreator) {
          updatePost(FormDataSend);
        } else {
          updateAdminPost(FormDataSend);
        }
      } else {
        if (!title.trim()) {
          dispatch(toggleErrorAndSuccesDialog());
          dispatch(
            setErrorAndSuccesDialogMessage({
              message: "Please add a title for your post",
              type: "Error",
              buttonname: "Close",
            })
          );
          return;
        }

        if (!content.trim() || content === "<p><br></p>") {
          dispatch(toggleErrorAndSuccesDialog());
          dispatch(
            setErrorAndSuccesDialogMessage({
              message: "Please add some content to your post",
              type: "Error",
              buttonname: "Close",
            })
          );
          return;
        }

        if (!tags || tags.length === 0) {
          dispatch(toggleErrorAndSuccesDialog());
          dispatch(
            setErrorAndSuccesDialogMessage({
              message: "Please Add Atleast One Tag",
              type: "Error",
              buttonname: "Close",
            })
          );
          return;
        }

        const localurls = JSON.parse(localStorage.getItem("allurls")) || [];
        const allUrls = Array.from(new Set([...cloudurl, ...localurls]));
        const unusedUrls = allUrls.filter((url) => !content.includes(url));
        const FormDataSend = new FormData();

        FormDataSend.append("content", content);
        FormDataSend.append("tags", JSON.stringify(tags));
        FormDataSend.append("title", title);
        FormDataSend.append("status", status);
        FormDataSend.append("urls", JSON.stringify(unusedUrls));

        FormDataSend.append("thumbnailType", inputType);

        if (!validateThumbnail()) {
          return;
        }

        if (inputType === "url") {
          FormDataSend.append("thumbnailUrl", imageUrl);
        } else {
          FormDataSend.append("thumbnailFile", thumbnailFile);
        }

        dispatch(status === "pending" ? setPublishPost() : setDraftPost());
        dispatch(setPostSubmiting());

        if (userDetails.role == "admin") {
          createAdminPost(FormDataSend);
        } else {
          createPostMutation.mutate(FormDataSend);
        }
      }
    },
    [
      title,
      content,
      tags,
      cloudurl,
      thumbnailFile,
      urlError,
      imageUrl,
      inputType,
      errorMessage,
      dispatch,
    ]
  );

  const commonTextFieldProps = {
    variant: "outlined",
    fullWidth: true,
    sx: {
      "& input:-webkit-autofill": {
        WebkitBoxShadow: `0 0 0 30px ${colorScheme.background} inset !important`,
        WebkitTextFillColor: `${colorScheme.text} !important`,
      },
      "& input:-webkit-autofill:hover": {
        WebkitBoxShadow: `0 0 0 30px ${colorScheme.background} inset !important`,
      },
      "& input:-webkit-autofill:focus": {
        WebkitBoxShadow: `0 0 0 30px ${colorScheme.background} inset !important`,
      },
      "& input:-webkit-autofill:active": {
        WebkitBoxShadow: `0 0 0 30px ${colorScheme.background} inset !important`,
      },

      "& .MuiOutlinedInput-root": {
        borderRadius: 2,
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: colorScheme.primary,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: colorScheme.primary,
          borderWidth: "2px",
        },
      },
      "& .MuiInputBase-input": {
        color: colorScheme.text,
        padding: "14px 16px",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: colorScheme.border,
      },
      backgroundColor: alpha(colorScheme.background, 0.4),
    },
  };

  const commonButtonProps = {
    variant: "contained",
    sx: {
      py: 1.2,
      px: 3,
      fontWeight: 500,
      borderRadius: 2,
      background: `linear-gradient(45deg, ${colorScheme.primary} 30%, ${colorScheme.primaryDark} 90%)`,
      color: "#ffffff",
      boxShadow: `0 4px 10px ${alpha(colorScheme.primary, 0.3)}`,
      "&:hover": {
        background: `linear-gradient(45deg, ${colorScheme.primaryDark} 30%, ${colorScheme.primary} 90%)`,
        boxShadow: `0 6px 15px ${alpha(colorScheme.primary, 0.4)}`,
      },
      "&:disabled": {
        color: alpha("#ffffff", 0.4),
        background: alpha(colorScheme.primary, 0.5),
      },
    },
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Paper
          elevation={3}
          sx={{
            padding: { xs: 2, sm: 4 },
            borderRadius: 3,
            backgroundColor: colorScheme.paper,
            border: `1px solid ${alpha(colorScheme.primary, 0.1)}`,
            boxShadow: `0 4px 20px ${colorScheme.shadow}`,
          }}
        >
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${colorScheme.primary} 30%, ${colorScheme.accent} 90%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: 0.5,
                color: colorScheme.text,
                mb: 1,
              }}
            >
              Create New Post
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{
                color: colorScheme.textSecondary,
                maxWidth: "700px",
                mx: "auto",
                mb: 2,
              }}
            >
              Share your thoughts, ideas, and stories with the community
            </Typography>
            <Divider
              sx={{
                mt: 2,
                backgroundColor: colorScheme.divider,
                width: "100px",
                mx: "auto",
                height: "2px",
                borderRadius: "1px",
                opacity: 0.7,
              }}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 1,
                fontWeight: 600,
                color: colorScheme.text,
                display: "flex",
                alignItems: "center",
              }}
            >
              Post Title
              <Tooltip
                arrow
                title="A compelling title helps your post get noticed"
              >
                <IconButton
                  size="small"
                  sx={{ ml: 1, color: colorScheme.textSecondary }}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            <TextField
              placeholder="Enter an engaging title for your post"
              value={title}
              onChange={(e) => dispatch(setTitle(e.target.value))}
              {...commonTextFieldProps}
              sx={{
                ...commonTextFieldProps.sx,
                "& .MuiInputBase-input": {
                  ...commonTextFieldProps.sx["& .MuiInputBase-input"],
                  fontSize: "1.1rem",
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 1,
                fontWeight: 600,
                color: colorScheme.text,
                display: "flex",
                alignItems: "center",
              }}
            >
              Tags
              <Tooltip
                arrow
                title="Add relevant tags to help readers find your post"
              >
                <IconButton
                  size="small"
                  sx={{ ml: 1, color: colorScheme.textSecondary }}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) =>
                  dispatch(setTagInput(e.target.value.toLowerCase()))
                }
                onKeyPress={handleKeyPress}
                {...commonTextFieldProps}
              />

              <Button
                variant="contained"
                onClick={addTag}
                startIcon={<AddIcon />}
                sx={{
                  minWidth: { xs: "100px", sm: "120px" },
                  background: `linear-gradient(45deg, ${colorScheme.primary} 30%, ${colorScheme.primaryDark} 90%)`,
                  color: "#ffffff",
                  boxShadow: `0 4px 10px ${alpha(colorScheme.primary, 0.3)}`,
                  "&:hover": {
                    background: `linear-gradient(45deg, ${colorScheme.primaryDark} 30%, ${colorScheme.primary} 90%)`,
                    boxShadow: `0 6px 15px ${alpha(colorScheme.primary, 0.4)}`,
                  },
                  "&:disabled": {
                    color: alpha("#ffffff", 0.4),
                    background: alpha(colorScheme.primary, 0.5),
                  },
                }}
              >
                Add Tag
              </Button>
            </Box>

            <Box
              sx={{
                minHeight: "40px",
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                mt: 1,
              }}
            >
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="medium"
                  variant="outlined"
                  onDelete={() => removeTag(index)}
                  deleteIcon={<DeleteIcon />}
                  sx={{
                    borderRadius: "4px",
                    fontWeight: 500,
                    backgroundColor: alpha(colorScheme.primary, 0.08),
                    color: colorScheme.text,
                    borderColor: alpha(colorScheme.primary, 0.3),
                    py: 0.5,
                    "& .MuiChip-deleteIcon": {
                      color: colorScheme.primary,
                      "&:hover": { color: colorScheme.error },
                    },
                    "&:hover": {
                      backgroundColor: alpha(colorScheme.primary, 0.12),
                    },
                    transition: "all 0.2s ease",
                  }}
                />
              ))}
            </Box>
          </Box>

          <ImageInputSelector
            handleThmbnailImage={handleThmbnailImage}
            setThumbnailFile={setThumbnailFile}
            thumbnailFile={thumbnailFile}
          />

          <Box sx={{ mb: 4}}>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 1,
                fontWeight: 600,
                color: colorScheme.text,
                display: "flex",
                alignItems: "center",
              }}
            >
              Post Content
              <Tooltip arrow title="Use the rich editor to format your content">
                <IconButton
                  size="small"
                  sx={{ ml: 1, color: colorScheme.textSecondary }}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 0.5,
                border: `1px solid ${colorScheme.divider}`,
                borderRadius: 2,
                backgroundColor: colorScheme.paper,
                overflow: "hidden",
                "& .jodit-container": {
                  border: "none !important",
                  borderRadius: 0,
                  backgroundColor: `${colorScheme.paper} !important`,
                  color: `${colorScheme.text} !important`,
                },
                "& .jodit-status-bar": {
                  backgroundColor:
                    mode === "dark"
                      ? `${alpha(colorScheme.paper, 0.95)} !important`
                      : undefined,
                  color:
                    mode === "dark"
                      ? `${colorScheme.textSecondary} !important`
                      : undefined,
                  borderColor:
                    mode === "dark"
                      ? `${colorScheme.divider} !important`
                      : undefined,
                },
                "& .jodit-status-bar__item_powered": {
                  display: "none !important",
                },
              }}
            >
              <JoditEditor
                ref={editor}
                value={content}
                config={editorConfig}
                onChange={(newContent) => {
                  dispatch(setContent(newContent));
                }}
                className="w-full"
              />
            </Paper>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
              mt: 4,
            }}
          >
            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={2}
              sx={{
                order: isMobile ? 1 : 2,
                width: isMobile ? "100%" : "auto",
              }}
            >
              <Button
                variant="outlined"
                startIcon={
                  draftPost ? (
                    <CircularProgress
                      size={18}
                      color="inherit"
                      sx={{ color: colorScheme.secondary }}
                    />
                  ) : (
                    <SaveIcon />
                  )
                }
                sx={{
                  py: 1.2,
                  px: 3,
                  fontWeight: 500,
                  borderRadius: 2,
                  borderWidth: 2,
                  color: colorScheme.secondary,
                  borderColor: colorScheme.secondary,
                  boxShadow: `0 0 10px ${alpha(colorScheme.error, 0.2)}`,
                  "&:hover": {
                    borderWidth: 2,
                    borderColor: colorScheme.secondaryDark,
                    backgroundColor: alpha(colorScheme.secondary, 0.05),
                    boxShadow: `0 0 15px ${alpha(colorScheme.secondary, 0.3)}`,
                  },
                  "&:disabled": {
                    color: alpha(colorScheme.secondary, 0.4),
                    borderColor: alpha(colorScheme.secondary, 0.2),
                  },
                  transition: "all 0.2s",
                }}
                disabled={draftPost}
                onClick={() => savePost("draft")}
              >
                {singlePost && editid
                  ? draftPost
                    ? "Saving..."
                    : singlePost.status === "draft"
                    ? "Update Draft"
                    : "Save as Draft"
                  : draftPost
                  ? "Saving..."
                  : "Save as Draft"}
              </Button>

              <Button
                startIcon={
                  publishPost ? (
                    <CircularProgress
                      size={18}
                      color="inherit"
                      sx={{ color: "white" }}
                    />
                  ) : (
                    <SendIcon />
                  )
                }
                disabled={publishPost}
                onClick={() => savePost("pending")}
                {...commonButtonProps}
              >
                {singlePost && editid
                  ? publishPost
                    ? "Sending..."
                    : singlePost.status === "draft"
                    ? "Publish Post"
                    : "Update Post"
                  : publishPost
                  ? "Sending..."
                  : "Publish Post"}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>

      {(isLoading || isPostSubmiting) && <BackDropLoader />}
    </>
  );
};

export default CreatePost;
