import { useSelector } from "react-redux";
import { globalReduxSelector } from "../../../global-redux/GlobalRedux.jsx";
import { colors } from "../../../utils/Colors";
import { Box, Container, Grid, IconButton, Typography } from "@mui/material";
import { GitHub, Instagram, LinkedIn, Twitter } from "@mui/icons-material";
import { Link } from "react-router-dom";
import React from "react";

const navigation = {
  solutions: [
    { name: "Content Management", href: "#" },
    { name: "Publishing", href: "#" },
    { name: "Analytics", href: "#" },
    { name: "SEO Tools", href: "#" },
  ],
  support: [
    { name: "Documentation", href: "#" },
    { name: "Guides", href: "#" },
    { name: "API Status", href: "#" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Jobs", href: "#" },
    { name: "Press", href: "#" },
  ],
};

function Footer() {
  const { darkMode } = useSelector(globalReduxSelector);
  const colorMode = darkMode ? "dark" : "light";
  const themeColors = colors[colorMode];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: themeColors.background,
        color: themeColors.text,
        pt: 6,
        pb: 4,
        borderTop: `4px solid ${themeColors.accent}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            flexDirection: "row",
          }}
        >
          {/* Logo & Description */}
          <Grid>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                background: `linear-gradient(90deg, ${themeColors.accent}, #0d9488)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ContentFlow
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Create, publish, and manage content with confidence.
            </Typography>
            <Box sx={{ mt: 3, display: "flex" }}>
              {[Twitter, GitHub, LinkedIn, Instagram].map((Icon, idx) => (
                <IconButton
                  key={idx}
                  aria-label={Icon.name}
                  sx={{
                    color: themeColors.text,
                    mr: 1,
                    transition: "color 0.3s ease",
                    "&:hover": {
                      color:
                        Icon === Twitter
                          ? "#1DA1F2"
                          : Icon === GitHub
                          ? "#ffffff"
                          : Icon === LinkedIn
                          ? "#0A66C2"
                          : "#E1306C",
                    },
                  }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {Object.entries(navigation).map(([title, items]) => (
            <Grid key={title}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  borderBottom: `2px solid ${themeColors.accent}`,
                  display: "inline-block",
                  pb: 0.5,
                }}
              >
                {title.charAt(0).toUpperCase() + title.slice(1)}
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0 }}>
                {items.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.to}
                      style={{
                        color: themeColors.text,
                        display: "block",
                        textDecoration: "none",
                        marginBottom: "8px",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.color = themeColors.accent)
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.color = themeColors.text)
                      }
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            mt: 6,
            pt: 4,
            borderTop: `1px solid ${themeColors.divider}`,
            textAlign: "center",
          }}
        >
          <Typography variant="caption">
            &copy; {new Date().getFullYear()} ContentFlow. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
