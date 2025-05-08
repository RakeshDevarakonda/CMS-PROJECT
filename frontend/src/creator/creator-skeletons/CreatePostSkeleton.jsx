import React, { useRef, useState, useEffect } from "react";
import { colors } from "../../utils/Colors.jsx";
import {
  Box,
  Paper,
  Container,
  Divider,
  Stack,
  useMediaQuery,
  Skeleton,
} from "@mui/material";

const CreatePostSkeleton = () => {
  const mode = "dark";
  // Use colors based on mode
  const colorScheme = colors[mode] || colors.light;
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper
        elevation={3}
        sx={{
          padding: { xs: 2, sm: 4 },
          borderRadius: 3,
          backgroundColor: colorScheme.paper,
          border: `1px solid ${alpha(colorScheme.primary, 0.1)}`,
          boxShadow: `0 4px 20px ${colorScheme.shadow}`,
        }}
      >
        {/* Header Skeleton */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Skeleton
            variant="text"
            width="60%"
            height={48}
            sx={{
              mx: "auto",
              bgcolor: colorScheme.background,
            }}
          />
          <Skeleton
            variant="text"
            width="80%"
            height={24}
            sx={{
              mx: "auto",
              mt: 1,
              bgcolor: colorScheme.background,
            }}
          />
          <Divider
            sx={{
              mt: 2,
              backgroundColor: colorScheme.divider,
              width: "100px",
              mx: "auto",
              height: "2px",
              borderRadius: "1px",
              opacity: 0.7,
            }}
          />
        </Box>

        {/* Title Input Skeleton */}
        <Box sx={{ mb: 4 }}>
          <Skeleton
            variant="text"
            width="20%"
            height={24}
            sx={{
              mb: 1,
              bgcolor: colorScheme.background,
            }}
          />
          <Skeleton
            variant="rectangular"
            height={56}
            sx={{
              borderRadius: 2,
              bgcolor: alpha(colorScheme.background, 0.4),
            }}
          />
        </Box>

        {/* Tags Input Skeleton */}
        <Box sx={{ mb: 4 }}>
          <Skeleton
            variant="text"
            width="10%"
            height={24}
            sx={{
              mb: 1,
              bgcolor: colorScheme.background,
            }}
          />

          {/* Tag Input Skeleton */}
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Skeleton
              variant="rectangular"
              height={56}
              sx={{
                flexGrow: 1,
                borderRadius: 2,
                bgcolor: alpha(colorScheme.background, 0.4),
              }}
            />
            <Skeleton
              variant="rectangular"
              width={120}
              height={56}
              sx={{
                borderRadius: 2,
              }}
            />
          </Box>

          {/* Tags Display Skeleton */}
        
        </Box>

        {/* Editor Skeleton */}
        <Box sx={{ mb: 4 }}>
          <Skeleton
            variant="text"
            width="20%"
            height={24}
            sx={{
              mb: 1,
              bgcolor: colorScheme.background,
            }}
          />
          <Skeleton
            variant="rectangular"
            height={500}
            sx={{
              borderRadius: 2,
              border: `1px solid ${colorScheme.divider}`,
              bgcolor: colorScheme.paper,
            }}
          />
        </Box>

        {/* Action Buttons Skeleton */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
            mt: 4,
          }}
        >
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            sx={{
              order: isMobile ? 1 : 2,
              width: isMobile ? "100%" : "auto",
            }}
          >
            <Skeleton
              variant="rectangular"
              width={150}
              height={44}
              sx={{
                borderRadius: 2,
              }}
            />
            <Skeleton
              variant="rectangular"
              width={150}
              height={44}
              sx={{
                borderRadius: 2,
              }}
            />
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

// Helper function to create alpha version of colors (same as original)
const alpha = (color, opacity) => {
  // For RGB colors
  if (color.startsWith("rgb") && !color.startsWith("rgba")) {
    // Extract the RGB values
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const [, r, g, b] = match;
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  }

  // For hex colors
  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // Return as is for already rgba colors or other formats
  return color;
};

export default CreatePostSkeleton;
