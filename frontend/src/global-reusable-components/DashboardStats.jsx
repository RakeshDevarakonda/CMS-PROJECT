import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tooltip,
  LinearProgress,
  IconButton,
} from "@mui/material";
import {
  InsertChart,
  BusinessCenter,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  DeleteForever,
  Refresh,
  Dashboard,
} from "@mui/icons-material";
import { globalReduxSelector } from "../global-redux/GlobalRedux.jsx";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DashboardStats = ({ dataCount,refetch }) => {
  const themeColors = {
    light: {
      background: "#f5f7fa",
      cardBackground: "#ffffff",
      textPrimary: "#1a1a2c",
      textSecondary: "#64748b",
      borderColor: "rgba(0, 0, 0, 0.12)",
    },
    dark: {
      background: "#121212",
      cardBackground: "rgba(255, 255, 255, 0.08)",
      textPrimary: "#ffffff",
      textSecondary: "#b0b0b0",
      borderColor: "rgba(255, 255, 255, 0.12)",
    },
  };
  const { darkMode } = useSelector(globalReduxSelector);
  const colorMode = darkMode ? "dark" : "light";
  const currentTheme = themeColors[colorMode];
  const isDark = colorMode === "dark";

  const stats = useMemo(() => {
    const total = dataCount?.totalPosts || 0;

    const draft = dataCount?.draft || 0;
    const pending = dataCount?.pending || 0;
    const approved = dataCount?.approved || 0;
    const rejected = dataCount?.rejected || 0;
    const deleted = dataCount?.deleted || 0;

    return [
      {
        label: "Total",
        value: total,
        bgColor: "#4361ee",
        gradientFrom: isDark ? "#3a0ca3" : "#4361ee",
        gradientTo: isDark ? "#4361ee" : "#3a0ca3",
        icon: <InsertChart />,
        percent: 100,
        description: "Total Posts",
        to: "/creator/managecontent/allcontent",
      },
      {
        label: "Rejected",
        value: rejected,
        bgColor: "#ff595e",
        gradientFrom: isDark ? "#d90429" : "#ff595e",
        gradientTo: isDark ? "#ff595e" : "#d90429",
        icon: <Cancel />,
        percent: total ? Math.round((rejected / total) * 100) : 0,
        description: "Rejected Posts",
        to: "/creator/managecontent/rejected",
      },

      {
        label: "Draft",
        value: draft,
        bgColor: "#4cc9f0",
        gradientFrom: isDark ? "#4895ef" : "#4cc9f0",
        gradientTo: isDark ? "#4cc9f0" : "#4895ef",
        icon: <BusinessCenter />,
        percent: total ? Math.round((draft / total) * 100) : 0,
        description: "Currently Drafts",
        to: "/creator/managecontent/draft",
      },

      {
        label: "Deleted",
        value: deleted,
        bgColor: "#ff595e",
        gradientFrom: isDark ? "#d90429" : "#ff595e",
        gradientTo: isDark ? "#ff595e" : "#d90429",
        icon: <DeleteForever />,
        percent: total ? Math.round((deleted / total) * 100) : 0,
        description: "No longer available",
      },
      {
        label: "Pending",
        value: pending,
        bgColor: "#f8961e",
        gradientFrom: isDark ? "#f8961e" : "#f9c74f",
        gradientTo: isDark ? "#f9c74f" : "#f8961e",
        icon: <HourglassEmpty />,
        percent: total ? Math.round((pending / total) * 100) : 0,
        description: "In progress",
        to: "/creator/managecontent/pending",
      },
      {
        label: "approved",
        value: approved,
        bgColor: "#90be6d",
        gradientFrom: isDark ? "#43aa8b" : "#90be6d",
        gradientTo: isDark ? "#90be6d" : "#43aa8b",
        icon: <CheckCircle />,
        percent: total ? Math.round((approved / total) * 100) : 0,
        description: "Successfully Completed",
        to: "/creator/managecontent/approved",
      },
    ];
  }, [dataCount]);

  const styles = {
    container: {
      pb: 4,
      backgroundColor: "currentTheme.background",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 4,
      flexWrap: "wrap",
      gap: 2,
    },
    title: {
      fontWeight: 800,
      fontSize: { xs: "1.5rem", md: "1.75rem" },
      color: currentTheme.textPrimary,
      display: "flex",
      alignItems: "center",
      gap: 1,
    },
    cardsContainer: {
      mb: 4,
      mt: 5,
      width: "95%",
      margin: "0 auto",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: { xs: 3, md: 4 },
    },
  };

  const theme = darkMode ? "dark" : "light";

  if (!stats.length) {
    return <Box sx={styles.container}>No Posts data available</Box>;
  }

  return (
    <Box sx={styles.container}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
              backgroundColor: darkMode ? "rgba(99, 102, 241, 0.1)" : "#e0e7ff",
              borderRadius: "12px",
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: theme.textPrimary,
              fontSize: { xs: "1.5rem", md: "1.75rem" },
            }}
          >
            Creator DashBoard
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Tooltip
            arrow
            title="Refresh"
            placement="top"
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: darkMode ? "#1e1e1e" : "#ffffff",
                  color: currentTheme.textPrimary,
                  boxShadow:
                    theme === "light"
                      ? "0 4px 20px rgba(0,0,0,0.05)"
                      : "0 4px 20px rgba(0,0,0,0.2)",
                  "& .MuiTooltip-arrow": {
                    color: darkMode ? "#1e1e1e" : "#ffffff",
                  },
                },
              },
            }}
          >
            <IconButton
              onClick={() => {refetch()}}
              aria-label="filter list"
              sx={{ color: currentTheme.textPrimary, mb: 4 }}
            >
              <Refresh sx={{ fontSize: "1.5rem" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={styles.cardsContainer}>
        {stats.map((item) => (
          <StatCard
            key={item.label}
            item={item}
            isDark={isDark}
            currentTheme={currentTheme}
          />
        ))}
      </Box>
    </Box>
  );
};

