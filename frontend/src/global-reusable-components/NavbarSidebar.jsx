import * as React from "react";
import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  AppBar,
  useMediaQuery,
  useTheme,
  Badge,
  Menu,
  MenuItem,
  styled,
  Switch,
  Avatar,
  Tooltip,
  Collapse,
  Button,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Create as CreateIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  ExitToApp as ExitToAppIcon,
  ChevronLeft as ChevronLeftIcon,
  Inbox as InboxIcon,
  Mail as MailIcon,
  Notifications as NotificationsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  ExpandLess,
  ExpandMore,
  InsertChart,
  BusinessCenter,
  CheckCircle,
  HourglassEmpty,
  Block,
  Add,
  AirlineStops,
  SupervisorAccount,
} from "@mui/icons-material";

import { colors } from "../utils/Colors.jsx";
import { Link, Outlet, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { LogoutMutation } from "../home-page/home-page-tanstack_mutations/LogoutMutation.jsx";
import {
  globalReduxSelector,
  toggleDarkMode,
} from "../global-redux/GlobalRedux.jsx";

// Constants
const drawerWidth = 240;
const collapsedDrawerWidth = 100;

// Styled components
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

export default function NavbarSidebar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [desktopOpen, setDesktopOpen] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { isUserLogged, userDetails, darkMode } =
    useSelector(globalReduxSelector);

  const currentColors = colors[darkMode ? "dark" : "light"];

  const profileItems = ["Profile", "Logout"];

  const baseMenuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, to: "dashboard" },
    { text: "Profile", icon: <AccountCircleIcon />, to: "profile" },
    { text: "Logout", icon: <ExitToAppIcon />, to: "logout" },
  ];

  const creatorManageContentChildren = [
    {
      icon: <InsertChart />,
      text: "All Content",
      to: "managecontent/allcontent",
    },
    { icon: <BusinessCenter />, text: "Draft", to: "managecontent/draft" },
    { icon: <HourglassEmpty />, text: "Pending", to: "managecontent/pending" },
    { icon: <CheckCircle />, text: "Approved", to: "managecontent/approved" },
    { icon: <Block />, text: "Rejected", to: "managecontent/rejected" },
  ];

  const moderatorManageContentChildren = [
    {
      icon: <InsertChart />,
      text: "All Posts",
      to: "managecontent/allcontent",
    },
    { icon: <HourglassEmpty />, text: "Pending", to: "managecontent/pending" },
    { icon: <CheckCircle />, text: "Approved", to: "managecontent/approved" },
    { icon: <Block />, text: "Rejected", to: "managecontent/rejected" },
  ];

  const adminManageContentChildren = [
    {
      icon: <InsertChart />,
      text: "All Content",
      to: "managecontent/allcontent",
    },
    { icon: <HourglassEmpty />, text: "Pending", to: "managecontent/pending" },
    { icon: <CheckCircle />, text: "Approved", to: "managecontent/approved" },
    { icon: <Block />, text: "Rejected", to: "managecontent/rejected" },
  ];

  const adminDashboardChildren = [
    {
      icon: <InsertChart />,
      text: "All Data",
      to: "dashboard/alldata",
    },
    {
      icon: <HourglassEmpty />,
      text: "Version Data",
      to: "dashboard/versiondata",
    },
  ];

  const adminUsermanagementChildren = [
    {
      icon: <InsertChart />,
      text: "Creators",
      to: "manageusers/creators",
    },
    {
      icon: <HourglassEmpty />,
      text: "Moderators",
      to: "manageusers/moderators",
    },
    { icon: <SupervisorAccount />, text: "Admins", to: "manageusers/admins" },
  ];

  let menuItems = [];

  if (userDetails?.role === "creator") {
    if (!desktopOpen) {
      menuItems = [
        ...baseMenuItems.slice(0, 1),
        { text: "Create Post", icon: <CreateIcon />, to: "createpost" },

        {
          icon: <InsertChart />,
          text: "All Content",
          to: "managecontent/allcontent",
        },
        { icon: <BusinessCenter />, text: "Draft", to: "managecontent/draft" },
        {
          icon: <HourglassEmpty />,
          text: "Pending",
          to: "managecontent/pending",
        },
        {
          icon: <CheckCircle />,
          text: "Approved",
          to: "managecontent/approved",
        },
        { icon: <Block />, text: "Rejected", to: "managecontent/rejected" },
        ...baseMenuItems.slice(1),
      ];
    } else {
      menuItems = [
        ...baseMenuItems.slice(0, 1),
        { text: "Create Post", icon: <CreateIcon />, to: "createpost" },
        {
          text: "Manage Content",
          icon: <InboxIcon />,
          children: creatorManageContentChildren,
        },
        ...baseMenuItems.slice(1),
      ];
    }
  } else if (userDetails?.role === "moderator") {
    if (!desktopOpen) {
      menuItems = [
        ...baseMenuItems.slice(0, 1), // Dashboard
        {
          icon: <InsertChart />,
          text: "All Posts",
          to: "managecontent/allcontent",
        },
        {
          icon: <HourglassEmpty />,
          text: "Pending",
          to: "managecontent/pending",
        },
        {
          icon: <CheckCircle />,
          text: "Approved",
          to: "managecontent/approved",
        },
        { icon: <Block />, text: "Rejected", to: "managecontent/rejected" },

        ...baseMenuItems.slice(1), // Profile and Logout
      ];
    } else {
      menuItems = [
        ...baseMenuItems.slice(0, 1), // Dashboard
        {
          text: "Manage Content",
          icon: <InboxIcon />,
          children: moderatorManageContentChildren,
        },

        ...baseMenuItems.slice(1), // Profile and Logout
      ];
    }
  } else if (userDetails?.role === "admin") {
    if (!desktopOpen) {
      menuItems = [
        {
          icon: <InsertChart />,
          text: "All Data",
          to: "dashboard/alldata",
        },
        {
          icon: <HourglassEmpty />,
          text: "Version Data",
          to: "dashboard/versiondata",
        },
        { text: "Create Post", icon: <CreateIcon />, to: "createpost" },
        {
          icon: <InsertChart />,
          text: "All Content",
          to: "managecontent/allcontent",
        },
        {
          icon: <HourglassEmpty />,
          text: "Pending",
          to: "managecontent/pending",
        },
        {
          icon: <CheckCircle />,
          text: "Approved",
          to: "managecontent/approved",
        },
        { icon: <Block />, text: "Rejected", to: "managecontent/rejected" },

        {
          icon: <InsertChart />,
          text: "Creators",
          to: "manageusers/creators",
        },
        {
          icon: <HourglassEmpty />,
          text: "Moderators",
          to: "manageusers/moderators",
        },
        {
          icon: <SupervisorAccount />,
          text: "Admins",
          to: "manageusers/admins",
        },
        ...baseMenuItems.slice(1), // Profile and Logout
      ];
    } else {
      menuItems = [
        {
          text: "Dashboard",
          icon: <DashboardIcon />,
          children: adminDashboardChildren,
        },
        { text: "Create Post", icon: <CreateIcon />, to: "createpost" },
        {
          text: "Manage Content",
          icon: <InboxIcon />,
          children: adminManageContentChildren,
        },

        {
          text: "Manage Users",
          icon: <InboxIcon />,
          children: adminUsermanagementChildren,
        },
        ...baseMenuItems.slice(1), // Profile and Logout
      ];
    }
  }

  const [openSubmenus, setOpenSubmenus] = React.useState({
    "Manage Content": true,
    Dashboard: true,
    "Manage Users": true,
  });

  const useLogoutMutuation = LogoutMutation();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    useLogoutMutuation.mutate();
    setAnchorEl(null);
  };

  const ProfileMenu = () => (
    <Menu
      id="profile-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleProfileMenuClose}
      MenuListProps={{ "aria-labelledby": "profile-button" }}
      PaperProps={{
        elevation: 3,
        sx: {
          bgcolor: currentColors.paper,
          color: currentColors.text,
          mt: 1.5,
          minWidth: 250,
          borderRadius: 1,
          overflow: "visible",
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 0,
            width: 10,
            height: 10,
            bgcolor: currentColors.paper,
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 10,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          {isUserLogged ? userDetails.username : "Guest User"}
        </Typography>
        <Typography variant="body2">
          {isUserLogged ? userDetails.email : "Sign in to access your account"}
        </Typography>

        <Typography
          variant="p"
          component="div"
          align="start"
          mb={3}
          sx={{
            color: currentColors.text,
            "& span": {
              color: isUserLogged && userDetails.isActive ? "green" : "red",
              fontWeight: "bold",
            },
          }}
        >
          <span>{userDetails.isActive ? "Active" : "InActive"}</span>
        </Typography>
      </Box>
      <Divider sx={{ my: 0.5, borderColor: currentColors.divider }} />

      {isUserLogged
        ? [
            <Link to="/" style={{ textDecoration: "none" }} key="gotodahboard">
              <MenuItem
                key="mainmenu"
                onClick={handleProfileMenuClose}
                sx={{
                  py: 1.5,

                  "&:hover": { bgcolor: currentColors.hoverBlack },
                }}
              >
                <ListItemIcon>
                  <AirlineStops
                    fontSize="small"
                    sx={{ color: currentColors.primary }}
                  />
                </ListItemIcon>
                <Typography sx={{ color: currentColors.text }} variant="body2">
                  Goto Main Menu
                </Typography>
              </MenuItem>
            </Link>,
            <Link
              to="profile"
              style={{ textDecoration: "none" }}
              key={`/${userDetails.role}`}
            >
              <MenuItem
                key="account"
                onClick={handleProfileMenuClose}
                sx={{
                  py: 1.5,

                  "&:hover": { bgcolor: currentColors.hoverBlack },
                }}
              >
                <ListItemIcon>
                  <AccountCircleIcon
                    fontSize="small"
                    sx={{ color: currentColors.primary }}
                  />
                </ListItemIcon>
                <Typography sx={{ color: currentColors.text }} variant="body2">
                  My Account
                </Typography>
              </MenuItem>
            </Link>,
            <MenuItem
              key="logout"
              onClick={handleLogout}
              sx={{ py: 1.5, "&:hover": { bgcolor: currentColors.hoverBlack } }}
            >
              <ListItemIcon>
                <ExitToAppIcon fontSize="small" sx={{ color: "error.main" }} />
              </ListItemIcon>
              <Typography variant="body2">Logout</Typography>
            </MenuItem>,
          ]
        : [
            <Link
              key="signin"
              to="/signin"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <MenuItem
                onClick={handleProfileMenuClose}
                sx={{
                  py: 1.5,
                  "&:hover": { bgcolor: currentColors.hoverBlack },
                }}
              >
                <ListItemIcon>
                  <AccountCircleIcon
                    fontSize="small"
                    sx={{ color: currentColors.primary }}
                  />
                </ListItemIcon>
                <Typography variant="body2">Sign In</Typography>
              </MenuItem>
            </Link>,
            <Link
              key="signup"
              to="/signup"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <MenuItem
                onClick={handleProfileMenuClose}
                sx={{
                  py: 1.5,
                  "&:hover": { bgcolor: currentColors.hoverBlack },
                }}
              >
                <ListItemIcon>
                  <AccountCircleIcon
                    fontSize="small"
                    sx={{ color: currentColors.primary }}
                  />
                </ListItemIcon>
                <Typography variant="body2">Sign Up</Typography>
              </MenuItem>
            </Link>,
          ]}
    </Menu>
  );

  const Logo = styled(Typography)(({ theme, mode, collapsed }) => ({
    fontWeight: 700,
    fontSize: collapsed ? "0" : "1.25rem",
    background: `linear-gradient(135deg, ${currentColors.primary}, ${currentColors.secondary})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "0.5px",
    transition: "all 0.3s ease",
    overflow: "hidden",
    whiteSpace: "nowrap",
    display: "block",
  }));

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  const handleDarkModeToggle = () => dispatch(toggleDarkMode());

  const isActive = (path) => location.pathname.includes(path);

  const renderMenuItem = (item) => {
    const active = isActive(item.to);
    const isLogout = item.text === "Logout";
    return (
      <ListItem
        key={item.text}
        disablePadding
        sx={{
          mb: 0.5,
          borderRadius: 1,
          backgroundColor: active
            ? "rgba(30, 144, 255, 0.1)" // DodgerBlue with light transparency
            : "transparent",
          ...(active && {
            borderLeft: `3px solid rgba(30, 144, 255, 0.9)`, // solid DodgerBlue
          }),
        }}
      >
        <Link
          to={isLogout ? "#" : item.to || "#"}
          style={{
            textDecoration: "none",
            color: "inherit",
            width: "100%",
          }}
        >
          <ListItemButton
            onClick={isLogout ? handleLogout : undefined}
            sx={{
              px: 2,
              py: 1.25,
              justifyContent: !desktopOpen && !isMobile ? "center" : "initial",
              "&:hover": { backgroundColor: currentColors.hoverBlack },
            }}
          >
            <Tooltip
              arrow
              title={!desktopOpen ? item.text : ""}
              placement="right"
            >
              <ListItemIcon
                sx={{
                  color: active ? currentColors.primary : currentColors.text,
                  minWidth: "36px",
                }}
              >
                {item.icon}
              </ListItemIcon>
            </Tooltip>
            {(desktopOpen || isMobile) && (
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  variant: "body2",
                  fontWeight: active ? 600 : 400,
                  color: active ? currentColors.primary : "inherit",
                }}
              />
            )}
          </ListItemButton>
        </Link>
      </ListItem>
    );
  };

  const drawerContent = (
    <Box
      sx={{
        bgcolor: currentColors.paper,
        color: currentColors.text,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: 1.5,
          px: 2,
          borderBottom: `1px solid ${currentColors.divider}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              background: `linear-gradient(90deg, ${currentColors.primary} 0%, ${currentColors.secondary} 50%, ${currentColors.primaryDark} 100%)`,
            }}
          >
            {userDetails?.role === "admin"
              ? "A"
              : userDetails?.role === "creator"
              ? "C"
              : "M"}
          </Avatar>
          {desktopOpen && (
            <Logo mode={darkMode ? "dark" : "light"}>
              {userDetails?.role === "admin"
                ? "Admin"
                : userDetails?.role === "creator"
                ? "Creator"
                : "Moderator"}
            </Logo>
          )}
        </Box>
        {!isMobile && (
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ color: currentColors.text }}
            size="small"
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>

      <Divider sx={{ bgcolor: currentColors.divider }} />

      {/* Main Menu */}
      <List sx={{ px: 1, flexGrow: 1 }}>
        {menuItems
          .filter((item) => !profileItems.includes(item.text))
          .map((item) => {
            const hasChildren = Array.isArray(item.children);

            if (hasChildren) {
              const isOpen = openSubmenus[item.text];

              return (
                <Box key={item.text}>
                  {/* Parent item */}
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() =>
                        setOpenSubmenus((prev) => ({
                          ...prev,
                          [item.text]: !prev[item.text],
                        }))
                      }
                      sx={{
                        px: 2,
                        py: 1.25,
                        "&:hover": {
                          backgroundColor: currentColors.hoverBlack,
                        },
                      }}
                    >
                      <Tooltip
                        arrow
                        title={!desktopOpen ? item.text : ""}
                        placement="right"
                      >
                        <ListItemIcon
                          sx={{
                            color: currentColors.text,
                            minWidth: "36px",
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                      </Tooltip>
                      {(desktopOpen || isMobile) && (
                        <>
                          <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                              variant: "body2",
                              fontWeight: 500,
                            }}
                          />
                          {isOpen ? <ExpandLess /> : <ExpandMore />}
                        </>
                      )}
                    </ListItemButton>
                  </ListItem>

                  {/* Children */}
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 3 }}>
                      {item.children.map((child) => renderMenuItem(child))}
                    </List>
                  </Collapse>
                </Box>
              );
            }

            return renderMenuItem(item);
          })}
      </List>

      <Divider
        sx={{
          my: 2,
          bgcolor: currentColors.divider,
          height: "3px",
          borderRadius: "1px",
          opacity: 0.7,
        }}
      />

      {/* Profile Menu */}
      <Box sx={{ p: 2 }}>
        {menuItems
          .filter((item) => profileItems.includes(item.text))
          .map(renderMenuItem)}
      </Box>

      {/* Theme Toggle */}
      {desktopOpen && (
        <Box
          sx={{
            p: 2,
            borderTop: `3px solid ${currentColors.divider}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2" color={currentColors.textSecondary}>
            Theme
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LightModeIcon
              sx={{
                color: darkMode
                  ? currentColors.textSecondary
                  : currentColors.primary,
                fontSize: 18,
                mr: 1,
              }}
            />

            <Tooltip arrow title={darkMode ? "light mode" : "dark mode"}>
              <MaterialUISwitch
                checked={darkMode}
                onChange={handleDarkModeToggle}
                size="small"
              />
            </Tooltip>

            <DarkModeIcon
              sx={{
                color: darkMode
                  ? currentColors.primary
                  : currentColors.textSecondary,
                fontSize: 18,
                ml: 1,
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <Box sx={{ display: "flex", bgcolor: currentColors.background }}>
        {/* App Bar */}
        <AppBar
          position="fixed"
          elevation={darkMode ? 0 : 1}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            bgcolor: currentColors.paper,
            color: currentColors.text,
            borderBottom: darkMode
              ? `1px solid ${currentColors.divider}`
              : "none",
            width: !isMobile
              ? desktopOpen
                ? `calc(100% - ${drawerWidth}px)`
                : `calc(100% - ${collapsedDrawerWidth}px)`
              : "100%",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar>
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>

              {isSmallScreen ? (
                <>
                  <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
                    Creator
                  </Typography>
                </>
              ) : (
                <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
                  CMS Creator Dashboard
                </Typography>
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {!isSmallScreen && userDetails?.role == "creator" && (
                <Tooltip arrow title="Create a new post" placement="top">
                  <Link
                    to={`/${userDetails.role}/createpost`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      sx={{
                        textTransform: "none",
                        borderRadius: 1,
                        background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.primaryDark})`,
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                        color: "#fff",
                        px: 2,
                        py: 1,
                        fontWeight: 600,
                        "&:hover": {
                          background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.primary})`,
                          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
                          transform: "translateY(-1px)",
                          transition: "all 0.3s ease",
                        },
                      }}
                    >
                      New Post
                    </Button>
                  </Link>
                </Tooltip>
              )}

              {/* Notifications */}
              <Tooltip arrow title="notifications">
                <Link to="notification">
                  <IconButton color="inherit">
                    <Badge badgeContent={4} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Link>
              </Tooltip>

              {/* Theme Toggle */}
              <Tooltip arrow title={darkMode ? "light mode" : "dark mode"}>
                <IconButton onClick={handleDarkModeToggle} color="inherit">
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>

              <IconButton
                color="inherit"
                onClick={handleMenuClick}
                aria-controls={open ? "profile-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: currentColors.primary,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  JD
                </Avatar>
              </IconButton>

              <ProfileMenu />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        {!isMobile ? (
          <Drawer
            variant="permanent"
            open={desktopOpen}
            sx={{
              width: desktopOpen ? drawerWidth : collapsedDrawerWidth,
              "& .MuiDrawer-paper": {
                width: desktopOpen ? drawerWidth : collapsedDrawerWidth,
                overflowX: "hidden",
                bgcolor: currentColors.paper,
                borderRight: `1px solid ${currentColors.divider}`,
                transition: theme.transitions.create("width", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.standard,
                }),
                // Firefox scrollbar
                scrollbarWidth: "thin",
                scrollbarColor: `${currentColors.divider} ${currentColors.paper}`,
                // WebKit scrollbar
                "&::-webkit-scrollbar": {
                  width: "5px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "transparent",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgb(222, 222, 222)",
                  borderRadius: "10px",
                  "&:hover": {
                    background: "#ffffff",
                  },
                },
              },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                bgcolor: currentColors.paper,
                borderRight: `1px solid ${currentColors.divider}`,
                scrollbarWidth: "thin",
                scrollbarColor: `${currentColors.divider} ${currentColors.paper}`,
                // WebKit scrollbar
                "&::-webkit-scrollbar": {
                  width: "5px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "transparent",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgb(222, 222, 222)",
                  borderRadius: "10px",
                  "&:hover": {
                    background: "#ffffff",
                  },
                },
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: currentColors.background,
            color: currentColors.text,
            minHeight: "100vh",
            width: !isMobile
              ? desktopOpen
                ? `calc(100% - ${drawerWidth}px)`
                : `calc(100% - ${collapsedDrawerWidth}px)`
              : "100%",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </>
  );
}
