import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Avatar,
  useTheme as useMuiTheme,
  useMediaQuery,
} from "@mui/material";
import {
  PieChart,
  CheckCircle,
  XCircle,
  BarChart3,
  ShieldCheck,
  Trash2,
  UserPlus,
  Clock,
} from "lucide-react";
import GlobalDashboard from "../../global-reusable-components/GlobalDashboard";
import {
  Block,
  BusinessCenter,
  HourglassEmpty,
  InsertChart,
} from "@mui/icons-material";
import {
  setStatusCounts,
  setDataCount,
  setTrendData,
  adminDashboardSelector,
} from "../../global-redux/AdminDashboardSlice.jsx";
import { globalReduxSelector } from "../../global-redux/GlobalRedux.jsx";
import { useGetAdminStatsQuery } from "../admin-tanstack-queries/AdminStatsQuery.jsx";
import AdminDashboardSkeleton from "../../skeletons/AdminDashBoardSleleton.jsx";
import GlobalDashboardSkeleton from "../../skeletons/CreatorDashboardSkeleton.jsx";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const getStatusConfig = () => ({
    TotalPosts: {
      bgColor: "#4361ee",
      gradientFrom: "#4361ee",
      gradientTo: "#4361ee",
      icon: <PieChart />,
      lightBg: "#4361ee15",
    },
    Creator: {
      bgColor: "#4cc9f0",
      gradientFrom: "#4cc9f0",
      gradientTo: "#4cc9f0",
      icon: <UserPlus />,
      lightBg: "#4cc9f015",
    },
    Moderator: {
      bgColor: "#3a86ff",
      gradientFrom: "#3a86ff",
      gradientTo: "#3a86ff",
      icon: <ShieldCheck />,
      lightBg: "#3a86ff15",
    },
    Pending: {
      bgColor: "#f8961e",
      gradientFrom: "#f8961e",
      gradientTo: "#f8961e",
      icon: <Clock />,
      lightBg: "#f8961e15",
    },
    Rejected: {
      bgColor: "#ff595e",
      gradientFrom: "#ff595e",
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
    Deleted: {
      bgColor: "#8B0000",
      gradientFrom: "#8B0000",
      gradientTo: "#8B0000",
      icon: <Trash2 />,
      lightBg: "#ff595e15",
    },
  });

  const { dataCount } = useSelector(adminDashboardSelector);

  const muiTheme = useMuiTheme();
  const isXs = useMediaQuery(muiTheme.breakpoints.down("sm"));

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
      cardBackground: "#1e1e1e",
      textPrimary: "#ffffff",
      textSecondary: "#b0b0b0",
      borderColor: "rgba(255, 255, 255, 0.12)",
    },
  };

  const { darkMode } = useSelector(globalReduxSelector);
  // alert(darkMode)

  const theme = darkMode ? "dark" : "light";

  const currentTheme = themeColors[theme] || themeColors.light;
  const isDark = theme == "dark";

  const {
    data: statsData,
    isLoading,
    isSuccess,
    isError,
  } = useGetAdminStatsQuery();

  useEffect(() => {
    if (isSuccess && statsData) {
      dispatch(setDataCount(statsData?.dataCount));
    }

    const statusConfig = getStatusConfig();

    const statusData = statsData?.dataCount
      ? Object.entries(statsData?.dataCount)
          .filter(
            ([key]) => !["moderator", "creator", "totalPosts"].includes(key)
          )
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
        pending: 0,
      };

      trend.push({
        date: dateStr,
        approved: dayData.approved || 0,
        rejected: dayData.rejected || 0,
        pending: dayData.pending || 0,
      });
    }

    dispatch(setTrendData(trend));

    dispatch(setStatusCounts(statusData));
  }, [statsData, isSuccess]);

  const stats = useMemo(() => {
    const totalPosts = dataCount?.totalPosts || 0;
    const totalCreators = dataCount?.creator || 0;
    const totalModerators = dataCount?.moderator || 0;
    const approved = dataCount?.approved || 0;
    const pending = dataCount?.pending || 0;
    const rejected = dataCount?.rejected || 0;
    const deleted = dataCount?.deleted || 0;

    return [
      {
        label: "Total Posts",
        value: totalPosts,
        color: "#4361ee",
        icon: PieChart,
        percent: 100,
        description: "All posts created",
      },
      {
        label: "Total Creators",
        value: totalCreators,
        color: "#4cc9f0",
        icon: UserPlus,
        percent: 100,
        description: "Users who created posts",
      },
      {
        label: "Total Moderators",
        value: totalModerators,
        color: "#3a86ff",
        icon: ShieldCheck,
        percent: 100,
        description: "Active moderators in system",
      },
      {
        label: "Pending",
        value: pending,
        color: "#f8961e",
        icon: Clock,
        percent: totalPosts ? Math.round((pending / totalPosts) * 100) : 0,
        description: "Awaiting review",
      },
      {
        label: "Rejected",
        value: rejected,
        color: "#ff595e",
        icon: XCircle,
        percent: totalPosts ? Math.round((rejected / totalPosts) * 100) : 0,
        description: "Posts not approved",
      },
      {
        label: "Approved",
        value: approved,
        color: "#90be6d",
        icon: CheckCircle,
        percent: totalPosts ? Math.round((approved / totalPosts) * 100) : 0,
        description: "Posts approved by moderators",
      },

      {
        label: "Deleted",
        value: deleted,
        color: "#850101",
        icon: Trash2,
        percent: totalPosts ? Math.round((deleted / totalPosts) * 100) : 0,
        description: "Removed posts",
      },
    ];
  }, [dataCount]);

  if (isLoading) {
    return (
      <>
        <AdminDashboardSkeleton
          isDark={isDark}
          isXs={isXs}
          currentTheme={currentTheme}
        />
        
        <GlobalDashboardSkeleton />;
      </>
    );
  }
  return (
    <>
      <Box sx={{ backgroundColor: currentTheme.background, p: 4 }}>
        <Card
          sx={{ backgroundColor: currentTheme.cardBackground, mb: 3, p: 3 }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <BarChart3 color="#6366F1" size={24} />
            <Typography variant="h6" sx={{ color: currentTheme.textPrimary }}>
              Admin DashBoard
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{ color: currentTheme.textSecondary }}
          >
            Analytics
          </Typography>
        </Card>

        <Card
          sx={{
            backgroundColor: currentTheme.cardBackground,
            mb: 3,
            p: 2,
            "&:hover": {
              transform: "translateY(-4px)",
              border: `1px solid #4361ee`,
              boxShadow: `0px 4px 20px #4361ee`,
            },
          }}
        >
          <Grid
            sx={{ display: "flex", justifyContent: "space-evenly" }}
            container
            spacing={2}
          >
            {stats.map((item) => (
              <Grid key={item.label} textAlign="center">
                <Typography
                  variant="body"
                  sx={{ color: currentTheme.textSecondary }}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: item.color, marginTop: "12px" }}
                >
                  {item.value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Card>

        <Grid
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
          container
          spacing={2}
        >
          <Grid
            sx={{
              width: isXs ? "100%" : "58%",
              display: "flex",
              flexDirection: "column",
              alignItems: "space-evenly",
            }}
          >
            {stats.slice(3).map((item) => (
              <DetailCard
                key={item.label}
                item={item}
                isDark={isDark}
                currentTheme={currentTheme}
              />
            ))}
          </Grid>
          <Grid
            sx={{
              width: isXs ? "100%" : "35%",
              backgroundColor: currentTheme.cardBackground,
              marginTop: "5px",
              paddingX: "50px",
              borderRadius: "20px",
              "&:hover": {
                transform: "translateY(-4px)",
                border: `1px solid #4361ee`,
                boxShadow: `0px 4px 20px #4361ee`,
              },
            }}
          >
            <Card
              sx={{
                backgroundColor: currentTheme.cardBackground,
                p: 1,
                height: "100%",
                boxShadow: "none",
                // display: "flex",
                // flexDirection: "column",
                // justifyContent: "space-evenly",
              }}
            >
              {stats.slice(3).map((item) => (
                <Box key={item.label} mb={3} mt={5}>
                  <Box display="flex" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: item.color,
                          mr: 1,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: currentTheme.textSecondary }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: item.color }}>
                      {item.percent}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.percent}
                    sx={{
                      backgroundColor: isDark ? "#2e2e2e" : "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: item.color,
                      },
                    }}
                  />
                </Box>
              ))}
            </Card>
          </Grid>
        </Grid>
      </Box>
      <GlobalDashboard getStatusConfig={getStatusConfig} />
    </>
  );
};

