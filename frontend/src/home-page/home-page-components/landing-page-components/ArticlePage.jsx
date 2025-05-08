import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Divider,
  TextField,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Grid,
  Badge,
  Stack,
  Paper,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

import DOMPurify from "dompurify";

// Import icons
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReplyIcon from "@mui/icons-material/Reply";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReportIcon from "@mui/icons-material/Report";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LinkIcon from "@mui/icons-material/Link";

import { colors } from "../../../utils/Colors.jsx";
import {
  globalReduxSelector,
  setErrorAndSuccesDialogMessage,
  toggleErrorAndSuccesDialog,
} from "../../../global-redux/GlobalRedux.jsx";
import { getSinglePostQuery } from "../../home-page-tanstack-queries/GetSinglePostQuery.jsx";
import { Link, useLocation, useParams } from "react-router-dom";
import { getCommentstQuery } from "../../home-page-tanstack-queries/GetCommentsQuery.jsx";
import { postCommentMutation } from "../../home-page-tanstack_mutations/PostCommentMutation.jsx";

const ArticlePage = () => {
  const { darkMode } = useSelector(globalReduxSelector);
  const colorMode = darkMode ? "dark" : "light";
  const themeColors = colors[colorMode];

  const getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  const randomColor = getRandomColor();

  function getReadTime(text, wordsPerMinute = 100) {
    const content = String(text || "");
    const wordCount = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  }

  const dispatch = useDispatch();

  const [article, setArticle] = useState(null);

  const [recentArticles, setRecentArticles] = useState(null);
  const { id } = useParams();

  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" }); // disables smooth scroll
  }, [location]); // or use location.pathname if you're using that

  const { data, isSuccess, isError, error } = getSinglePostQuery(id);

  const {
    data: getCommentsData,
    isSuccess: getCommentsSuccess,
    isError: getCommentsError,
    error: getCommentsErrorMessage,
  } = getCommentstQuery(id);

  const { mutate: postcomment } = postCommentMutation();

  const [articleSanitizedContent, setarticleSanitizedContent] = useState(null);
  useEffect(() => {
    if (isSuccess && data) {
      setArticle(data?.post);
      setRecentArticles(data?.relatedArticles);
      const sanitizedContent = DOMPurify.sanitize(data?.post?.content || "");
      const plainText =
        new DOMParser().parseFromString(sanitizedContent, "text/html").body
          .textContent || "";

      setarticleSanitizedContent(plainText);
    }

    if (getCommentsSuccess && getCommentsData) {
      setComments(getCommentsData);
    }

    if (error || getCommentsErrorMessage) {
      dispatch(
        setErrorAndSuccesDialogMessage({
          message: error.message,
          type: "Error",
          buttonname: "Close",
        })
      );
      dispatch(toggleErrorAndSuccesDialog());
    }
  }, [data, getCommentsData, isSuccess, getCommentsSuccess, isError, error]);

  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const [comments, setComments] = useState([]);

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

  const [newComment, setNewComment] = useState("");

  // State for share dialog
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    setUserLiked(localStorage.getItem("userLiked") === "true");
    setUserDisliked(localStorage.getItem("userDisliked") === "true");
    setBookmarked(localStorage.getItem("bookmarked") === "true");
  }, []);

  const handleLike = () => {
    const newLikedState = !userLiked;
    const newDislikedState = newLikedState ? false : userDisliked;

    setUserLiked(newLikedState);
    setUserDisliked(newDislikedState);

    localStorage.setItem("userLiked", newLikedState);
    localStorage.setItem("userDisliked", newDislikedState);

    setArticle((prev) => ({
      ...prev,
      likes: newLikedState ? prev.likes + 1 : prev.likes - 1,
      dislikes:
        userDisliked && newLikedState ? prev.dislikes - 1 : prev.dislikes,
    }));
  };

  const handleDislike = () => {
    const newDislikedState = !userDisliked;
    const newLikedState = newDislikedState ? false : userLiked;

    setUserDisliked(newDislikedState);
    setUserLiked(newLikedState);

    localStorage.setItem("userDisliked", newDislikedState);
    localStorage.setItem("userLiked", newLikedState);

    setArticle((prev) => ({
      ...prev,
      dislikes: newDislikedState ? prev.dislikes + 1 : prev.dislikes - 1,
      likes: userLiked && newDislikedState ? prev.likes - 1 : prev.likes,
    }));
  };

  const handleBookmark = () => {
    const newBookmarkedState = !bookmarked;
    setBookmarked(newBookmarkedState);
    localStorage.setItem("bookmarked", newBookmarkedState);

    setSnackbar({
      open: true,
      message: newBookmarkedState
        ? "Article added to bookmarks"
        : "Article removed from bookmarks",
      severity: "success",
    });
  };

  // Handle share
  const handleShare = () => {
    setShareDialogOpen(true);
  };

  // Handle copy link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareDialogOpen(false);
    setSnackbar({
      open: true,
      message: "Link copied to clipboard",
      severity: "success",
    });
  };

  // Handle more menu

  // Handle submit comment
  const handleSubmitComment = () => {
    if (newComment.trim() === "") return;

    const newCommentObj = {
      text: newComment,
      postId: id,
      createdAt: new Date().toISOString(),
    };

    setComments([newCommentObj, ...comments]);
    postcomment(newCommentObj);
    setNewComment("");
    setSnackbar({
      open: true,
      message: "Comment posted successfully",
      severity: "success",
    });
  };

  // Handle reply to comment

  // Handle submit reply

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", px: { xs: 0, md: 4 }, py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          component="span"
          sx={{
            fontSize: {
              xs: "1.3rem",
              md: "2rem",
            },
            color: themeColors.text,
            fontWeight: 700,
          }}
        >
          {article?.title
            ? article.title.charAt(0).toUpperCase() + article.title.slice(1)
            : ""}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            mb: 2,
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", mb: { xs: 2, sm: 0 } }}
          >
            {article?.userId?.avatar ? (
              <Avatar
                src={article?.userId.avatar}
                alt={article?.userId.name}
                sx={{ mr: 1.5 }}
              />
            ) : (
              <Avatar
                sx={{
                  background: randomColor,
                  mr: 1.5,
                }}
              >
                {article?.userId?.name.slice(0, 1).toUpperCase()}
              </Avatar>
            )}

            <Box>
              <Typography
                variant="subtitle1"
                component="span"
                sx={{
                  color: themeColors.text,
                  fontWeight: 600,
                  mr: 1,
                }}
              >
                {article?.userId?.name
                  ? article?.userId?.name.slice(0, 1).toUpperCase() +
                    article?.userId.name.slice(1)
                  : ""}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                <CalendarTodayIcon
                  fontSize="small"
                  sx={{
                    color: themeColors.textSecondary,
                    mr: 0.5,
                    fontSize: 16,
                  }}
                />
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ color: themeColors.textSecondary, mr: 2 }}
                >
                  {formatDate(article?.updatedAt)}
                </Typography>
                <VisibilityIcon
                  fontSize="small"
                  sx={{
                    color: themeColors.textSecondary,
                    mr: 0.5,
                    fontSize: 16,
                  }}
                />
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ color: themeColors.textSecondary }}
                >
                  {article?.viewsCount} views
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            gap={{ xs: "10px", sm: "16px" }}
          >
            {article?.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag?.charAt(0).toUpperCase() + tag?.slice(1)}
                size="small"
                sx={{
                  mb: 1,
                  padding: "20px",
                  bgcolor: themeColors.divider,
                  color: themeColors.text,
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: themeColors.text,
                    color: themeColors.background,
                  },
                }}
              />
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Article Content */}
      <Paper
        sx={{
          p: { xs: 2, md: 4 },
          mb: 4,
          bgcolor: themeColors.paper,
          borderRadius: 2,
          border: `1px solid ${themeColors.divider}`,
        }}
      >
        <Typography
          variant="body1"
          component="div"
          sx={{
            color: themeColors.text,
            lineHeight: 1.7,
            "& p": { mb: 2 },
            "& h2": {
              color: themeColors.text,
              mt: 4,
              mb: 2,
              fontWeight: 600,
            },
          }}
        >
          {articleSanitizedContent}
        </Typography>

        <Divider sx={{ my: 3, borderColor: themeColors.divider }} />

        {/* Article Actions */}
        <Grid container spacing={2} alignItems="center">
          <Grid>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Like">
                <IconButton
                  onClick={handleLike}
                  sx={{
                    color: userLiked
                      ? themeColors.primary
                      : themeColors.textSecondary,
                    "&:hover": { color: themeColors.primary },
                  }}
                >
                  <Badge badgeContent={article?.likes} color="primary">
                    <ThumbUpIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Dislike">
                <IconButton
                  onClick={handleDislike}
                  sx={{
                    color: userDisliked
                      ? themeColors.error
                      : themeColors.textSecondary,
                    "&:hover": { color: themeColors.error },
                  }}
                >
                  <Badge badgeContent={article?.dislikes} color="error">
                    <ThumbDownIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Share">
                <IconButton
                  onClick={handleShare}
                  sx={{
                    color: themeColors.textSecondary,
                    "&:hover": { color: themeColors.primary },
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>

          <Grid
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", sm: "flex-end" },
            }}
          >
            <Tooltip title={bookmarked ? "Remove Bookmark" : "Add Bookmark"}>
              <IconButton
                onClick={handleBookmark}
                sx={{
                  color: bookmarked
                    ? themeColors.primary
                    : themeColors.textSecondary,
                  "&:hover": { color: themeColors.primary },
                }}
              >
                {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
            </Tooltip>
            <Typography
              variant="body2"
              sx={{
                color: themeColors.textSecondary,
                display: "flex",
                alignItems: "center",
              }}
            >
              {getReadTime(articleSanitizedContent)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Comments Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          bgcolor: themeColors.paper,
          borderRadius: 2,
          border: `1px solid ${themeColors.divider}`,
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            mb: 3,
            color: themeColors.text,
            fontWeight: 600,
          }}
        >
          Comments ({comments.length})
        </Typography>

        {/* Add Comment */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "flex-start" }}>
          <Avatar
            sx={{
              background: `linear-gradient(90deg, ${themeColors.primary} 0%, ${themeColors.secondary} 50%, ${themeColors.primaryDark} 100%)`,
              mr: 1.5,
            }}
          >
            {article?.userId?.name.slice(0, 1).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{
                mb: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: themeColors.border,
                  },
                  "&:hover fieldset": {
                    borderColor: themeColors.primary,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: themeColors.primary,
                  },
                  bgcolor: themeColors.background,
                },
                "& .MuiInputBase-input": {
                  color: themeColors.text,
                },
              }}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              sx={{
                bgcolor: themeColors.primary,
                "&:hover": {
                  bgcolor: themeColors.primaryDark,
                },
                "&.Mui-disabled": {
                  bgcolor: themeColors.divider,
                  color: themeColors.textSecondary,
                },
              }}
            >
              Comment
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: themeColors.divider }} />

        <List sx={{ width: "100%", bgcolor: "transparent" }}>
          {comments.length === 0 ? (
            <Typography
              variant="body2"
              sx={{
                color: themeColors.textSecondary,
                textAlign: "center",
                mt: 2,
              }}
            >
              No comments to show
            </Typography>
          ) : (
            comments.map((comment, index) => (
              <React.Fragment key={index}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    px: 0,
                    mb: 1,
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Box sx={{ display: "flex", width: "100%" }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          background: `linear-gradient(90deg, ${themeColors.primary} 0%, ${themeColors.secondary} 50%, ${themeColors.primaryDark} 100%)`,
                          mr: 1.5,
                        }}
                      >
                        A
                      </Avatar>
                    </ListItemAvatar>
                    <Box sx={{ width: "100%" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: themeColors.text,
                              fontWeight: 600,
                            }}
                          >
                            {comment?.userId?.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: themeColors.textSecondary }}
                          >
                            {formatDate(comment?.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          color: themeColors.text,
                          lineHeight: 1.6,
                        }}
                      >
                        {comment?.text}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>

                {comments?.indexOf(comment) < comments?.length - 1 && (
                  <Divider sx={{ my: 2, borderColor: themeColors.divider }} />
                )}
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            mb: 3,
            color: themeColors.text,
            fontWeight: 600,
          }}
        >
          Related Articles
        </Typography>

        <Stack spacing={3}>
          {recentArticles?.map((item, index) => {
            const randomColor = getRandomColor();
            // Sanitize the content
            const sanitizedContent = DOMPurify.sanitize(item?.content || "");
            const plainText =
              new DOMParser().parseFromString(sanitizedContent, "text/html")
                .body.textContent || "";

            const truncatedContent =
              plainText.length > 50
                ? plainText.slice(0, 200) + "..."
                : plainText;

            return (
              <Link
                to={`/articles/singlepost/${article._id}`}
                underline="none"
                color="inherit"
                key={index}
                sx={{
                  display: "block",
                  transition: "color 0.3s ease",
                  "&:hover": {
                    color: themeColors.primary,
                  },
                }}
              >
                <Card
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    bgcolor: themeColors.paper,
                    border: `1px solid ${themeColors.divider}`,
                    borderRadius: 2,
                    transition:
                      "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: `0 8px 16px ${themeColors.shadow}`,
                    },
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: "100%", sm: 200 },
                      height: { xs: 180, sm: "auto" },
                      bgcolor: "primaryLight",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "primaryDark",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={item?.thumbnailImage}
                      alt="description"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: themeColors.primary,
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <CalendarTodayIcon sx={{ fontSize: 14, mr: 0.5 }} />
                        {formatDate(item?.createdAt)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: themeColors.textSecondary,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <VisibilityIcon sx={{ fontSize: 14, mr: 0.5 }} />
                        {item?.viewsCount} views
                      </Typography>
                    </Box>

                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: themeColors.text,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {item?.title}
                    </Typography>

                    {/* Render the sanitized and truncated content */}
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

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mt: "auto",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {item?.userId.avatar ? (
                          <Avatar
                            src={item?.userId.avatar}
                            alt={item?.userId.name}
                            sx={{ mr: 1.5 }}
                          />
                        ) : (
                          <Avatar
                            sx={{
                              background: randomColor,
                              mr: 1.5,
                            }}
                          >
                            {article?.userId?.name.slice(0, 1).toUpperCase()}
                          </Avatar>
                        )}

                        <Typography
                          variant="caption"
                          sx={{ color: themeColors.text, fontWeight: 500 }}
                        >
                          {article?.userId?.name.slice(0, 1).toUpperCase() +
                            article?.userId.name.slice(1)}
                        </Typography>
                      </Box>

                      <Typography
                        variant="caption"
                        sx={{
                          color: themeColors.textSecondary,
                          display: "flex",
                          alignItems: "center",
                          bgcolor: themeColors.divider,
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        {getReadTime(plainText)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </Stack>
      </Box>

      {/* Share Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: themeColors.paper,
            color: themeColors.text,
            width: { xs: "90%", sm: 400 },
          },
        }}
      >
        <DialogTitle sx={{ color: themeColors.text }}>
          Share Article
        </DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ mb: 2, color: themeColors.text }}>
            Share this article on:
          </Typography>
          <Grid container spacing={2}>
            <Grid>
              <IconButton
                sx={{
                  bgcolor: "#3b5998",
                  color: "#fff",
                  "&:hover": { bgcolor: "#2d4373" },
                }}
              >
                <FacebookIcon />
              </IconButton>
            </Grid>
            <Grid>
              <IconButton
                sx={{
                  bgcolor: "#1da1f2",
                  color: "#fff",
                  "&:hover": { bgcolor: "#0c85d0" },
                }}
              >
                <TwitterIcon />
              </IconButton>
            </Grid>
            <Grid>
              <IconButton
                sx={{
                  bgcolor: "#0077b5",
                  color: "#fff",
                  "&:hover": { bgcolor: "#00669c" },
                }}
              >
                <LinkedInIcon />
              </IconButton>
            </Grid>
            <Grid>
              <IconButton
                sx={{
                  bgcolor: "#25d366",
                  color: "#fff",
                  "&:hover": { bgcolor: "#128c7e" },
                }}
              >
                <WhatsAppIcon />
              </IconButton>
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: themeColors.background,
              borderRadius: 1,
            }}
          >
            <Typography
              variant="body2"
              component="div"
              sx={{
                fontFamily: "monospace",
                wordBreak: "break-all",
                color: themeColors.text,
              }}
            >
              {window.location.href}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShareDialogOpen(false)}
            sx={{ color: themeColors.textSecondary }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCopyLink}
            startIcon={<LinkIcon />}
            variant="contained"
            sx={{
              bgcolor: themeColors.primary,
              "&:hover": {
                bgcolor: themeColors.primaryDark,
              },
            }}
          >
            Copy Link
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ArticlePage;
