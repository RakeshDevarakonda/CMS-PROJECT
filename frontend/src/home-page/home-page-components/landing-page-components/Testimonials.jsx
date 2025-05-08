 const testimonials = [
  {
    name: "Alex Morgan",
    role: "Content Director at TechCorp",
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300",
    content:
      "ContentFlow has transformed how we manage our editorial calendar. We're now producing better content in half the time it used to take us.",
  },
  {
    name: "Jamie Wilson",
    role: "Marketing Manager",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300",
    content:
      "The collaboration features are outstanding. Our entire team can work together seamlessly, making our content creation process much more efficient.",
  },
  {
    name: "Taylor Richards",
    role: "Freelance Writer",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300",
    content:
      "As a freelancer, ContentFlow gives me everything I need to deliver professional content to my clients. The analytics help me demonstrate my value.",
  },
];

import React from "react";

import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Avatar,
  Container,
} from "@mui/material";


import { useSelector } from "react-redux";
import { colors } from "../../../utils/Colors.jsx"; // Adjust the import path as needed
import { globalReduxSelector } from "../../../global-redux/GlobalRedux.jsx"; // Adjust the import path as needed
function Testimonials() {
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
      id="testimonials"
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
          bottom: "10%",
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
              Community Feedback
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
              Loved by Content Creators
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
              Hear what our users say about their experience with ContentFlow.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            ...sectionStyles,
            transition: "opacity 0.7s ease, transform 0.7s ease 0.2s",
            mt: { xs: 6, sm: 8, md: 10 },
          }}
        >
          <Grid container spacing={{ xs: 3, sm: 4, md: 5 }}>
            {testimonials.map((testimonial, index) => (
              <Grid size={{ xs: 12, sm: 12, md: 4 }} key={testimonial.name}>
                <Box
                  sx={{
                    ...sectionStyles,
                    transition: `opacity 0.5s ease ${
                      index * 0.1
                    }s, transform 0.5s ease ${index * 0.1}s`,
                    height: "100%",
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 3, md: 4 },
                      borderRadius: { xs: 3, md: 4 },
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
                        transform: "translateY(-8px)",
                        borderColor: `rgba(${themeColors.primary}, 0.2)`,
                      },
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        sx={{
                          width: 56,
                          height: 56,
                          border: `2px solid rgba(${themeColors.primary}, 0.3)`,
                        }}
                      />
                      <Box>
                        <Typography
                          fontWeight={700}
                          sx={{ color: themeColors.text }}
                        >
                          {testimonial.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: themeColors.textSecondary,
                            opacity: 0.8,
                          }}
                        >
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: themeColors.textSecondary,
                        mt: 3,
                        lineHeight: 1.8,
                        fontSize: "1rem",
                        fontStyle: "italic",
                        flexGrow: 1,
                      }}
                    >
                      "{testimonial.content}"
                    </Typography>

                    <Box mt={4} display="flex" justifyContent="flex-end">
                      <Stack direction="row" spacing={0.5}>
                        {[...Array(5)].map((_, i) => (
                          <Box
                            key={i}
                            sx={{
                              color: themeColors.primary,
                              fontSize: 20,
                              display: "flex",
                              alignItems: "center",
                              opacity: i === 4 ? 0.6 : 1,
                            }}
                          >
                            ★
                          </Box>
                        ))}
                      </Stack>
                    </Box>
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
export default Testimonials;
