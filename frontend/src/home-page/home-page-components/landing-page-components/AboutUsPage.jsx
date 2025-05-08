import React from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  Grid,
  Avatar,
  Divider,
  Paper,
  IconButton,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import {
  Business,
  People,
  History,
  EmojiObjects,
  GitHub,
  LinkedIn,
  Twitter,
  Facebook,
  LocationOn,
  Email,
  Phone,
  Gavel,
} from "@mui/icons-material";
import { globalReduxSelector } from "../../../global-redux/GlobalRedux.jsx";
import { colors } from "../../../utils/Colors.jsx";

const AboutUsPage = () => {
  const { darkMode } = useSelector(globalReduxSelector);
  const theme = darkMode ? "dark" : "light";
  const themeColors = colors[theme];

  // Team members data
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "Visionary leader with 15+ years in content management systems.",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "Sarah Williams",
      role: "CTO",
      bio: "Technology expert specializing in scalable architecture.",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    {
      name: "Michael Chen",
      role: "Product Lead",
      bio: "User experience advocate and product strategist.",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
  ];

  // Company values
  const values = [
    {
      title: "Innovation",
      description:
        "We constantly push boundaries to deliver cutting-edge solutions.",
      icon: <EmojiObjects fontSize="large" />,
    },
    {
      title: "Integrity",
      description: "We build trust through transparency and ethical practices.",
      icon: <Gavel fontSize="large" />,
    },
    {
      title: "Collaboration",
      description: "We believe great things happen when we work together.",
      icon: <People fontSize="large" />,
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: themeColors.background,
        color: themeColors.text,
        minHeight: "100vh",
        pt: 4,
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Mission Section */}
        <Grid container spacing={6} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                color: themeColors.primary,
                position: "relative",
                pb: 2,
                mb: 4,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "60px",
                  height: "4px",
                  backgroundColor: themeColors.secondary,
                },
              }}
            >
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph>
              We founded our company with a simple goal: to revolutionize how
              organizations manage digital content. Frustrated by the complexity
              of existing solutions, we set out to build a platform that
              combines power with simplicity.
            </Typography>
            <Typography variant="body1" paragraph>
              Today, we serve thousands of businesses worldwide, from small
              startups to Fortune 500 companies, all benefiting from our
              intuitive yet powerful content management system.
            </Typography>
            <Typography variant="body1">
              Our commitment to innovation, security, and user satisfaction
              drives us to continuously improve and adapt to the evolving
              digital landscape.
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 8 }} />

        {/* Values Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              color: themeColors.primary,
              position: "relative",
              pb: 2,
              mb: 6,
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: "calc(50% - 30px)",
                width: "60px",
                height: "4px",
                backgroundColor: themeColors.secondary,
              },
            }}
          >
            Our Core Values
          </Typography>

          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid size={{ xs: 12, sm: 12, md: 4 }} key={index}>
                <Box
                  sx={{
                    p: { xs: 3, sm: 3.5, md: 4 },
                    borderRadius: { xs: "16px", sm: "20px", md: "24px" },
                    height: "100%",
                    minHeight: "250px",
                    transition: "all 0.4s ease",
                    border: "1px solid",
                    borderColor: themeColors.divider,
                    backgroundColor: themeColors.paper,

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
                    sx={{
                      backgroundColor: themeColors.primaryLight,
                      color: themeColors.background,
                      borderRadius: "50%",
                      width: 80,
                      height: 80,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 3,
                      mx: "auto",
                    }}
                  >
                    {value.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {value.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: themeColors.textSecondary }}
                  >
                    {value.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 8 }} />

        {/* Team Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              color: themeColors.primary,
              position: "relative",
              pb: 2,
              mb: 6,
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: "calc(50% - 30px)",
                width: "60px",
                height: "4px",
                backgroundColor: themeColors.secondary,
              },
            }}
          >
            Meet Our Leadership
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid size={{ xs: 12, sm: 12, md: 4 }} key={index}>
                <Box
                  sx={{
                    p: { xs: 3, sm: 3.5, md: 4 },
                    borderRadius: { xs: "16px", sm: "20px", md: "24px" },
                    height: "100%",
                    minHeight: "250px",
                    transition: "all 0.4s ease",
                    border: "1px solid",
                    borderColor: themeColors.divider,
                    backgroundColor: themeColors.paper,

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
                  <Avatar
                    src={member.avatar}
                    alt={member.name}
                    sx={{
                      width: 120,
                      height: 120,
                      mb: 3,
                      mx: "auto",
                      border: `4px solid ${themeColors.primaryLight}`,
                    }}
                  />
                  <Typography variant="h5" component="h3" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: themeColors.primary,
                      mb: 2,
                      fontWeight: 600,
                    }}
                  >
                    {member.role}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: themeColors.textSecondary }}
                  >
                    {member.bio}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 8 }} />

        {/* Contact Section */}
        <Box>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              color: themeColors.primary,
              position: "relative",
              pb: 2,
              mb: 6,
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: "calc(50% - 30px)",
                width: "60px",
                height: "4px",
                backgroundColor: themeColors.secondary,
              },
            }}
          >
            Get In Touch
          </Typography>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Box
                sx={{
                  p: { xs: 3, sm: 3.5, md: 4 },
                  borderRadius: { xs: "16px", sm: "20px", md: "24px" },
                  height: "100%",
                  minHeight: "250px",
                  transition: "all 0.4s ease",
                  border: "1px solid",
                  borderColor: themeColors.divider,
                  backgroundColor: themeColors.paper,

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
                <Typography variant="h5" component="h3" gutterBottom>
                  Contact Information
                </Typography>
                <Stack spacing={2} sx={{ mt: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LocationOn
                      sx={{ mr: 2, color: themeColors.primary }}
                      fontSize="large"
                    />
                    <Typography>
                      123 Tech Street, San Francisco, CA 94107
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Email
                      sx={{ mr: 2, color: themeColors.primary }}
                      fontSize="large"
                    />
                    <Typography>info@ourcompany.com</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Phone
                      sx={{ mr: 2, color: themeColors.primary }}
                      fontSize="large"
                    />
                    <Typography>+1 (555) 123-4567</Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Box
                sx={{
                  p: { xs: 3, sm: 3.5, md: 4 },
                  borderRadius: { xs: "16px", sm: "20px", md: "24px" },
                  height: "100%",
                  minHeight: "250px",
                  transition: "all 0.4s ease",
                  border: "1px solid",
                  borderColor: themeColors.divider,
                  backgroundColor: themeColors.paper,

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
                <Typography variant="h5" component="h3" gutterBottom>
                  Follow Us
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                  <IconButton
                    aria-label="GitHub"
                    sx={{
                      backgroundColor: themeColors.primaryLight,
                      color: themeColors.background,
                      "&:hover": {
                        backgroundColor: themeColors.primary,
                      },
                    }}
                  >
                    <GitHub />
                  </IconButton>
                  <IconButton
                    aria-label="LinkedIn"
                    sx={{
                      backgroundColor: themeColors.primaryLight,
                      color: themeColors.background,
                      "&:hover": {
                        backgroundColor: themeColors.primary,
                      },
                    }}
                  >
                    <LinkedIn />
                  </IconButton>
                  <IconButton
                    aria-label="Twitter"
                    sx={{
                      backgroundColor: themeColors.primaryLight,
                      color: themeColors.background,
                      "&:hover": {
                        backgroundColor: themeColors.primary,
                      },
                    }}
                  >
                    <Twitter />
                  </IconButton>
                  <IconButton
                    aria-label="Facebook"
                    sx={{
                      backgroundColor: themeColors.primaryLight,
                      color: themeColors.background,
                      "&:hover": {
                        backgroundColor: themeColors.primary,
                      },
                    }}
                  >
                    <Facebook />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUsPage;
