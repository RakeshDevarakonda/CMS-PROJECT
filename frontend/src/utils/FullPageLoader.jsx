// FullPageLoader.js
import { Box, CircularProgress, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import {  globalReduxSelector } from "../global-redux/GlobalRedux.jsx";



export const FullPageLoader = ({text}) => {
  const { darkMode } = useSelector(globalReduxSelector);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: darkMode ? "#121212" : "#f5f5f5",
        transition: "background-color 0.3s ease",
      }}
    >
      <CircularProgress
        size={60}
        sx={{
          color: darkMode ? "#90caf9" : "#1976d2",
          mb: 2,
        }}
      />
      <Typography
        variant="body1"
        sx={{
          color: darkMode ? "#e0e0e0" : "#333",
          mt: 2,
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};
