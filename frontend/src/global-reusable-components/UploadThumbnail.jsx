import { useState, useRef } from "react";
import {
  ImagePlus,
  X,
  Check,
  AlertCircle,
  Link as LinkIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../utils/Colors.jsx";
import { globalReduxSelector } from "../global-redux/GlobalRedux.jsx";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Box,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  createPostSelector,
  setErrorMessage,
  setUploadStatus,
  setIsUploading,
  setIsDragging,
  setUrlError,
  setPreview,
  setUrlPreview,
  setImageUrl,
  setInputType,
} from "../global-redux/CreatePostsSlice.jsx";

export default function ImageInputSelector({ handleThmbnailImage }) {
  const dispatch = useDispatch();

  const fileInputRef = useRef(null);

  // Get theme mode from Redux store
  const { darkMode: isDark } = useSelector(globalReduxSelector);

  const {
    inputType,
    imageUrl,
    urlPreview,
    urlError,
    preview,
    isDragging,
    uploadStatus,
    errorMessage,
    isUploading,
  } = useSelector(createPostSelector);
  const mode = isDark ? "dark" : "light";
  const currentColors = colors[mode];

  // Handle input type change
  const handleInputTypeChange = (event) => {
    dispatch(setInputType(event.target.value));
    handleThmbnailImage(null);

    dispatch(setUrlPreview(null));
    dispatch(setUrlError(null));
    dispatch(setPreview(null));
    dispatch(setUploadStatus(null));
    dispatch(setErrorMessage(null));
    dispatch(setImageUrl(""));
  };

  // Handle URL input
  const handleUrlChange = (event) => {
    const url = event.target.value.trim();
    dispatch(setImageUrl(url));
    dispatch(setUrlError(null));
    dispatch(setUrlPreview(null));

    if (!url) return; // Skip if empty

    // Skip all URL format checks and try to load directly
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Helps with CORS if possible

    img.onload = () => {
      // Confirm it's actually an image (not a 404 page, etc.)
      if (img.width > 0 && img.height > 0) {
        dispatch(setUrlPreview(url)); // Show if loaded successfully
        dispatch(setImageUrl(url));
        dispatch(setUrlError(null));
      } else {
        dispatch(setUrlError("URL did not return a valid image"));
      }
    };

    img.onerror = () => {
      dispatch(setUrlError("Failed  Url is not valid or not free to use"));
    };

    img.src = url;
  };
  // File upload handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const validateAndProcessFile = (file) => {
    // Reset states
    dispatch(setUploadStatus(null));
    dispatch(setErrorMessage(null));

    // Check file type
    if (!file.type.startsWith("image/")) {
      dispatch(
        setErrorMessage("Please upload an image file (JPEG, PNG, etc.)")
      );
      dispatch(setUploadStatus("error"));
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      dispatch(setErrorMessage("File size exceeds 5MB limit"));
      dispatch(setUploadStatus("error"));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      dispatch(setPreview(reader.result));
      handleThmbnailImage(file);
    };
    reader.readAsDataURL(file);

    // Simulate upload
    simulateUpload(file);
  };

  const simulateUpload = (file) => {
    dispatch(setIsUploading(true));

    // Simulate API call delay
    setTimeout(() => {
      dispatch(setIsUploading(false));
      dispatch(setUploadStatus("success"));
      // Here you would normally send the file to your server
    }, 1500);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dispatch(setIsDragging(true));
  };

  const handleDragLeave = () => {
    dispatch(setIsDragging(false));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dispatch(setIsDragging(false));

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const clearImage = (e) => {
    e?.stopPropagation(); // Prevent triggering file input
    dispatch(setPreview(null));
    dispatch(setUploadStatus(null));
    dispatch(setErrorMessage(null));
    handleThmbnailImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearUrlImage = () => {
    dispatch(setUrlPreview(null));
    dispatch(setImageUrl(""));
    dispatch(setUrlError(null));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Render URL input component
  const renderUrlInput = () => (
    <Box>
      <TextField
        label="Image URL"
        placeholder="https://example.com/image.jpg"
        fullWidth
        variant="outlined"
        value={imageUrl}
        onChange={handleUrlChange}
        error={!!urlError}
        helperText={urlError}
        sx={{
          "& input:-webkit-autofill": {
            WebkitBoxShadow: `0 0 0 30px ${currentColors.background} inset !important`,
            WebkitTextFillColor: `${currentColors.text} !important`,
          },
          "& input:-webkit-autofill:hover": {
            WebkitBoxShadow: `0 0 0 30px ${currentColors.background} inset !important`,
          },
          "& input:-webkit-autofill:focus": {
            WebkitBoxShadow: `0 0 0 30px ${currentColors.background} inset !important`,
          },
          "& input:-webkit-autofill:active": {
            WebkitBoxShadow: `0 0 0 30px ${currentColors.background} inset !important`,
          },

          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: currentColors.border,
            },
            "&:hover fieldset": {
              borderColor: currentColors.primary,
            },
            "&.Mui-focused fieldset": {
              borderColor: currentColors.primary,
            },
          },
          "& .MuiInputLabel-root": {
            color: currentColors.textSecondary,
          },
          "& .MuiInputBase-input": {
            color: currentColors.text,
          },
        }}
        InputProps={{
          startAdornment: (
            <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
              <LinkIcon size={18} color={currentColors.textSecondary} />
            </Box>
          ),
        }}
      />

      {urlPreview && (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "250px",
            borderRadius: "12px",
            overflow: "hidden",
            border: `1px solid ${currentColors.border}`,
            mt: 2,
          }}
        >
          <Box
            component="img"
            src={urlPreview}
            alt="URL Preview"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "white",
              backgroundImage: `linear-gradient(to top, ${
                isDark ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.6)"
              }, transparent)`,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Image from URL
            </Typography>
            <IconButton
              onClick={clearUrlImage}
              sx={{
                p: 0.75,
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.15)"
                  : "rgba(255, 255, 255, 0.25)",
                backdropFilter: "blur(4px)",
                color: "white",
                "&:hover": {
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.25)"
                    : "rgba(255, 255, 255, 0.35)",
                  opacity: 0.8,
                },
              }}
            >
              <X size={18} />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );

  // Render file upload component
  const renderUploadComponent = () => (
    <Box>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "256px", // Equivalent to h-64
          borderRadius: "12px",
          transition: "all 0.3s",
          overflow: "hidden",
          cursor: !preview ? "pointer" : "default",
          border: !preview ? "2px dashed" : "1px solid",
          borderColor:
            uploadStatus === "error"
              ? currentColors.error
              : uploadStatus === "success"
              ? "#4caf50"
              : isDragging
              ? currentColors.primary
              : currentColors.border,
          backgroundColor: isDragging
            ? isDark
              ? "rgba(66, 165, 245, 0.1)"
              : "rgba(100, 181, 246, 0.1)"
            : "transparent",
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={preview ? null : triggerFileInput}
      >
        {!preview && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
            }}
          >
            <Box
              sx={{
                mb: 2,
                p: 2,
                borderRadius: "50%",
                backgroundColor: isDark
                  ? "rgba(33, 150, 243, 0.1)"
                  : "rgba(100, 181, 246, 0.1)",
                color: currentColors.primary,
                display: "flex",
              }}
            >
              <ImagePlus size={44} strokeWidth={1.5} />
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontWeight: 500,
                  mb: 1,
                  color: currentColors.text,
                }}
              >
                Drop your image here, or click to browse
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: currentColors.textSecondary,
                }}
              >
                Supports: JPG, PNG, GIF (Max: 5MB)
              </Typography>
            </Box>
          </Box>
        )}

        {preview && (
          <Box
            sx={{
              height: "100%",
              width: "100%",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isDark ? currentColors.background : "#f5f7fa",
            }}
          >
            <Box
              component="img"
              src={preview}
              alt="Preview"
              sx={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "white",
                backgroundImage: `linear-gradient(to top, ${
                  isDark ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.6)"
                }, transparent)`,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Image Preview
              </Typography>
              <IconButton
                onClick={clearImage}
                sx={{
                  p: 0.75,
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.15)"
                    : "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(4px)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: isDark
                      ? "rgba(255, 255, 255, 0.25)"
                      : "rgba(255, 255, 255, 0.35)",
                    opacity: 0.8,
                  },
                }}
              >
                <X size={18} />
              </IconButton>
            </Box>
          </Box>
        )}

        {/* Animated upload overlay */}
        {isUploading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              backgroundColor: isDark
                ? "rgba(30, 30, 30, 0.85)"
                : "rgba(255, 255, 255, 0.85)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <CircularProgress
                size={40}
                sx={{
                  mb: 1.5,
                  color: currentColors.primary,
                }}
              />
              <Typography
                sx={{
                  fontWeight: 500,
                  color: currentColors.primary,
                }}
              >
                Uploading...
              </Typography>
            </Box>
          </Box>
        )}

        {/* Success indicator */}
        {uploadStatus === "success" && !isUploading && (
          <Box
            sx={{
              position: "absolute",
              top: 1.5,
              right: 1.5,
              color: "white",
              px: 1.5,
              py: 0.75,
              borderRadius: "20px",
              fontSize: "0.875rem",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              backgroundColor: isDark
                ? "rgba(76, 175, 80, 0.9)"
                : "rgba(76, 175, 80, 0.85)",
            }}
          >
            <Check size={16} sx={{ mr: 0.5 }} />
            <Typography variant="body2">Uploaded Successfully</Typography>
          </Box>
        )}
      </Box>

      {errorMessage && (
        <Box
          sx={{
            backgroundColor: isDark
              ? "rgba(244, 67, 54, 0.1)"
              : "rgba(244, 67, 54, 0.05)",
            color: currentColors.error,
            p: "8px 12px",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            mt: 1.5,
          }}
        >
          <AlertCircle size={16} sx={{ mr: 1, flexShrink: 0 }} />
          <Typography variant="body2">{errorMessage}</Typography>
        </Box>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      {!preview && (
        <Box sx={{ mt: 1, textAlign: "center" }}>
          <Typography
            variant="body2"
            sx={{ color: currentColors.textSecondary }}
          >
            Click anywhere in the upload area or drag an image file
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel
            id="image-input-type-label"
            sx={{ color: currentColors.textSecondary }}
          >
            Select Thumbnail Image
          </InputLabel>
          <Select
            labelId="image-input-type-label"
            value={inputType}
            label="Image Source"
            onChange={handleInputTypeChange}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: currentColors.primary, // Main border color
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: currentColors.primary, // Hover border color
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: currentColors.border,
                },
                "&:hover fieldset": {
                  borderColor: currentColors.primary,
                },
                "&.Mui-focused fieldset": {
                  borderColor: currentColors.primary,
                },
              },
              "& .MuiSelect-select": {
                color: currentColors.text,
              },
              "& .MuiSelect-icon": {
                color: currentColors.primary,
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: currentColors.paper,
                  color: currentColors.text,
                  borderRadius: 1,
                  boxShadow: `0 6px 16px ${currentColors.shadow}`,
                  "& .MuiMenuItem-root": {
                    color: currentColors.text,
                    "&:hover": {
                      backgroundColor: currentColors.shadow,
                    },
                    "&.Mui-selected": {
                      backgroundColor: `${currentColors.primary}20`,
                      "&:hover": {
                        backgroundColor: `${currentColors.primary}30`,
                      },
                    },
                  },
                },
              },
            }}
          >
            <MenuItem value="upload">Upload Image</MenuItem>
            <MenuItem value="url">Image URL</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {inputType === "url"
        ? renderUrlInput()
        : inputType === "upload"
        ? renderUploadComponent()
        : ""}
    </>
  );
}
