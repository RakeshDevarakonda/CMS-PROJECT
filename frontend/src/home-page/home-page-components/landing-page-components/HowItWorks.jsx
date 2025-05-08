 const steps = [
  {
    title: "Create Content",
    icon: () => <CreateIcon />,
    description:
      "Use our intuitive editor to craft your content with powerful formatting tools and AI assistance.",
    color: "linear-gradient(45deg, #14b8a6, #06b6d4)",
  },
  {
    title: "Collaborate & Review",
    icon: () => <GroupsIcon />,
    description:
      "Invite team members to collaborate, provide feedback, and refine your content in real-time.",
    color: "linear-gradient(45deg, #10b981, #059669)",
  },
  {
    title: "Publish & Distribute",
    icon: () => <RocketLaunchIcon />,
    description:
      "Schedule and publish your content across multiple channels with a single click.",
    color: "linear-gradient(45deg, #0ea5e9, #2563eb)",
  },
];
import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Avatar,
  useTheme,
  Container,
  useMediaQuery,
} from "@mui/material";

import {
  Create as CreateIcon,
  Groups as GroupsIcon,
  RocketLaunch as RocketLaunchIcon,
} from "@mui/icons-material";

import { useSelector } from "react-redux";
import { colors } from "../../../utils/Colors.jsx"; // Adjust the import path as needed
import { globalReduxSelector } from "../../../global-redux/GlobalRedux.jsx"; // Adjust the import path as needed
import { Link } from "react-router-dom";

function HowItWorks() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

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

  // Common animation for arrow icons
  const arrowAnimation = {
    animation: "arrowPulse 1.5s infinite ease-in-out",
    "@keyframes arrowPulse": {
      "0%": { transform: "translateX(0)" },
      "50%": { transform: "translateX(5px)" },
      "100%": { transform: "translateX(0)" },
    },
  };

  return (
    <Box
      id="how-it-works"
      sx={{
        position: "relative",
        overflow: "hidden",
        background: darkMode
          ? `linear-gradient(180deg, ${themeColors.background}, ${themeColors.paper})`
          : "linear-gradient(180deg, #ffffff, #f7f9fc)",
        py: { xs: 8, sm: 10, md: 14 },
        px: { xs: 2, sm: 3 },
      }}
    >
      {/* Background Gradient Blob */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "-10%",
          width: "35%",
          height: "40%",
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
              Simple Process
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mt: 1,
                color: themeColors.text,
                fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
                lineHeight: 1.2,
              }}
            >
              How ContentFlow Works
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
              From creation to publication, we've streamlined the content
              management process to help you focus on what matters most –
              creating great content.
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
            spacing={{ xs: 3, sm: 4, md: 5 }}
            mt={{ xs: 4, sm: 6, md: 8 }}
            position="relative"
          >
            {/* Connecting line between steps */}
            {!isMobile && (
              <Box
                sx={{
                  position: "absolute",
                  top: isTablet ? "30%" : "35%",
                  left: isTablet ? "12%" : "16%",
                  right: isTablet ? "12%" : "16%",
                  height: "2px",
                  backgroundColor: `rgba(${themeColors.primary}, 0.2)`,
                  zIndex: 0,
                }}
              />
            )}

            {steps.map((step, index) => (
              <Grid size={{ xs: 12, sm: 12, md: 4 }} key={step.title}>
                <Box
                  sx={{
                    ...sectionStyles,
                    transition: `opacity 0.5s ease ${
                      index * 0.1
                    }s, transform 0.5s ease ${index * 0.1}s`,
                  }}
                >
                  <Box position="relative" sx={{ height: "340px" }}>
                    {/* Step Card */}
                    <Paper
                      elevation={0}
                      sx={{
                        position: "relative",
                        zIndex: 1,
                        borderRadius: { xs: 3, md: 4 },
                        p: { xs: 3, md: 4 },
                        pt: { xs: 4, md: 5 },
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid",
                        borderColor: themeColors.divider,
                        backgroundColor: themeColors.paper,
                        backdropFilter: "blur(10px)",
                        transition: "all 0.4s ease",
                        "&:hover": {
                          boxShadow: `0 15px 30px ${themeColors.shadow}`,
                          transform: {
                            xs: "translateY(-5px)",
                            sm: "translateY(-8px)",
                            md:
                              index === 1
                                ? "translateY(-25px)"
                                : "translateY(-10px)",
                          },
                          borderColor: `rgba(${themeColors.primary}, 0.2)`,
                        },
                      }}
                    >
                      <Box>
                        <Avatar
                          sx={{
                            background: step.color,
                            width: { xs: 52, md: 64 },
                            height: { xs: 52, md: 64 },
                            boxShadow: `0 8px 20px ${step.color}40`,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.05) rotate(5deg)",
                            },
                          }}
                        >
                          <step.icon
                            sx={{
                              color: darkMode ? themeColors.text : "#fff",
                              fontSize: { xs: 22, md: 28 },
                            }}
                          />
                        </Avatar>
                      </Box>

                      <Typography
                        variant="h5"
                        fontWeight={700}
                        mt={{ xs: 2, md: 3 }}
                        sx={{
                          color: themeColors.text,
                          fontSize: {
                            xs: "1.15rem",
                            sm: "1.25rem",
                            md: "1.5rem",
                          },
                        }}
                      >
                        {step.title}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          color: themeColors.textSecondary,
                          mt: { xs: 1, md: 2 },
                          lineHeight: 1.7,
                          flex: 1,
                          fontSize: { xs: "0.9rem", md: "1rem" },
                        }}
                      >
                        {step.description}
                      </Typography>

                      <Box
                        sx={{
                          "&:hover": {
                            transform: "translateX(5px)",
                            transition: "transform 0.2s ease",
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          mt={{ xs: 2, md: 3 }}
                          sx={{
                            "& a": {
                              transition: "all 0.3s ease",
                            },
                            "&:hover a": {
                              color: themeColors.secondary,
                            },
                          }}
                        >
                          <Link
                            href="#"
                            underline="hover"
                            sx={{
                              fontWeight: 600,
                              color: themeColors.text,
                              fontSize: { xs: "0.85rem", md: "0.95rem" },
                            }}
                          >
                            <Typography
                              sx={{
                                color: themeColors.text,
                              }}
                            >
                              Learn more
                            </Typography>
                          </Link>
                          <Box sx={arrowAnimation}>
                            <ArrowForwardIcon
                              sx={{
                                fontSize: { xs: 16, md: 18 },
                                color: themeColors.primary,
                              }}
                            />
                          </Box>
                        </Stack>
                      </Box>
                    </Paper>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default HowItWorks;
