import React, { useEffect, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DOMPurify from "dompurify";
import Pagination from "@mui/material/Pagination";

import {
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Stack,
  Card,
  CardMedia,
  CardContent,
  Container,
} from "@mui/material";

import { useSelector } from "react-redux";
import { colors } from "../../../utils/Colors.jsx"; // Adjust the import path as needed
import { globalReduxSelector } from "../../../global-redux/GlobalRedux.jsx"; // Adjust the import path as needed
import { Link } from "react-router-dom";
import { getAllArticlesQuery } from "../../home-page-tanstack-queries/GetAllArticlesQuery.jsx";
import LatestArticlesSkeleton from "../../../skeletons/LatestArticlesSkeleton.jsx";

function LatestArticles({ allarticles }) {
  // Get the dark mode state from Redux
  const { darkMode } = useSelector(globalReduxSelector);
  const colorMode = darkMode ? "dark" : "light";
  const themeColors = colors[colorMode];

  const [articles, setarticles] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const {
    data: articlesData,
    isSuccess,
    isLoading,
    isError,
  } = getAllArticlesQuery(currentPage, allarticles);

  useEffect(() => {
    if (articlesData && isSuccess) {
      setarticles(articlesData?.posts);
      setTotalPages(articlesData?.totalPages);
    }
  }, [articlesData, isSuccess]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    };
    return date.toLocaleString("en-IN", options); // Example: "01 May 2025"
  };
  const sectionStyles = {
    opacity: 1,
    transform: "translateY(0)",
    transition: "opacity 0.7s ease, transform 0.7s ease",
  };

  if (isLoading) {
    return (
      <LatestArticlesSkeleton
        allarticles={allarticles}
        count={allarticles ? "3" : "3"}
      />
    );
  }

  return (
    <Box
      id="latest-articles"
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
          <Grid container spacing={{ xs: 3, sm: 4, md: 5 }}>
            {articles?.length === 0 ? (
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  width: "100%",
                  mt: 2,
                }}
              >
                No Articles is There
              </Typography>
            ) : (
              articles?.map((article) => {
                const sanitizedContent = DOMPurify.sanitize(
                  article?.content || ""
                );
                const plainText =
                  new DOMParser().parseFromString(sanitizedContent, "text/html")
                    .body.textContent || "";


                const truncatedContent =
                  plainText.length > 50
                    ? plainText.slice(0, 100) + "..."
                    : plainText;
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={article.title}>
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Link
                        to={`/articles/singlepost/${article._id}`}
                        underline="none"
                        color="inherit"
                        sx={{
                          display: "block",
                          transition: "color 0.3s ease",
                          "&:hover": {
                            color: themeColors.primary,
                          },
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
                            transition: "all 0.4s ease",
                            "&:hover": {
                              boxShadow: `0 15px 30px ${themeColors.shadow}`,
                              transform: "translateY(-8px)",
                              borderColor: `rgba(${themeColors.primary}, 0.2)`,
                            },
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              paddingTop: "65%",
                              overflow: "hidden",
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={article?.thumbnailImage}
                              alt={article?.title}
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                transition: "transform 0.8s ease",
                                "&:hover": {
                                  transform: "scale(1.05)",
                                },
                              }}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                inset: 0,
                                background: darkMode
                                  ? "linear-gradient(to top, rgba(17,24,39,0.95), rgba(17,24,39,0.4) 50%, rgba(17,24,39,0.2))"
                                  : "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1))",
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
                            <Chip
                              label={
                                article?.tags[0]?.charAt(0).toUpperCase() +
                                article?.tags[0]?.slice(1).toLowerCase()
                              }
                              size="small"
                              sx={{
                                bgcolor: `rgba(${themeColors.primary}, 0.2)`,
                                color: themeColors.primary,
                                fontWeight: 600,
                                mb: { xs: 1.5, md: 2 },
                                borderRadius: "8px",
                                fontSize: { xs: "0.7rem", md: "0.75rem" },
                                alignSelf: "flex-start",
                              }}
                            />
                            <Typography
                              variant="h6"
                              component="div"
                              mt={1}
                              fontWeight={700}
                              sx={{
                                color: themeColors.text,
                                fontSize: {
                                  xs: "1rem",
                                  sm: "1.1rem",
                                  md: "1.25rem",
                                },
                                lineHeight: 1.3,
                                height: { xs: "2.6rem", md: "3.25rem" },
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {article?.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              mt={{ xs: 1, md: 2 }}
                              sx={{
                                color: themeColors.textSecondary,
                                fontSize: { xs: "0.8rem", md: "0.875rem" },
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                height: { xs: "3.6rem", md: "4.05rem" },
                                mb: { xs: 1.5, md: 2 },
                                flexGrow: 1,
                              }}
                            >
                              {truncatedContent}
                            </Typography>

                            <Stack
                              direction="row"
                              spacing={{ xs: 1.5, md: 2 }}
                              alignItems="center"
                              justifyContent="space-between"
                              flexWrap="wrap"
                              sx={{
                                color: themeColors.textSecondary,
                                fontSize: { xs: 12, md: 14 },
                                opacity: 0.8,
                                mt: "auto",
                              }}
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                              >
                                <PersonIcon
                                  sx={{
                                    fontSize: { xs: 14, md: 16 },
                                    color: themeColors.textSecondary,
                                  }}
                                />
                                <Typography sx={{ maxWidth: "150px" }}>
                                  {article?.userId?.name}
                                </Typography>
                              </Stack>
                              <Stack direction="row" alignItems="center">
                                <CalendarTodayIcon
                                  sx={{
                                    fontSize: {
                                      xs: 14,
                                      md: 16,
                                    },
                                    marginRight: "10px",
                                    color: themeColors.textSecondary,
                                  }}
                                />
                                {formatDate(article?.createdAt)}
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Link>
                    </Box>
                  </Grid>
                );
              })
            )}
          </Grid>

          {!allarticles && (
            <Box textAlign="center" mt={{ xs: 6, sm: 8, md: 10 }}>
              <Link to="/allarticles">
                <Button
                  variant="outlined"
                  endIcon={
                    <Box
                      sx={{
                        animation: "arrowPulse 1.5s infinite ease-in-out",
                        "@keyframes arrowPulse": {
                          "0%": { transform: "translateX(0)" },
                          "50%": { transform: "translateX(5px)" },
                          "100%": { transform: "translateX(0)" },
                        },
                      }}
                    >
                      <ArrowForwardIcon />
                    </Box>
                  }
                  sx={{
                    borderColor: themeColors.primary,
                    color: themeColors.primary,
                    borderRadius: "12px",
                    px: { xs: 2.5, md: 3 },
                    py: { xs: 1, md: 1.2 },
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      borderColor: themeColors.secondary,
                      bgcolor: `rgba(${themeColors.primary}, 0.05)`,
                      transform: "translateY(-3px)",
                      transition: "all 0.3s ease",
                    },
                  }}
                >
                  View all articles
                </Button>
              </Link>
            </Box>
          )}

          {allarticles && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
              <Pagination
                size="large"
                page={currentPage}
                onChange={handlePageChange}
                count={totalPages}
                variant="outlined"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: darkMode ? "white" : "black",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: darkMode ? "#333" : "#f0f0f0",
                      borderColor: themeColors.primary,
                      cursor: "pointer",
                    },
                  },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: themeColors.primary,
                    color: "white",
                    borderColor: themeColors.primary,
                    "&:hover": {
                      backgroundColor: themeColors.shadow,
                    },
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default LatestArticles;