const DetailCard = ({ item, isDark, currentTheme }) => {
  const Icon = item.icon;

  return (
    <Card
      sx={{
        backgroundColor: currentTheme.cardBackground,
        mb: 2,
        p: 2,
        transition: "all 0.3s",
        "&:hover": {
          boxShadow: `0px 4px 20px ${item.color}40`,
          transform: "translateY(-4px)",
          border: `1px solid ${item.color}`,
        },
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ bgcolor: isDark ? "#2c2c2c" : "#fff" }}>
          <Icon color={item.color} size={20} />
        </Avatar>
        <Box flexGrow={1}>
          <Box display="flex" justifyContent="space-between">
            <Typography
              sx={{ color: currentTheme.textPrimary, fontWeight: 500 }}
            >
              {item.label}
            </Typography>
            <Typography sx={{ color: item.color, fontWeight: 600 }}>
              {item.value}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mt={0.5}>
            <Typography
              variant="caption"
              sx={{ color: currentTheme.textSecondary }}
            >
              {item.description}
            </Typography>
          </Box>
          <Box mt={1}>
            <LinearProgress
              variant="determinate"
              value={item.percent}
              sx={{
                height: 6,
                borderRadius: 2,
                backgroundColor: isDark ? "#2e2e2e" : "#e0e0e0",
                "& .MuiLinearProgress-bar": { backgroundColor: item.color },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default AdminDashboard;
