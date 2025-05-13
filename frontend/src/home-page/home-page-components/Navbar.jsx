import React, {  useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemText,
  Box,
  Button,
  Switch,
  useTheme,
  useMediaQuery,
  Divider,
  ListItemButton,
  ListItem,
  styled,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ExitToApp as ExitToAppIcon,
  AccountCircle as AccountCircleIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  menuBarSelector,
  setDrawerToggle,
} from "../home-page-redux/NavbarSlice.jsx";
import { Link, Outlet, useLocation } from "react-router-dom";
import { colors } from "../../utils/Colors.jsx";

import { LogoutMutation } from "../home-page-tanstack_mutations/LogoutMutation.jsx";

import {
  globalReduxSelector,
  toggleDarkMode,
} from "../../global-redux/GlobalRedux.jsx";

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

const navItems = [
  { label: "Home", to: "/" },
  { label: "Articles", to: "/allarticles" },
  { label: "About", to: "/aboutus" },
  { label: "Contact", to: "/contactus" },
];

export default function Navbar() {
  const dispatch = useDispatch();

  const { drawerOpen } = useSelector(menuBarSelector);
  const { darkMode } = useSelector(globalReduxSelector);
  const useLogoutMutuation = LogoutMutation();

  const { isUserLogged, userDetails } = useSelector(globalReduxSelector);

  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const currentColors = colors[darkMode ? "dark" : "light"];

  const toggleDrawer = () => dispatch(setDrawerToggle());
  const handleDarkModeToggle = () => dispatch(toggleDarkMode());

  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuClick = (event) => {
    setAnchorEl(event.currentTarget); // ✅ a DOM element
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    useLogoutMutuation.mutate();
    setAnchorEl(null);
  };

  const Logo = styled(Typography)(({ theme, currentcolors }) => ({
    fontWeight: 700,
    fontSize: "1.25rem",
    background: `linear-gradient(45deg, ${currentcolors.primary} 30%, ${currentcolors.primaryLight} 90%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "0.5px",
  }));

  const DashboardButton = () => (
    <Link to={`/${userDetails.role}`} style={{ textDecoration: "none" }}>
      <Button
        variant="outlined"
        size="small"
        fullWidth
        sx={{
          color: currentColors.text,
          textTransform: "none",
          borderColor: currentColors.primary,
          "&:hover": {
            borderColor: currentColors.primaryLight,
            bgcolor: `${currentColors.primaryLight}10`,
          },
        }}
      >
        Dashboard
      </Button>
    </Link>
  );

  const AuthButtons = () => (
    <>
      <Link to="/signin" style={{ textDecoration: "none" }}>
        <Button
          variant="outlined"
          size="small"
          sx={{
            color: currentColors.text,
            textTransform: "none",
            borderColor: currentColors.primary,
            "&:hover": {
              borderColor: currentColors.primaryLight,
              bgcolor: `${currentColors.primaryLight}10`,
            },
          }}
        >
          Sign In
        </Button>
      </Link>
      <Link to="/signup" style={{ textDecoration: "none", marginLeft: 8 }}>
        <Button
          variant="contained"
          size="small"
          sx={{
            textTransform: "none",
            bgcolor: currentColors.primary,
            "&:hover": {
              bgcolor: currentColors.primaryDark,
            },
          }}
        >
          Sign Up
        </Button>
      </Link>
    </>
  );

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
          minWidth: 180,
          borderRadius: 1,
          overflow: "visible",
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: currentColors.paper,
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
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
      </Box>
      <Divider sx={{ my: 0.5, borderColor: currentColors.divider }} />

      {isUserLogged
        ? [
            <Link
              to={`/${userDetails.role}`}
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

  const drawerContent = (
    <Box
      sx={{
        width: 250,
        height: "100%",
        bgcolor: currentColors.paper,
        color: currentColors.text,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          bgcolor: currentColors.background,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              background: `linear-gradient(45deg, ${currentColors.primary} 30%, ${currentColors.primaryLight} 90%)`,
              marginRight: "10px",
            }}
          >
            M
          </Avatar>
          <Logo currentcolors={currentColors}>CMS </Logo>
        </Box>
        <IconButton onClick={toggleDrawer} sx={{ color: currentColors.text }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ px: 1, flexGrow: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <ListItem
              key={item.label}
              disablePadding
              sx={{
                mb: 0.5,
                borderRadius: 1,
                backgroundColor: active
                  ? currentColors.purpleHoverBg
                  : "transparent",
                ...(active && {
                  borderLeft: `3px solid ${currentColors.realPurple}`,
                }),
              }}
            >
              <Link
                to={item.to}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  width: "100%",
                }}
              >
                <ListItemButton
                  sx={{
                    px: 2,
                    py: 1.25,
                    "&:hover": { bgcolor: currentColors.hoverBlack },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: active ? 600 : 400,
                      color: active ? currentColors.primary : "inherit",
                    }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ borderColor: currentColors.divider }} />
      <Box sx={{ p: 2 }}>
        {isUserLogged && userDetails ? <DashboardButton /> : <AuthButtons />}
      </Box>
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${currentColors.divider}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body2" color={currentColors.textSecondary}>
          Theme
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <MaterialUISwitch
            checked={darkMode}
            onChange={handleDarkModeToggle}
            size="small"
          />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: currentColors.background,
      }}
    >
      <AppBar
        position="fixed"
        elevation={darkMode ? 0 : 1}
        sx={{
          bgcolor: currentColors.paper,
          color: currentColors.text,
          borderBottom: darkMode
            ? `1px solid ${currentColors.divider}`
            : "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isMobile ? (
              <>
                <IconButton
                  edge="start"
                  onClick={toggleDrawer}
                  sx={{ color: currentColors.text }}
                >
                  <MenuIcon />
                </IconButton>

                <Link
                  to="/"
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Logo currentcolors={currentColors}>MyLogo</Logo>
                </Link>
              </>
            ) : (
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    background: `linear-gradient(45deg, ${currentColors.primary} 30%, ${currentColors.primaryLight} 90%)`,
                    marginRight: "10px",
                  }}
                >
                  M
                </Avatar>
                <Logo currentcolors={currentColors}>MyLogo</Logo>
              </Link>
            )}
          </Box>

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {navItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      sx={{
                        color: currentColors.text,
                        position: "relative",
                        fontWeight: active ? 600 : 400,
                        "&:hover": {
                          bgcolor: `${currentColors.primaryLight}20`,
                        },
                        "&:after": active
                          ? {
                              content: '""',
                              position: "absolute",
                              bottom: 6,
                              left: "20%",
                              width: "60%",
                              height: 2,
                              bgcolor: currentColors.primary,
                            }
                          : {},
                      }}
                    >
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {!isMobile && (
              <MaterialUISwitch
                checked={darkMode}
                onChange={handleDarkModeToggle}
              />
            )}

            {isUserLogged
              ? !isMobile && <DashboardButton />
              : !isMobile && <AuthButtons />}

            {isMobile && (
              <Tooltip arrow title={darkMode ? "Light Mode" : "Dark Mode"}>
                <IconButton
                  onClick={handleDarkModeToggle}
                  color="inherit"
                  sx={{ borderRadius: 1.5 }}
                >
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
            )}

            <Tooltip arrow title="Account">
              <IconButton
                color="inherit"
                onClick={handleProfileMenuClick}
                sx={{
                  borderRadius: 1.5,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" },
                }}
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
            </Tooltip>
          </Box>

          <ProfileMenu />
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen && isMobile}
        onClose={toggleDrawer}
        PaperProps={{ sx: { bgcolor: currentColors.paper } }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flex: 1,
          bgcolor: currentColors.background,
          color: currentColors.text,
          pt: 8,
          px: 3,
          pb: 3,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
