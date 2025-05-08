import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  InputAdornment,
  TextField,
  IconButton,
  Paper,
  Avatar,
  Badge,
  Divider,
  Chip,
  Grid,
  Slide,
  Fade,
  Container,
  Card,
  CardContent,
  List,
  ListItem,
  useMediaQuery,
  Stack,
} from "@mui/material";
import {
  Clear as ClearIcon,
  NotificationsOutlined as BellIcon,
  DeleteOutline as TrashIcon,
  Person,
} from "@mui/icons-material";
import { globalReduxSelector } from "../global-redux/GlobalRedux.jsx";
import { useSelector } from "react-redux";
import { colors } from "../utils/Colors.jsx";

// Mock notification data
const initialNotifications = [
  {
    id: 1,
    title: "New Message",
    message:
      "You have received a new message from John regarding the project proposal",
    time: "2 minutes ago",
    read: false,
    type: "message",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    title: "System Update",
    message: "Your system has been updated successfully to version 2.4.0",
    time: "1 hour ago",
    read: true,
    type: "system",
    avatar: null,
  },
  {
    id: 3,
    title: "Calendar Event",
    message: "Meeting with design team in 30 minutes - Conference Room A",
    time: "30 minutes ago",
    read: false,
    type: "calendar",
    avatar: null,
  },
  {
    id: 4,
    title: "New Comment",
    message:
      "Sarah commented on your recent post: 'Great insights! I'd love to discuss this further.'",
    time: "3 hours ago",
    read: true,
    type: "social",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 5,
    title: "Task Completed",
    message: "The file upload task has been completed successfully",
    time: "5 hours ago",
    read: false,
    type: "task",
    avatar: null,
  },
  {
    id: 6,
    title: "Security Alert",
    message: "New login detected from Chicago, IL on Chrome browser",
    time: "Yesterday",
    read: true,
    type: "security",
    avatar: null,
  },
  {
    id: 7,
    title: "Payment Received",
    message: "You received a payment of $250.00 from Client XYZ",
    time: "Yesterday",
    read: false,
    type: "payment",
    avatar: null,
  },
  {
    id: 8,
    title: "New Connection",
    message: "Michael Davis has sent you a connection request",
    time: "2 days ago",
    read: true,
    type: "social",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
];

// Get notification icon and color based on type

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState(0);
  const [removingId, setRemovingId] = useState(null);

  // Responsive breakpoints
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:960px)");

  const { darkMode } = useSelector(globalReduxSelector);

  const theme = darkMode ? "dark" : "light";
  const themeColors = colors[theme];

  // Filter notifications based on active tab and search query
  const filteredNotifications = notifications.filter((notification) => {
    // Filter by tab
    if (activeTab === 1 && notification.read) return false;
    if (activeTab === 2 && !notification.read) return false;

    // Filter by search

    return true;
  });

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Remove a notification with animation
  const removeNotification = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      setNotifications(
        notifications.filter((notification) => notification.id !== id)
      );
      setRemovingId(null);
    }, 300);
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };



  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };



  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: themeColors.background,
        color: themeColors.text,
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ py: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 2 : 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: isMobile ? "100%" : "auto",
              }}
            >
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 600,
                  color: themeColors.text,
                }}
              >
                Notifications
              </Typography>
              {unreadCount > 0 && (
                <Chip
                  label={`${unreadCount} unread`}
                  size="small"
                  sx={{
                    ml: 2,
                    bgcolor: themeColors.primary,
                    color: "#fff",
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              mb: 2,
              "& .MuiTabs-indicator": {
                backgroundColor: themeColors.primary,
              },
              "& .MuiTab-root": {
                color: themeColors.textSecondary,
                "&.Mui-selected": {
                  color: themeColors.primary,
                },
              },
            }}
          >
            <Tab label="All" />
            <Tab label="Unread" />
            <Tab label="Read" />
          </Tabs>
        </Box>

        {/* Main content */}
        <Box sx={{ mb: 4 }}>
          {/* Actions Bar */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",

              alignItems: "center",
              mb: 3,
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 2 : 0,
            }}
          >
            <Button
              onClick={clearAllNotifications}
              startIcon={<TrashIcon />}
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 20,
                borderColor: themeColors.border,
                color: themeColors.text,
                "&:hover": {
                  borderColor: themeColors.primary,
                  backgroundColor: themeColors.hoverBlack,
                },
              }}
            >
              Clear all
            </Button>
          </Box>

          {/* Notifications List */}
          {filteredNotifications.length > 0 ? (
            <List sx={{ mb: 4 }}>
              {filteredNotifications.map((notification) => {
                return (
                  <Fade
                    key={notification.id}
                    in={removingId !== notification.id}
                    timeout={300}
                    unmountOnExit
                  >
                    <ListItem disablePadding sx={{ mb: 2 }}>
                      <Card
                        elevation={1}
                        sx={{
                          width: "100%",
                          borderLeft: notification.read ? 0 : 4,
                          borderLeftColor: notification.read
                            ? "transparent"
                            : themeColors.primary,
                          bgcolor: themeColors.paper,
                          color: themeColors.text,
                          boxShadow: darkMode
                            ? `0px 2px 8px ${themeColors.shadow}`
                            : undefined,
                        }}
                      >
                        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                          <Grid container spacing={2}>
                            <Stack
                              spacing={3}
                              sx={{ width: "100%" }}
                              direction="row"
                            >
                              <Grid>
                                {notification.avatar ? (
                                  <Avatar src={notification.avatar} />
                                ) : (
                                  <Avatar>
                                    <Person />
                                  </Avatar>
                                )}
                              </Grid>

                              <Grid sx={{ width: "100%" }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    width: "100%",
                                    flexDirection:
                                      isTablet && !isMobile
                                        ? "row"
                                        : isMobile
                                        ? "column"
                                        : "row",
                                    gap: isMobile ? 1 : 0,
                                  }}
                                >
                                  <Box>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: 500,
                                        display: "flex",
                                        alignItems: "center",
                                        color: themeColors.text,
                                      }}
                                    >
                                      {notification.title}
                                      {!notification.read && (
                                        <Box
                                          component="span"
                                          sx={{
                                            display: "inline-block",
                                            ml: 1,
                                            width: 8,
                                            height: 8,
                                            bgcolor: themeColors.primary,
                                            borderRadius: "50%",
                                          }}
                                        />
                                      )}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{ color: themeColors.textSecondary }}
                                    >
                                      {notification.time}
                                    </Typography>
                                  </Box>

                                  {/* Actions */}
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: isMobile
                                        ? "flex-end"
                                        : "flex-start",
                                      width: isMobile ? "100%" : "auto",
                                    }}
                                  >
                                    <IconButton
                                      size="small"
                                      sx={{ color: themeColors.textSecondary }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeNotification(notification.id);
                                      }}
                                    >
                                      <ClearIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </Box>

                                <Typography
                                  variant="body2"
                                  sx={{
                                    mt: 1,
                                    color: themeColors.text,
                                  }}
                                >
                                  {notification.message}
                                </Typography>
                              </Grid>
                            </Stack>
                          </Grid>
                        </CardContent>
                      </Card>
                    </ListItem>
                  </Fade>
                );
              })}
            </List>
          ) : (
            <Paper
              elevation={1}
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                bgcolor: themeColors.paper,
                color: themeColors.text,
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mb: 2,
                }}
              >
                <BellIcon fontSize="large" />
              </Avatar>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: themeColors.text }}
              >
                No notifications found
              </Typography>
             
            </Paper>
          )}

          {/* Load more button */}
          {/* {filteredNotifications.length >= 5 && (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: 20,
                  px: 3,
                  borderColor: themeColors.border,
                  color: themeColors.text,
                  "&:hover": {
                    borderColor: themeColors.primary,
                    backgroundColor: themeColors.hoverBlack,
                  },
                }}
              >
                Load more
              </Button>
            </Box>
          )} */}
        </Box>
      </Container>
    </Box>
  );
}
