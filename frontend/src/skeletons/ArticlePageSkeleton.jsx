// ArticlePageSkeleton.jsx
import React from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  Card,
  CardContent,
  Grid,
  Stack,
  Paper,
  Skeleton,
} from "@mui/material";

import { colors } from "../utils/Colors.jsx";
import { globalReduxSelector } from "../global-redux/GlobalRedux.jsx";

const ArticlePageSkeleton = () => {
  const { darkMode } = useSelector(globalReduxSelector);
  const colorMode = darkMode ? "dark" : "light";
  const themeColors = colors[colorMode];

  // Render random width for skeletons to create more natural appearance
  const randomWidth = (min, max) => {
    return `${Math.floor(Math.random() * (max - min + 1)) + min}%`;
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", px: { xs: 0, md: 4 }, py: 4 }}>
      <Box sx={{ mb: 4 }}>
        {/* Article Title */}
        <Skeleton
          variant="text"
          height={60}
          width="90%"
          animation="wave"
          sx={{ mb: 1 }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            mb: 2,
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", mb: { xs: 2, sm: 0 } }}
          >
            <Skeleton variant="circular" width={40} height={40} animation="wave" sx={{ mr: 1.5 }} />
            
            <Box>
              <Skeleton variant="text" width={120} height={24} animation="wave" />
              <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                <Skeleton variant="text" width={150} height={18} animation="wave" />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            gap={{ xs: "10px", sm: "16px" }}
          >
            {[1, 2, 3, 4].map((_, index) => (
              <Skeleton 
                key={index} 
                variant="rounded" 
                width={80} 
                height={32} 
                animation="wave" 
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Article Content */}
      <Paper
        sx={{
          p: { xs: 2, md: 4 },
          mb: 4,
          bgcolor: themeColors.paper,
          borderRadius: 2,
          border: `1px solid ${themeColors.divider}`,
        }}
      >
        <Box
          className="article-content"
          sx={{
            color: themeColors.text,
            lineHeight: "1.7",
            fontFamily: "'Segoe UI', sans-serif",
            fontSize: "16px",
            padding: "20px",
          }}
        >
          {/* Paragraph skeletons */}
          {[...Array(5)].map((_, index) => (
            <React.Fragment key={index}>
              <Skeleton 
                variant="text" 
                height={20} 
                width={randomWidth(85, 100)} 
                animation="wave" 
                sx={{ mb: 1 }}
              />
              <Skeleton 
                variant="text" 
                height={20} 
                width={randomWidth(90, 100)} 
                animation="wave" 
                sx={{ mb: 1 }}
              />
              <Skeleton 
                variant="text" 
                height={20} 
                width={randomWidth(70, 95)} 
                animation="wave" 
                sx={{ mb: 1 }}
              />
              <Skeleton 
                variant="text" 
                height={20} 
                width={randomWidth(40, 90)}
                animation="wave"
                sx={{ mb: 3 }}
              />
            </React.Fragment>
          ))}
        </Box>

        <Divider sx={{ my: 3, borderColor: themeColors.divider }} />

        {/* Article Actions */}
        <Grid container spacing={2} alignItems="center">
          <Grid>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Skeleton variant="circular" width={40} height={40} animation="wave" sx={{ mr: 1 }} />
              <Skeleton variant="circular" width={40} height={40} animation="wave" sx={{ mr: 1 }} />
              <Skeleton variant="circular" width={40} height={40} animation="wave" sx={{ mr: 1 }} />
            </Box>
          </Grid>

          <Grid
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", sm: "flex-end" },
            }}
          >
            <Skeleton variant="circular" width={40} height={40} animation="wave" sx={{ mr: 1 }} />
            <Skeleton variant="text" width={80} height={30} animation="wave" />
          </Grid>
        </Grid>
      </Paper>

      {/* Comments Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          bgcolor: themeColors.paper,
          borderRadius: 2,
          border: `1px solid ${themeColors.divider}`,
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            mb: 3,
            color: themeColors.text,
            fontWeight: 600,
          }}
        >
          <Skeleton variant="text" width={180} height={32} animation="wave" />
        </Typography>

        {/* Add Comment */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "flex-start" }}>
          <Skeleton variant="circular" width={40} height={40} animation="wave" sx={{ mr: 1.5 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="rectangular" height={90} animation="wave" sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width={120} height={36} animation="wave" />
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: themeColors.divider }} />

        {/* Comment list skeleons */}
        {[...Array(3)].map((_, index) => (
          <React.Fragment key={index}>
            <Box sx={{ display: "flex", width: "100%", mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} animation="wave" sx={{ mr: 1.5 }} />
              <Box sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Skeleton variant="text" width={120} height={20} animation="wave" />
                    <Skeleton variant="text" width={80} height={16} animation="wave" />
                  </Box>
                </Box>
                <Skeleton variant="text" width="90%" height={20} animation="wave" sx={{ mt: 1 }} />
                <Skeleton variant="text" width="85%" height={20} animation="wave" />
              </Box>
            </Box>
            {index < 2 && <Divider sx={{ my: 2, borderColor: themeColors.divider }} />}
          </React.Fragment>
        ))}
      </Paper>

      {/* Related Articles */}
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            mb: 3,
            color: themeColors.text,
            fontWeight: 600,
          }}
        >
          <Skeleton variant="text" width={200} height={32} animation="wave" />
        </Typography>

        <Stack spacing={3}>
          {[...Array(3)].map((_, index) => (
            <Card
              key={index}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                bgcolor: themeColors.paper,
                border: `1px solid ${themeColors.divider}`,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Skeleton 
                variant="rectangular" 
                width={{ xs: "100%", sm: 200 }}
                height={{ xs: 180, sm: 200 }}
                animation="wave"
              />
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Skeleton variant="text" width={100} height={16} animation="wave" />
                  <Skeleton variant="text" width={80} height={16} animation="wave" />
                </Box>

                <Skeleton variant="text" width="90%" height={28} animation="wave" sx={{ mb: 1 }} />
                <Skeleton variant="text" width="70%" height={28} animation="wave" sx={{ mb: 2 }} />

                <Skeleton variant="text" width="100%" height={18} animation="wave" />
                <Skeleton variant="text" width="95%" height={18} animation="wave" />
                <Skeleton variant="text" width="90%" height={18} animation="wave" sx={{ mb: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: "auto",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Skeleton variant="circular" width={32} height={32} animation="wave" sx={{ mr: 1.5 }} />
                    <Skeleton variant="text" width={80} height={16} animation="wave" />
                  </Box>

                  <Skeleton variant="rounded" width={60} height={24} animation="wave" />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default ArticlePageSkeleton;