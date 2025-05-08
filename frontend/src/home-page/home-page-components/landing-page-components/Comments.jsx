import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Divider,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Paper,
} from "@mui/material";

// Import icons
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReplyIcon from "@mui/icons-material/Reply";
import SendIcon from "@mui/icons-material/Send";
import CommentIcon from "@mui/icons-material/Comment";

// Comments Section Component
const CommentsSection = ({ themeColors }) => {
  // State for comments
  const [comments, setComments] = useState([
    {
      id: 1,
      user: {
        id: 201,
        name: "Emma Wilson",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      text: "Great article! I particularly agree with your point about accessibility becoming standard practice.",
      timestamp: "2025-04-28T15:10:00",
      likes: 12,
      userLiked: false,
      replies: [
        {
          id: 101,
          user: {
            id: 202,
            name: "Michael Brown",
            avatar: "https://i.pravatar.cc/150?img=8",
          },
          text: "Absolutely! Accessibility should have been a priority from the beginning. Better late than never though.",
          timestamp: "2025-04-28T15:45:00",
          likes: 5,
          userLiked: false,
        },
      ],
    },
    {
      id: 2,
      user: {
        id: 203,
        name: "Sophia Garcia",
        avatar: "https://i.pravatar.cc/150?img=9",
      },
      text: "I'm curious how you think edge computing will impact application architecture in the coming years. Are there any specific patterns emerging?",
      timestamp: "2025-04-28T18:22:00",
      likes: 8,
      userLiked: false,
      replies: [],
    },
  ]);

  // State for expanded accordion
  const [expanded, setExpanded] = useState(false);

  // State for new comment
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle comment like
  const handleCommentLike = (commentId, isReply = false, parentId = null) => {
    if (isReply && parentId) {
      setComments(
        comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: comment.replies.map((reply) => {
                if (reply.id === commentId) {
                  return {
                    ...reply,
                    likes: reply.userLiked ? reply.likes - 1 : reply.likes + 1,
                    userLiked: !reply.userLiked,
                  };
                }
                return reply;
              }),
            };
          }
          return comment;
        })
      );
    } else {
      setComments(
        comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: comment.userLiked ? comment.likes - 1 : comment.likes + 1,
              userLiked: !comment.userLiked,
            };
          }
          return comment;
        })
      );
    }
  };

  // Handle accordion change
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Handle submit comment
  const handleSubmitComment = () => {
    if (newComment.trim() === "") return;

    const newCommentObj = {
      id: comments.length + 1,
      user: {
        id: 999,
        name: "Current User",
        avatar: "https://i.pravatar.cc/150?img=12",
      },
      text: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      userLiked: false,
      replies: [],
    };

    setComments([...comments, newCommentObj]);
    setNewComment("");
  };

  // Handle reply to comment
  const handleReplyToComment = (commentId) => {
    setReplyingTo(commentId);
    setReplyText("");
  };

  // Handle submit reply
  const handleSubmitReply = (commentId) => {
    if (replyText.trim() === "") return;

    const newReply = {
      id: Math.floor(Math.random() * 1000) + 100,
      user: {
        id: 999,
        name: "Current User",
        avatar: "https://i.pravatar.cc/150?img=12",
      },
      text: replyText,
      timestamp: new Date().toISOString(),
      likes: 0,
      userLiked: false,
    };

    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, newReply],
          };
        }
        return comment;
      })
    );

    setReplyingTo(null);
    setReplyText("");
  };

  return (
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
          sx={{ mr: 2 }}
          alt="Current User"
          src="https://i.pravatar.cc/150?img=12"
        />
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

      {/* Comments List as Accordions */}
      <List sx={{ width: "100%", bgcolor: "transparent" }}>
        {comments.map((comment) => (
          <Accordion
            key={comment.id}
            expanded={expanded === `comment-${comment.id}`}
            onChange={handleAccordionChange(`comment-${comment.id}`)}
            sx={{
              mb: 2,
              bgcolor: themeColors.background,
              border: `1px solid ${themeColors.divider}`,
              "&:before": {
                display: "none",
              },
              boxShadow: "none",
              borderRadius: "8px !important",
              overflow: "hidden",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: themeColors.primary }} />}
              sx={{
                px: 2,
                "&.Mui-expanded": {
                  borderBottom: `1px solid ${themeColors.divider}`,
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <Avatar alt={comment.user.name} src={comment.user.avatar} sx={{ mr: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: themeColors.text,
                        fontWeight: 600,
                      }}
                    >
                      {comment.user.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: themeColors.textSecondary }}
                    >
                      {formatDate(comment.timestamp)}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: themeColors.text,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {comment.text}
                  </Typography>
                </Box>
                <Badge 
                  badgeContent={comment.replies.length} 
                  color="primary"
                  sx={{ 
                    ml: 2,
                    "& .MuiBadge-badge": {
                      right: -10,
                      backgroundColor: comment.replies.length > 0 ? themeColors.primary : themeColors.divider,
                      color: "white",
                    }
                  }}
                >
                  <CommentIcon 
                    sx={{ 
                      color: comment.replies.length > 0 ? themeColors.primary : themeColors.textSecondary,
                      fontSize: 20,
                    }} 
                  />
                </Badge>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2, py: 3, bgcolor: themeColors.paper }}>
              <Typography
                variant="body2"
                sx={{
                  color: themeColors.text,
                  lineHeight: 1.6,
                  mb: 2,
                }}
              >
                {comment.text}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <IconButton
                  size="small"
                  onClick={() => handleCommentLike(comment.id)}
                  sx={{
                    color: comment.userLiked
                      ? themeColors.primary
                      : themeColors.textSecondary,
                    "&:hover": { color: themeColors.primary },
                  }}
                >
                  <ThumbUpIcon fontSize="small" />
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{ mr: 2, color: themeColors.textSecondary }}
                >
                  {comment.likes}
                </Typography>
                <Button
                  size="small"
                  startIcon={<ReplyIcon fontSize="small" />}
                  onClick={() => handleReplyToComment(comment.id)}
                  sx={{
                    color: themeColors.primary,
                    "&:hover": {
                      bgcolor: themeColors.purpleHoverBg || `${themeColors.primary}15`,
                    },
                  }}
                >
                  Reply
                </Button>
              </Box>

              {/* Replies to this comment */}
              {comment.replies.length > 0 && (
                <Box 
                  sx={{ 
                    ml: 2, 
                    pl: 2, 
                    borderLeft: `2px solid ${themeColors.divider}`,
                    mb: 3 
                  }}
                >
                  {comment.replies.map((reply) => (
                    <Box 
                      key={reply.id} 
                      sx={{ 
                        mb: 2,
                        pb: 2,
                        borderBottom: reply !== comment.replies[comment.replies.length - 1] ? 
                          `1px solid ${themeColors.divider}` : 'none',
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                        <Avatar
                          alt={reply.user.name}
                          src={reply.user.avatar}
                          sx={{ width: 30, height: 30, mr: 1.5 }}
                        />
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: themeColors.text,
                                fontWeight: 600,
                                fontSize: "0.875rem",
                              }}
                            >
                              {reply.user.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ ml: 1, color: themeColors.textSecondary }}
                            >
                              {formatDate(reply.timestamp)}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              mt: 0.5,
                              color: themeColors.text,
                              lineHeight: 1.6,
                            }}
                          >
                            {reply.text}
                          </Typography>
                          <Box
                            sx={{
                              mt: 1,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleCommentLike(reply.id, true, comment.id)
                              }
                              sx={{
                                color: reply.userLiked
                                  ? themeColors.primary
                                  : themeColors.textSecondary,
                                "&:hover": { color: themeColors.primary },
                                padding: "4px",
                              }}
                            >
                              <ThumbUpIcon sx={{ fontSize: "0.875rem" }} />
                            </IconButton>
                            <Typography
                              variant="body2"
                              sx={{ color: themeColors.textSecondary, fontSize: "0.75rem" }}
                            >
                              {reply.likes}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Reply input */}
              {replyingTo === comment.id && (
                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <Avatar
                    sx={{ mr: 1.5, width: 30, height: 30 }}
                    alt="Current User"
                    src="https://i.pravatar.cc/150?img=12"
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
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
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        size="small"
                        sx={{ mr: 1, color: themeColors.textSecondary }}
                        onClick={() => setReplyingTo(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        disabled={!replyText.trim()}
                        onClick={() => handleSubmitReply(comment.id)}
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
                        Reply
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </List>
    </Paper>
  );
};

export default CommentsSection;