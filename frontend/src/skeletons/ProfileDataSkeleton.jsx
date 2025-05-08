import { Box, Paper, Skeleton } from "@mui/material";
import React from "react";
import { colors } from "../utils/Colors";
import { useSelector } from "react-redux";
import { globalReduxSelector } from "../global-redux/GlobalRedux";

export default function ProfileDataSkeleton() {
  const { darkMode: isDark } = useSelector(globalReduxSelector);
  const mode = isDark ? "dark" : "light";
  const currentColors = colors[mode];
  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
        sx={{
          bgcolor: currentColors.background,
          color: currentColors.text,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: 500,
            borderRadius: 3,
            p: 4,
            bgcolor: currentColors.paper,
            boxShadow: `0px 4px 20px ${currentColors.shadow}`,
          }}
        >
          <Box display="flex" justifyContent="center" mb={3}>
            <Skeleton variant="circular" width={100} height={100} />
          </Box>
          <Skeleton
            variant="text"
            height={40}
            width="60%"
            sx={{ mx: "auto" }}
          />
          <Box mt={3}>
            <Skeleton
              variant="rectangular"
              height={56}
              sx={{ mb: 2, borderRadius: 2 }}
            />
            <Skeleton
              variant="rectangular"
              height={56}
              sx={{ mb: 2, borderRadius: 2 }}
            />
            <Skeleton
              variant="rectangular"
              height={56}
              sx={{ mb: 2, borderRadius: 2 }}
            />
            <Skeleton
              variant="rectangular"
              height={56}
              sx={{ mb: 2, borderRadius: 2 }}
            />
          </Box>
          <Box mt={4} display="flex" justifyContent="space-between">
            <Skeleton
              variant="rectangular"
              width="45%"
              height={40}
              sx={{ borderRadius: 2 }}
            />
            <Skeleton
              variant="rectangular"
              width="45%"
              height={40}
              sx={{ borderRadius: 2 }}
            />
          </Box>
        </Paper>
      </Box>
    </>
  );
}
