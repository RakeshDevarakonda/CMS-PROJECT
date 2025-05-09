// ModeratorDashboardSkeleton.jsx
import React from "react";
import { Box, Typography, Paper, Grid, Skeleton } from "@mui/material";
import { Dashboard } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { globalReduxSelector } from "../global-redux/GlobalRedux.jsx";

const ModeratorDashboardSkeleton = () => {
  const { darkMode } = useSelector(globalReduxSelector);
  const isDark = darkMode;

  const themeColors = {
    light: {
      background: "#f5f7fa",
      cardBackground: "#ffffff",
      textPrimary: "#2d3748",
      textSecondary: "#718096",
      borderColor: "#e2e8f0",
      cardShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    },
    dark: {
      background: "#121212",
      cardBackground: "#1e1e1e",
      textPrimary: "#f7fafc",
      textSecondary: "#a0aec0",
      borderColor: "#4a5568",
      cardShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    },
  };

  const theme = darkMode ? "dark" : "light";
  const currentTheme = themeColors[theme] || themeColors.light;

  // Skeleton card for stats
  const StatCardSkeleton = ({ isTotal }) => {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          height: "100%",
          backgroundColor: currentTheme.cardBackground,
          borderRadius: 3,
          border: `1px solid ${
            isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
          }`,
          boxShadow: currentTheme.cardShadow,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: isTotal ? "row" : "column",
        }}
      >
        {isTotal ? (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: 80, md: 120 },
                position: "relative",
              }}
            >
              <Skeleton
                variant="circular"
                width={80}
                height={80}
                animation="wave"
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                flexGrow: 1,
                pl: 3,
              }}
            >
              <Skeleton
                variant="text"
                width={150}
                height={32}
                animation="wave"
                sx={{ mb: 1 }}
              />
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {[1, 2, 3, 4].map((item) => (
                  <Grid key={item}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Skeleton
                        variant="circular"
                        width={10}
                        height={10}
                        animation="wave"
                        sx={{ mr: 1 }}
                      />
                      <Skeleton
                        variant="text"
                        width={100}
                        height={20}
                        animation="wave"
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Box>
                <Skeleton
                  variant="text"
                  width={120}
                  height={28}
                  animation="wave"
                />
                <Skeleton
                  variant="text"
                  width={150}
                  height={20}
                  animation="wave"
                  sx={{ mt: 0.5 }}
                />
              </Box>
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                animation="wave"
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                mt: "auto",
                pt: 2,
              }}
            >
              <Skeleton
                variant="circular"
                width={100}
                height={100}
                animation="wave"
                sx={{ mr: 2 }}
              />
              <Box sx={{ ml: 1 }}>
                <Skeleton
                  variant="text"
                  width={40}
                  height={32}
                  animation="wave"
                />
                <Skeleton
                  variant="text"
                  width={60}
                  height={18}
                  animation="wave"
                />
              </Box>
            </Box>
          </>
        )}
      </Paper>
    );
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        backgroundColor: currentTheme.background,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Dashboard
          sx={{
            color: "#6366f1",
            fontSize: "2rem",
            mr: 2,
            p: 1,
            backgroundColor: isDark ? "rgba(99, 102, 241, 0.1)" : "#e0e7ff",
            borderRadius: "12px",
          }}
        />
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: currentTheme.textPrimary,
            fontSize: { xs: "1.5rem", md: "1.75rem" },
          }}
        >
          Moderator Dashboard
        </Typography>
      </Box>

      <Grid
        container
        spacing={3}
        sx={{ flexWrap: "wrap", display: "flex", justifyContent: "center" }}
      >
        {/* Total Stats Card */}
        <Grid
          sx={{
            height: "200px",
            flex: "0 0 100%",
          }}
        >
          <StatCardSkeleton isTotal={true} />
        </Grid>

        {/* Other Stats Cards */}
        {[1, 2, 3, 4].map((index) => (
          <Grid
            key={index}
            sx={{
              flex: {
                xs: "0 0 100%",
                sm: "0 0 calc(50% - 12px)",
                md: "0 0 calc(50% - 12px)",
                lg: "0 0 calc(24% - 12px)",
              },
            }}
          >
            <StatCardSkeleton isTotal={false} />
          </Grid>
        ))}
      </Grid>


    </Box>
  );
};

export default ModeratorDashboardSkeleton;
