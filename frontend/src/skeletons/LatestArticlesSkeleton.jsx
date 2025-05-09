import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  Skeleton,
  Stack,
} from "@mui/material";
import { useSelector } from "react-redux";
import { colors } from "../utils/Colors.jsx"; // Adjust the import path as needed
import { globalReduxSelector } from "../global-redux/GlobalRedux.jsx"; // Adjust the import path as needed

function LatestArticlesSkeleton({ allarticles, count }) {
  // Get the dark mode state from Redux
  const { darkMode } = useSelector(globalReduxSelector);
  const colorMode = darkMode ? "dark" : "light";
  const themeColors = colors[colorMode];

  const sectionStyles = {
    opacity: 1,
    transform: "translateY(0)",
    transition: "opacity 0.7s ease, transform 0.7s ease",
  };

  return (
    <Box
      id="skeleton-latest-articles"
      sx={{
        position: "relative",
        overflow: "hidden",
        background: darkMode
          ? `linear-gradient(180deg, ${themeColors.paper}, ${themeColors.background})`
          : "linear-gradient(180deg, #f7f9fc, #ffffff)",
        py: { xs: 8, sm: 10, md: 14 },
        px: { xs: 2, sm: 3 },
      }}
    >
      {/* Background Gradient Blob */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          right: "-10%",
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
          {!allarticles && (
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
                Insights & Updates
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
                Latest Articles & Resources
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
                Discover insights, tips, and best practices from our community
                of content creators.
              </Typography>
            </Box>
          )}
        </Box>

        <Box>
          <Grid
            sx={{ display: "flex", justifyContent: "space-evenly" }}
            container
            spacing={{ xs: 3, sm: 4, md: 5 }}
          >
            {Array.from(new Array(Number(count))).map((_, index) => (
              <Grid key={index}>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: { xs: 3, md: 4 },
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: themeColors.divider,
                      backgroundColor: themeColors.paper,
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        paddingTop: "65%",
                        overflow: "hidden",
                      }}
                    >
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          bgcolor: darkMode
                            ? "rgba(255, 255, 255, 0.11)"
                            : "rgba(0, 0, 0, 0.08)",
                        }}
                      />
                    </Box>

                    <CardContent
                      sx={{
                        position: "relative",
                        zIndex: 2,
                        pb: { xs: 2, md: 3 },
                        px: { xs: 2, sm: 3, md: 4 },
                        pt: { xs: 2, md: 3 },
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                      }}
                    >
                      <Skeleton
                        variant="rectangular"
                        width={80}
                        height={24}
                        sx={{
                          borderRadius: "8px",
                          mb: { xs: 1.5, md: 2 },
                          bgcolor: darkMode
                            ? "rgba(255, 255, 255, 0.11)"
                            : "rgba(0, 0, 0, 0.08)",
                        }}
                      />

                      <Skeleton
                        variant="text"
                        sx={{
                          height: { xs: "1.5rem", md: "1.7rem" },
                          mt: 1,
                          width: "90%",
                          bgcolor: darkMode
                            ? "rgba(255, 255, 255, 0.11)"
                            : "rgba(0, 0, 0, 0.08)",
                        }}
                      />
                      <Skeleton
                        variant="text"
                        sx={{
                          height: { xs: "1.5rem", md: "1.7rem" },
                          width: "70%",
                          bgcolor: darkMode
                            ? "rgba(255, 255, 255, 0.11)"
                            : "rgba(0, 0, 0, 0.08)",
                        }}
                      />

                      <Box mt={{ xs: 1, md: 2 }}>
                        <Skeleton
                          variant="text"
                          sx={{
                            height: "1rem",
                            width: "100%",
                            bgcolor: darkMode
                              ? "rgba(255, 255, 255, 0.11)"
                              : "rgba(0, 0, 0, 0.08)",
                          }}
                        />
                        <Skeleton
                          variant="text"
                          sx={{
                            height: "1rem",
                            width: "100%",
                            bgcolor: darkMode
                              ? "rgba(255, 255, 255, 0.11)"
                              : "rgba(0, 0, 0, 0.08)",
                          }}
                        />
                        <Skeleton
                          variant="text"
                          sx={{
                            height: "1rem",
                            width: "60%",
                            bgcolor: darkMode
                              ? "rgba(255, 255, 255, 0.11)"
                              : "rgba(0, 0, 0, 0.08)",
                          }}
                        />
                      </Box>

                      <Stack
                        direction="row"
                        spacing={{ xs: 1.5, md: 2 }}
                        alignItems="center"
                        justifyContent="space-between"
                        flexWrap="wrap"
                        sx={{
                          mt: "auto",
                          pt: 2,
                        }}
                      >
                        <Skeleton
                          variant="text"
                          width={100}
                          sx={{
                            height: "1rem",
                            bgcolor: darkMode
                              ? "rgba(255, 255, 255, 0.11)"
                              : "rgba(0, 0, 0, 0.08)",
                          }}
                        />
                        <Skeleton
                          variant="text"
                          width={80}
                          sx={{
                            height: "1rem",
                            bgcolor: darkMode
                              ? "rgba(255, 255, 255, 0.11)"
                              : "rgba(0, 0, 0, 0.08)",
                          }}
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            ))}
          </Grid>

          {allarticles && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
              <Skeleton
                variant="rectangular"
                width={300}
                height={40}
                sx={{
                  borderRadius: "16px",
                  bgcolor: darkMode
                    ? "rgba(255, 255, 255, 0.11)"
                    : "rgba(0, 0, 0, 0.08)",
                }}
              />
            </Box>
          )}

          {!allarticles && (
            <Box textAlign="center" mt={{ xs: 6, sm: 8, md: 10 }}>
              <Skeleton
                variant="rectangular"
                width={180}
                height={48}
                sx={{
                  borderRadius: "12px",
                  mx: "auto",
                  bgcolor: darkMode
                    ? "rgba(255, 255, 255, 0.11)"
                    : "rgba(0, 0, 0, 0.08)",
                }}
              />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default LatestArticlesSkeleton;
