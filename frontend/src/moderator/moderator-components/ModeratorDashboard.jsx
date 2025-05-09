import React, { useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  CircularProgress,
  Chip,
  alpha,
} from "@mui/material";
import {
  BarChart,
  Business,
  PlayArrow,
  TaskAlt,
  HighlightOff,
  Dashboard,
} from "@mui/icons-material";
import {
  moderatorDashboardSelector,
  setDataCount,
  setlastfivedatsstats,
  setStatusCounts,
  setTrendData,
} from "../../global-redux/ModeratorDashboardSlice";
import GlobalDashboard from "../../global-reusable-components/GlobalDashboard";
import {
  CheckCircle,
  Clock,
  PieChart,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useGetModeratorStatsQuery } from "../moderator-tanstack-queries/ModeratorStatsQuery";
import ModeratorDashboardSkeleton from "../../skeletons/ModeratorDashboardSkeleton";
import { globalReduxSelector } from "../../global-redux/GlobalRedux";
import GlobalDashboardSkeleton from "../../skeletons/CreatorDashboardSkeleton";

const ModeratorDashboard = () => {
  const dispatch = useDispatch();

  const { dataCount } = useSelector(moderatorDashboardSelector);

  const {
    data: statsData,
    isLoading,
    isSuccess,
    isError,
  } = useGetModeratorStatsQuery();

  const { darkMode } = useSelector(globalReduxSelector);

  const isDark = darkMode;

  const getStatusConfig = () => ({
    Total: {
      bgColor: "#4361ee",
      gradientFrom: "#4361ee",
      gradientTo: "#4361ee",
      icon: <PieChart />,
      lightBg: "#4361ee15",
    },

    Pending: {
      bgColor: "#f8961e",
      gradientFrom: "#f8961e",
      gradientTo: "#f8961e",
      icon: <Clock />,
      lightBg: "#f8961e15",
    },
    Rejected: {
      bgColor: "#8B0000",
      gradientFrom: "#8B0000",
      gradientTo: "#ff595e",
      icon: <XCircle />,
      lightBg: "#ff595e15",
    },
    Approved: {
      bgColor: "#90be6d",
      gradientFrom: "#90be6d",
      gradientTo: "#90be6d",
      icon: <CheckCircle />,
      lightBg: "#90be6d15",
    },

    Adminrechanged: {
      bgColor: "#ff5500",
      gradientFrom: "#ff1a8c",
      gradientTo: "#ff1a8c",
      icon: <ShieldCheck />,
      lightBg: "#3a86ff15",
    },
  });

  const themeColors = {
    light: {
      background: "#f5f7fa",
      cardBackground: "#ffffff",
      textPrimary: "#2d3748",
      textSecondary: "#718096",
      borderColor: "#e2e8f0",
      cardShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      chipBackground: "rgba(0, 0, 0, 0.04)",
    },
    dark: {
      background: "#121212",
      cardBackground: "#1e1e1e",

      textPrimary: "#f7fafc",
      textSecondary: "#a0aec0",
      borderColor: "#4a5568",
      cardShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      chipBackground: "rgba(255, 255, 255, 0.08)",
    },
  };

  const theme = darkMode ? "dark" : "light";

  const currentTheme = themeColors[theme] || themeColors.light;

  const statusColors = {
    Approved: {
      main: "#22c55e",
      light: isDark ? "#22c55e22" : "#dcfce7",
      icon: <TaskAlt fontSize="medium" />,
    },
    Pending: {
      main: "#eab308",
      light: isDark ? "#eab30822" : "#fef3c7",
      icon: <PlayArrow fontSize="medium" />,
    },
    Rejected: {
      main: "#ef4444",
      light: isDark ? "#ef444422" : "#fee2e2",
      icon: <HighlightOff fontSize="medium" />,
    },
    AdminRechanged: {
      main: "#0ea5e9",
      light: isDark ? "#0ea5e922" : "#e0f2fe",
      icon: <Business fontSize="medium" />,
    },
    Total: {
      main: "#6366f1",
      light: isDark ? "#6366f122" : "#e0e7ff",
      icon: <BarChart fontSize="medium" />,
    },
  };

  useEffect(() => {
    if (isSuccess && statsData) {
      console.log(statsData);
      const cleanedDataCount = { ...statsData?.dataCount };

      dispatch(setDataCount(cleanedDataCount));

      dispatch(setlastfivedatsstats(statsData?.lastFiveDaysStats));
    }

    const statusConfig = getStatusConfig();

    const statusData = statsData?.dataCount
      ? Object.entries(statsData?.dataCount)
          .filter(([key]) => !["total", "adminrechanged"].includes(key))
          .map(([status, value]) => {
            const key = status.charAt(0).toUpperCase() + status.slice(1);
            return {
              name: key,
              value,
              color: statusConfig[key]?.bgColor || "#ccc",
            };
          })
      : [];

    const trend = [];
    for (let i = 0; i <= 4; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayData = statsData?.lastFiveDaysStats?.[dateStr] || {
        approved: 0,
        rejected: 0,
      };

      trend.push({
        date: dateStr,
        approved: dayData.approved || 0,
        rejected: dayData.rejected || 0,
      });
    }

    dispatch(setTrendData(trend));

    dispatch(setStatusCounts(statusData));
  }, [isSuccess, statsData, dispatch]);

  const stats = useMemo(() => {
    const total = dataCount?.total || 0;
    const approved = dataCount?.approved || 0;
    const pending = dataCount?.pending || 0;
    const rejected = dataCount?.rejected || 0;
    const adminrechanged = dataCount?.adminrechanged || 0;

    return [
      {
        label: "Pending",
        value: pending,
        icon: statusColors.Pending.icon,
        percent: total ? Math.round((pending / total) * 100) : 0,
        description: "Pending review",
        color: statusColors.Pending,
      },
      {
        label: "Total",
        value: total,
        icon: statusColors.Total.icon,
        percent: 100,
        description: "Total submissions",
        color: statusColors.Total,
      },
      {
        label: "Approved",
        value: approved,
        icon: statusColors.Approved.icon,
        percent: total ? Math.round((approved / total) * 100) : 0,
        description: "Approved submissions",
        color: statusColors.Approved,
      },

      {
        label: "Rejected",
        value: rejected,
        icon: statusColors.Rejected.icon,
        percent: total ? Math.round((rejected / total) * 100) : 0,
        description: "Rejected items",
        color: statusColors.Rejected,
      },
      {
        label: "AdminRechanged",
        value: adminrechanged,
        icon: statusColors.AdminRechanged.icon,
        percent: total ? Math.round((adminrechanged / total) * 100) : 0,
        description: "Rechecked by admin",
        color: statusColors.AdminRechanged,
      },
    ];
  }, [dataCount]);

  if (isLoading) {
    return (
      <>
        <ModeratorDashboardSkeleton />
        <GlobalDashboardSkeleton />
      </>
    );
  }

  return (
    <>
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
            Moderator DashBoard
          </Typography>
        </Box>

        <Grid
          container
          spacing={3}
          sx={{ flexWrap: "wrap", display: "flex", justifyContent: "center" }}
        >
          {stats.map((stat) => (
            <Grid
              key={stat.label}
              sx={{
                height: stat.label === "Pending" ? "200px" : "auto",

                flex:
                  stat.label === "Pending"
                    ? "0 0 100%"
                    : {
                        xs: "0 0 100%",
                        sm: "0 0 calc(50% - 12px)",
                        md: "0 0 calc(50% - 12px)",
                        lg: "0 0 calc(24% - 12px)",
                      },
              }}
            >
              <StatCard
                stat={stat}
                currentTheme={currentTheme}
                isDark={isDark}
                allStats={stats}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <GlobalDashboard getStatusConfig={getStatusConfig} />
    </>
  );
};

const StatCard = ({ stat, currentTheme, isDark, allStats }) => {
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
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0px 0px 20px ${stat.color.main}`,
        },
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: stat.label === "Pending" ? "row" : "column",
      }}
    >
      {stat.label === "Pending" ? (
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
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: stat.color.light,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: stat.color.main,
                position: "relative",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: stat.color.main,
                }}
              >
                {stat.value}
              </Typography>
            </Box>
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
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: currentTheme.textPrimary,
                mb: 1,
              }}
            >
              {stat.label} Posts
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {allStats.slice(2).map((subStat) => (
                <Grid key={subStat.label}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: subStat.color.main,
                        mr: 1,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: currentTheme.textSecondary,
                      }}
                    >
                      {subStat.label} ({subStat.value})
                    </Typography>
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
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: currentTheme.textPrimary,
                }}
              >
                {stat.label}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: currentTheme.textSecondary,
                  mt: 0.5,
                }}
              >
                {stat.description}
              </Typography>
            </Box>
            <Avatar
              sx={{
                backgroundColor: stat.color.light,
                color: stat.color.main,
                width: 40,
                height: 40,
              }}
            >
              {stat.icon}
            </Avatar>
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
            <Box sx={{ ml: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: currentTheme.textPrimary,
                }}
              >
                {stat.value}
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default ModeratorDashboard;