const StatCard = ({ item, isDark, currentTheme }) => {
  const alpha = (opacity) => (isDark ? opacity * 2 : opacity);

  const cardStyles = {
    card: {
      backgroundColor: currentTheme.cardBackground,
      borderRadius: "16px",
      boxShadow: `0 12px 24px ${item.bgColor}${alpha(15)}`,
      flex: {
        xs: "1 1 100%",
        sm: "1 1 45%",
        md: "1 1 30%",
        lg: "18%",
      },
      //   minWidth: { xs: "100%", sm: "45%", md: "30%", lg: "25%" },
      //   maxWidth: { xs: "100%", sm: "45%", md: "30%", lg: "22%" },
      overflow: "hidden",
      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      position: "relative",
      backdropFilter: "blur(20px)",
      "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: `0 20px 40px ${item.bgColor}${alpha(30)}`,
        "& .cardHeader": {
          background: `linear-gradient(120deg, ${item.gradientFrom}, ${item.gradientTo})`,
          "& .iconContainer": {
            background: isDark
              ? "rgba(0, 0, 0, 0.25)"
              : "rgba(255, 255, 255, 0.25)",
            color: "white",
          },
          "& .headerText": {
            color: "white",
          },
          "& .headerDesc": {
            color: "rgba(255, 255, 255, 0.8)",
          },
        },
      },
    },
    cardHeader: {
      p: 2.5,
      transition: "all 0.3s ease",
      background: currentTheme.cardBackground,
      display: "flex",
      alignItems: "center",
      gap: 2,
      borderBottom: `1px solid ${item.bgColor}${alpha(20)}`,
    },
    icon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 50,
      height: 50,
      borderRadius: "12px",
      background: `linear-gradient(135deg, ${item.bgColor}${alpha(10)}, ${
        item.bgColor
      }${alpha(25)})`,
      color: item.bgColor,
      transition: "all 0.3s ease",
      boxShadow: `0 4px 12px ${item.bgColor}${alpha(20)}`,
    },
    headerText: {
      fontWeight: 700,
      fontSize: { xs: "1.1rem", sm: "1.2rem" },
      color: currentTheme.textPrimary,
      letterSpacing: "0.25px",
      transition: "all 0.3s ease",
    },
    headerDesc: {
      color: currentTheme.textSecondary,
      display: "block",
      mt: 0.25,
      transition: "all 0.3s ease",
    },
    value: {
      fontWeight: 800,
      background: `linear-gradient(135deg, ${item.gradientFrom}, ${item.gradientTo})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: { xs: "2rem", sm: "2.5rem" },
      letterSpacing: "-0.5px",
    },
    progressBar: {
      height: 8,
      borderRadius: 4,
      backgroundColor: `${item.bgColor}${alpha(15)}`,
      "& .MuiLinearProgress-bar": {
        borderRadius: 4,
        background: `linear-gradient(90deg, ${item.gradientFrom}, ${item.gradientTo})`,
      },
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mt: 3,
      pt: 2,
      borderTop: `1px dashed ${item.bgColor}${alpha(30)}`,
    },
  };

  return (
    <Tooltip arrow title={`${item.percent}% of total posts`} placement="top">
      <Card sx={cardStyles.card}>
        <Link
          stle={{ textDecoration: "none" }}
          to={item.to}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Box className="cardHeader" sx={cardStyles.cardHeader}>
            <Box className="iconContainer" sx={cardStyles.icon}>
              {item.icon}
            </Box>
            <Box>
              <Typography
                className="headerText"
                variant="h6"
                sx={cardStyles.headerText}
              >
                {item.label}
              </Typography>
              <Typography
                className="headerDesc"
                variant="caption"
                sx={cardStyles.headerDesc}
              >
                {item.description}
              </Typography>
            </Box>
          </Box>

          <CardContent sx={{ p: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="h4" sx={cardStyles.value}>
                {item.value}
              </Typography>
            </Box>

            <Box sx={{ mb: 1.5 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 0.75,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: currentTheme.textSecondary }}
                >
                  Progress
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: item.bgColor, fontWeight: 600 }}
                >
                  {item.percent}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={item.percent}
                sx={cardStyles.progressBar}
              />
            </Box>

            <Box sx={cardStyles.footer}>
              <Typography
                variant="body2"
                sx={{ color: currentTheme.textSecondary, fontSize: "0.8rem" }}
              >
                {item.label !== "Total"
                  ? `${item.percent}% of Total Posts`
                  : `${item.value} Total Posts`}
              </Typography>
            </Box>
          </CardContent>
        </Link>
      </Card>
    </Tooltip>
  );
};

export default DashboardStats;
