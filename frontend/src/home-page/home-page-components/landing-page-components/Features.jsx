 const features = [
  {
    name: "Easy Content Editing",
    icon: () => <EditIcon />,
    description:
      "Quickly create and update content using a simple and intuitive text editor.",
  },
  {
    name: "Media Uploads",
    icon: () => <CloudUploadIcon />,
    description:
      "Upload and manage images and files to enhance your posts and pages.",
  },
  {
    name: "User Management",
    icon: () => <AccountCircle />,
    description:
      "Add, edit, and manage users with different roles and permissions.",
  },
];

import React, {  } from "react";

import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Container,
} from "@mui/material";

import {
  Edit as EditIcon,
  AccountCircle,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";





import { useSelector } from "react-redux";
import { colors } from "../../../utils/Colors.jsx"; // Adjust the import path as needed
import { globalReduxSelector } from "../../../global-redux/GlobalRedux.jsx"; // Adjust the import path as needed

function Features() {
  // Get the dark mode state from Redux
  const { darkMode } = useSelector(globalReduxSelector);
  const colorMode = darkMode ? "dark" : "light";
  const themeColors = colors[colorMode];

  // Common animation for elements
  const sectionStyles = {
    opacity: 1,
    transform: "translateY(0)",
    transition: "opacity 0.7s ease, transform 0.7s ease",
  };

  return (
    <Box
      id="features"
      sx={{
        position: "relative",
        overflow: "hidden",
        background: darkMode
          ? `linear-gradient(180deg, ${themeColors.paper}, ${themeColors.background})`
          : "linear-gradient(180deg, #f8fafc, #ffffff)",
        py: { xs: 8, sm: 10, md: 12 },
      }}
    >
      {/* Background Gradient Blobs */}
      <Box
        sx={{
          position: "absolute",
          top: "30%",
          right: "-5%",
          width: "25%",
          height: "40%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${
            darkMode ? "rgba(33, 150, 243, 0.1)" : "rgba(20, 184, 166, 0.1)"
          } 0%, 
                       ${
                         darkMode
                           ? "rgba(33, 150, 243, 0)"
                           : "rgba(20, 184, 166, 0)"
                       } 70%)`,
          filter: "blur(50px)",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          left: "-5%",
          width: "30%",
          height: "45%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${
            darkMode ? "rgba(0, 188, 212, 0.1)" : "rgba(16, 185, 129, 0.1)"
          } 0%, 
                       ${
                         darkMode
                           ? "rgba(0, 188, 212, 0)"
                           : "rgba(16, 185, 129, 0)"
                       } 70%)`,
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={sectionStyles}>
          <Box textAlign="center" maxWidth="md" mx="auto">
            <Typography
              variant="subtitle1"
              sx={{
                color: themeColors.primary,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1.2,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Everything you need
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mt: 1,
                background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.secondary})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
                lineHeight: 1.2,
              }}
            >
              Powerful features for modern content creation
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: themeColors.textSecondary,
                mt: { xs: 2, md: 3 },
                fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" },
                px: { xs: 1, sm: 2, md: 0 },
              }}
            >
              All the tools you need to create, manage, and publish content that
              engages your audience and drives results.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            ...sectionStyles,
            transition: "opacity 0.7s ease, transform 0.7s ease 0.2s",
          }}
        >
          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 2 }}
            mt={{ xs: 4, sm: 6, md: 8 }}
          >
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 12, md: 4 }} key={feature.name}>
                <Box
                  sx={{
                    ...sectionStyles,
                    transition: `opacity 0.5s ease ${
                      index * 0.1
                    }s, transform 0.5s ease ${index * 0.1}s`,
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 3, sm: 3.5, md: 4 },
                      borderRadius: { xs: "16px", sm: "20px", md: "24px" },
                      height: "100%",
                      minHeight: "250px",
                      transition: "all 0.4s ease",
                      border: "1px solid",
                      borderColor: themeColors.divider,
                      backgroundColor: themeColors.divider,

                      background: darkMode
                        ? `rgba(${themeColors.paper}, 0.8)`
                        : "rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(10px)",
                      "&:hover": {
                        boxShadow: `0 20px 40px ${themeColors.shadow}`,
                        transform: {
                          xs: "translateY(-5px)",
                          md: "translateY(-10px)",
                        },
                        background: darkMode ? themeColors.paper : "#fff",
                        borderColor: `rgba(${themeColors.primary}, 0.2)`,
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      mb={{ xs: 2, md: 3 }}
                      sx={{
                        flexDirection: { xs: "column", sm: "row" },
                        textAlign: { xs: "center", sm: "left" },
                        "&:hover .feature-icon": {
                          transform: "scale(1.1) rotate(5deg)",
                        },
                      }}
                    >
                      <Avatar
                        className="feature-icon"
                        sx={{
                          width: { xs: 48, md: 56 },
                          height: { xs: 48, md: 56 },
                          mb: { xs: 1.5, sm: 0 },
                          mr: { xs: 0, sm: 2 },
                          background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
                          boxShadow: `0 10px 20px ${themeColors.shadow}`,
                          transition: "all 0.3s ease",
                        }}
                      >
                        <feature.icon
                          sx={{
                            color: darkMode ? themeColors.text : "#fff",
                            fontSize: { xs: "1.3rem", md: "1.5rem" },
                          }}
                        />
                      </Avatar>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          color: themeColors.text,
                          fontSize: { xs: "1.1rem", md: "1.25rem" },
                        }}
                      >
                        {feature.name}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: themeColors.textSecondary,
                        lineHeight: 1.7,
                        fontSize: { xs: "0.9rem", md: "1rem" },
                        textAlign: { xs: "center", sm: "left" },
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Paper>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default Features;
