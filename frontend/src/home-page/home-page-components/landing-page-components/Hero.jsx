import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Stack,
  Container,
} from "@mui/material";





import { useSelector } from "react-redux";
import { colors } from "../../../utils/Colors.jsx"; // Adjust the import path as needed
import { globalReduxSelector } from "../../../global-redux/GlobalRedux.jsx"; // Adjust the import path as needed

function Hero() {
  // Get the dark mode state from Redux
  const { darkMode } = useSelector(globalReduxSelector);
  const colorMode = darkMode ? "dark" : "light";
  const themeColors = colors[colorMode];

  // Features list
  const features = ["Easy to use", "SEO optimized", "Analytics included"];

  // Common animation for arrow icons
  const arrowAnimation = {
    animation: "arrowPulse 1.5s infinite ease-in-out",
    "@keyframes arrowPulse": {
      "0%": { transform: "translateX(0)" },
      "50%": { transform: "translateX(5px)" },
      "100%": { transform: "translateX(0)" },
    },
  };

  // Common styles for section elements
  const sectionStyles = {
    opacity: 1,
    transform: "translateY(0)",
    transition: "opacity 0.7s ease, transform 0.7s ease",
  };

  // Primary button gradient
  const primaryGradient = `linear-gradient(45deg, ${themeColors.primary}, ${themeColors.secondary})`;
  const primaryGradientHover = `linear-gradient(45deg, ${themeColors.primaryDark}, ${themeColors.secondaryDark})`;

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        background: darkMode
          ? `linear-gradient(180deg, ${themeColors.background}, ${themeColors.paper})`
          : "linear-gradient(180deg, #ffffff, #f7f9fc)",
        py: { xs: 10, sm: 12, lg: 20 },
      }}
    >
      {/* Background Gradient Blobs */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: "30%",
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
          bottom: "-10%",
          right: "-5%",
          width: "35%",
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
        <Box maxWidth="md" mx="auto" textAlign="center">
          {/* Announcement Chip */}
          <Box sx={sectionStyles} component="a" href="#features">
            <Chip
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <span>Announcing our latest features</span>
                  <Box sx={arrowAnimation}>
                    <ArrowForwardIcon fontSize="small" />
                  </Box>
                </Stack>
              }
              sx={{
                mb: 4,
                px: 2.5,
                py: 1.5,
                fontSize: "0.9rem",
                fontWeight: 500,
                bgcolor: darkMode
                  ? themeColors.paper
                  : "rgba(255, 255, 255, 0.8)",
                color: themeColors.text,
                border: "1px solid",
                borderColor: darkMode ? themeColors.divider : "grey.200",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                boxShadow: `0 2px 12px ${themeColors.shadow}`,
                "&:hover": {
                  bgcolor: darkMode
                    ? `rgba(${themeColors.paper}, 0.95)`
                    : "rgba(255, 255, 255, 0.95)",
                  borderColor: themeColors.border,
                  transform: "translateY(-2px)",
                  transition: "all 0.2s ease-in-out",
                },
              }}
            />
          </Box>

          {/* Headline */}
          <Box sx={sectionStyles}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                background: `linear-gradient(90deg, ${themeColors.primary} 0%, ${themeColors.secondary} 50%, ${themeColors.primaryDark} 100%)`,
                backgroundSize: "150% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                mb: 2,
                animation: "gradient 3s ease infinite",
                "@keyframes gradient": {
                  "0%": { backgroundPosition: "0% 50%" },
                  "50%": { backgroundPosition: "100% 50%" },
                  "100%": { backgroundPosition: "0% 50%" },
                },
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Create And Publish
              <br />
              All in One Place
            </Typography>
          </Box>

          {/* Subheading */}
          <Box sx={sectionStyles}>
            <Typography
              variant="body1"
              sx={{
                maxWidth: 600,
                mx: "auto",
                mt: 3,
                fontSize: { xs: "1rem", sm: "1.1rem" },
                lineHeight: 1.6,
                color: themeColors.textSecondary,
              }}
            >
              A powerful content management platform that streamlines your
              workflow. Write and publish with ease.
            </Typography>
          </Box>

          {/* CTA Buttons */}
          <Box
            sx={{
              ...sectionStyles,
              transition: "opacity 0.7s ease, transform 0.7s ease 0.2s",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 2, sm: 3 }}
              justifyContent="center"
              mt={5}
              px={2}
            >
              <Button
                variant="contained"
                size="large"
                component="a"
                href="#features"
                sx={{
                  background: primaryGradient,
                  color: darkMode ? themeColors.text : "#fff",
                  px: 4,
                  py: 1.8,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: "12px",
                  boxShadow: `0 10px 25px ${themeColors.shadow}`,
                  transition: "all 0.3s ease",
                  textTransform: "none",
                  "&:hover": {
                    background: primaryGradientHover,
                    boxShadow: `0 15px 30px ${themeColors.shadow}`,
                    transform: "translateY(-3px)",
                  },
                }}
              >
                Start for free
              </Button>
              <Button
                variant="outlined"
                size="large"
                endIcon={
                  <Box sx={arrowAnimation}>
                    <ArrowForwardIcon />
                  </Box>
                }
                component="a"
                href="#features"
                sx={{
                  fontWeight: 600,
                  color: themeColors.text,
                  borderColor: themeColors.border,
                  borderRadius: "12px",
                  px: 3,
                  py: 1.8,
                  fontSize: "1rem",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: themeColors.primary,
                    color: themeColors.primary,
                    bgcolor: `rgba(${themeColors.primary}, 0.04)`,
                    transform: "translateY(-3px)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                Learn more
              </Button>
            </Stack>
          </Box>

          {/* Features List */}
          <Box
            sx={{
              mt: { xs: 10, sm: 12 },
              ...sectionStyles,
              transition: "opacity 0.7s ease, transform 0.7s ease 0.3s",
            }}
          >
            <Grid container spacing={3} justifyContent="center">
              {features.map((feature, index) => (
                <Grid  key={feature}>
                  <Box
                    sx={{
                      ...sectionStyles,
                      transition: `opacity 0.5s ease ${
                        index * 0.1
                      }s, transform 0.5s ease ${index * 0.1}s`,
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      spacing={1.5}
                      sx={{
                        color: themeColors.text,
                        py: 1.5,
                        px: 2,
                        borderRadius: 2,
                        bgcolor: darkMode
                          ? `rgba(${themeColors.paper}, 0.5)`
                          : "rgba(255, 255, 255, 0.5)",
                        border: "1px solid",
                        borderColor: themeColors.divider,
                        backdropFilter: "blur(8px)",
                        "&:hover": {
                          color: themeColors.primary,
                          bgcolor: darkMode
                            ? `rgba(${themeColors.paper}, 0.95)`
                            : "rgba(255, 255, 255, 0.95)",
                          transform: "translateY(-2px)",
                          boxShadow: `0 6px 20px ${themeColors.shadow}`,
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <CheckCircleIcon
                        fontSize="small"
                        sx={{
                          color: themeColors.primary,
                          animation: "pulse 2s infinite",
                          "@keyframes pulse": {
                            "0%": { opacity: 0.7 },
                            "50%": { opacity: 1 },
                            "100%": { opacity: 0.7 },
                          },
                        }}
                      />
                      <Typography variant="body2" fontWeight={500}>
                        {feature}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Hero;
