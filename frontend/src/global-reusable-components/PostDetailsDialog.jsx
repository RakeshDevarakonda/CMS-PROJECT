import React, { useState } from "react";
import DOMPurify from "dompurify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Box,
  Skeleton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  manageContentSelector,
  togglePostDetailsDialog,
} from "../global-redux/ManageContentSlice.jsx";
import { globalReduxSelector } from "../global-redux/GlobalRedux.jsx";

const PostDetailsDialog = () => {
  const {
    contentPostDetailsDialog: isManageDialogOpen,
    contentSelectedOpportunity: selectedOpportunity,
  } = useSelector(manageContentSelector);
  const dispatch = useDispatch();

  const { darkMode } = useSelector(globalReduxSelector);

  const isDark = darkMode;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    };
    return date.toLocaleString("en-IN", options); // Example: "01 May 2025"
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isDialogOpen = isManageDialogOpen;
  const opportunity = selectedOpportunity;

  const SanitizeHtml = DOMPurify.sanitize(opportunity.content);

  const cleanHtml =
    new DOMParser().parseFromString(SanitizeHtml, "text/html").body
      .textContent || "";
  const [imageLoaded, setImageLoaded] = useState(false);

  // Theme colors
  const colors = {
    background: isDark ? "#121212" : "#ffffff",
    cardBackground: isDark ? "#1e1e1e" : "#f8fafc",
    textPrimary: isDark ? "#e1e1e1" : "#1a1a2c",
    textSecondary: isDark ? "#a1a1a1" : "#64748b",
    border: isDark ? "#2d2d2d" : "#e2e8f0",
  };

  // Status color mapping
  const getStatusColor = (status) => {
    const statusColors = {
      draft: "#4cc9f0",
      approved: "#90be6d",
      pending: "#ffc107",
      rejected: "#dc3545",
      removed: "#6f42c1",
    };
    return statusColors[status] || "#4cc9f0";
  };

  const handleClose = () => {
    if (isManageDialogOpen) {
      dispatch(togglePostDetailsDialog());
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: colors.background,
          borderRadius: 2,
        },
      }}
    >
      {/* Dialog Header with Status Color */}
      <DialogTitle
        sx={{
          bgcolor: getStatusColor(opportunity?.status),
          color: "white",
          py: 2,
          px: 3,
        }}
      >
        <Typography variant="h6" component="div" fontWeight="bold">
          {opportunity?.title}
        </Typography>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent
        dividers
        sx={{
          p: 3,
          backgroundColor: colors.background,
          borderColor: colors.border,
        }}
      >
        <Grid container spacing={3}>
          <Grid>
            <Typography
              variant="h5"
              component="div"
              gutterBottom
              sx={{
                color: colors.textPrimary,
                fontWeight: 600,
                mb: 2,
              }}
            >
              Post Details
            </Typography>
          </Grid>

          <Grid sx={{ width: "100%" }}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 2,
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
                boxShadow: "none",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: colors.textPrimary,
                    mb: 2,
                    fontWeight: 700,
                  }}
                >
                  {opportunity?.title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: colors.textPrimary,
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5, // Slightly more gap for better spacing
                    flexWrap: "wrap", // Handle smaller screens nicely
                  }}
                >
                  <span>{formatDate(opportunity?.updatedAt)}</span>
                  <span>•</span>
                  <span>{formatTime(opportunity?.updatedAt)}</span>
                  <span style={{ fontWeight: 500, marginLeft: 2 }}>
                    ( Last Updated )
                  </span>
                </Typography>

                <Box sx={{ width: 300, position: "relative" }}>
                  {!imageLoaded && (
                    <Skeleton
                      variant="rectangular"
                      width={300}
                      height={200}
                      sx={{ borderRadius: 2 }}
                    />
                  )}

                  {opportunity?.thumbnailImage && (
                    <Box
                      component="img"
                      src={opportunity.thumbnailImage}
                      alt="My Image"
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageLoaded(true)} // still hide Skeleton on error
                      sx={{
                        width: 300,
                        height: "auto",
                        borderRadius: 2,
                        boxShadow: 3,
                        display: imageLoaded ? "block" : "none",
                      }}
                    />
                  )}
                </Box>

                {opportunity?.tags?.length > 0 && (
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      color: colors.textPrimary,
                      mt: 3,
                      mb: 1,
                      fontWeight: 600,
                    }}
                  >
                    Tags
                  </Typography>
                )}

                {opportunity?.tags?.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    size="small"
                    sx={{
                      backgroundColor: isDark
                        ? "rgba(234, 234, 234, 0.85)"
                        : "rgb(100, 100, 100)",
                      color: isDark
                        ? "rgba(0, 0, 0, 0.87)"
                        : "rgb(255, 255, 255)",
                      fontWeight: 500,
                      borderRadius: 1.5,
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 2,
                        backgroundColor: isDark
                          ? "rgba(255, 255, 255, 0.95)"
                          : "rgb(80, 80, 80)",
                      },
                      transition: "all 0.3s ease",
                      marginRight: 1,
                      padding: "4px 8px",
                      height: 28,
                      fontSize: "0.75rem",
                      textTransform: "lowercase",
                      letterSpacing: "0.5px",
                    }}
                  />
                ))}

                <Typography
                  variant="h6"
                  sx={{
                    color: colors.textPrimary,
                    mt: 3,
                    mb: 1,
                    fontWeight: 600,
                  }}
                >
                  Description
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  component="div"
                  sx={{
                    color: colors.textSecondary,
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                  }}
                >
                  {cleanHtml}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions
        sx={{
          p: 2,
          backgroundColor: colors.background,
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <Button
          onClick={handleClose}
          variant="contained"
          size="large"
          sx={{
            px: 3,
            py: 1,
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 600,
            bgcolor: getStatusColor(opportunity?.status),
            "&:hover": {
              bgcolor: getStatusColor(opportunity?.status),
              opacity: 0.9,
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostDetailsDialog;
