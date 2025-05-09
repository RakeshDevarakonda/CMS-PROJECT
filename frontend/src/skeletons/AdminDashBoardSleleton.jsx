import React from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  Skeleton,
  Avatar,
  LinearProgress,
} from "@mui/material";

const AdminDashboardSkeleton = ({ isDark, isXs, currentTheme }) => {
  return (
    <Box sx={{ backgroundColor: currentTheme.background, p: 4 }}>
      {/* Top Card Skeleton */}
      <Card sx={{ backgroundColor: currentTheme.cardBackground, mb: 3, p: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width={160} height={24} />
        </Box>
        <Skeleton variant="text" width={100} height={20} />
      </Card>

      {/* Stats Row Skeleton */}
      <Card
        sx={{
          backgroundColor: currentTheme.cardBackground,
          mb: 3,
          p: 2,
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{ display: "flex", justifyContent: "space-evenly" }}
        >
          {[...Array(3)].map((_, index) => (
            <Grid item key={index} textAlign="center">
              <Skeleton variant="text" width={60} height={20} />
              <Skeleton variant="text" width={80} height={30} sx={{ mt: 1 }} />
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* Detail and Progress Sections */}
      <Grid
        container
        spacing={2}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        {/* Left Detail Cards */}
        <Grid
          item
          sx={{
            width: isXs ? "100%" : "58%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {[...Array(3)].map((_, index) => (
            <Card
              key={index}
              sx={{
                backgroundColor: currentTheme.cardBackground,
                p: 2,
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: isDark ? "#2c2c2c" : "#fff" }}>
                  <Skeleton variant="circular" width={20} height={20} />
                </Avatar>
                <Box flexGrow={1}>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="30%" height={20} />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={6}
                    sx={{ borderRadius: 2, mt: 1 }}
                  />
                </Box>
              </Box>
            </Card>
          ))}
        </Grid>

        {/* Right Progress Bars */}
        <Grid
          item
          sx={{
            width: isXs ? "100%" : "35%",
            backgroundColor: currentTheme.cardBackground,
            mt: "5px",
            px: "50px",
            borderRadius: "20px",
          }}
        >
          <Card
            sx={{
              backgroundColor: currentTheme.cardBackground,
              p: 1,
              boxShadow: "none",
            }}
          >
            {[...Array(3)].map((_, index) => (
              <Box key={index} mb={3} mt={5}>
                <Box flexGrow={1}>
                  <Skeleton variant="text" width="30%" height={20} />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={6}
                    sx={{ borderRadius: 2, mt: 1 }}
                  />
                </Box>
              </Box>
            ))}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardSkeleton;
