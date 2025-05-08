import React from "react";
import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { globalReduxSelector } from "../global-redux/GlobalRedux.jsx";
import { colors } from "../utils/Colors.jsx";

const DashboardStatsSkeleton = () => {
  const { darkMode } = useSelector(globalReduxSelector);
  const colorMode = darkMode ? "dark" : "light";
  const isDark = colorMode === "dark";



  const currentTheme = colors[colorMode];

  // Create an array of 6 placeholders to match the stats cards
  const placeholders = Array(6).fill(null);

  const styles = {
    container: {
      pb: 4,
      backgroundColor: currentTheme.background,
    },
    cardsContainer: {
      mb: 4,
      mt: 5,
      width: "95%",
      margin: "0 auto",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: { xs: 3, md: 4 },
    },
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.cardsContainer}>
        {placeholders.map((_, index) => (
          <SkeletonCard key={index} isDark={isDark} currentTheme={currentTheme} />
        ))}
      </Box>
    </Box>
  );
};

const SkeletonCard = ({ isDark, currentTheme }) => {
  const cardStyles = {
    card: {
      backgroundColor: currentTheme.paper,
      borderRadius: "16px",
      boxShadow: isDark 
        ? "0 12px 24px rgba(100, 100, 100, 0.2)" 
        : "0 12px 24px rgba(0, 0, 0, 0.1)",
      flex: {
        xs: "1 1 100%",
        sm: "1 1 45%",
        md: "1 1 30%",
        lg: "18%",
      },
      overflow: "hidden",
      position: "relative",
      backdropFilter: "blur(20px)",
    },
    cardHeader: {
      p: 2.5,
      display: "flex",
      alignItems: "center",
      gap: 2,
      borderBottom: `1px solid ${currentTheme.borderColor}`,
    },
    headerText: {
      width: "100%",
    },
  };

  return (
    <Card sx={cardStyles.card}>
      <Box sx={cardStyles.cardHeader}>
        <Skeleton 
          variant="rounded" 
          width={50} 
          height={50} 
          animation="wave"
          sx={{ borderRadius: "12px" }}
        />
        <Box sx={cardStyles.headerText}>
          <Skeleton variant="text" width="60%" height={32} animation="wave" />
          <Skeleton variant="text" width="80%" height={20} animation="wave" />
        </Box>
      </Box>

      <CardContent sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Skeleton variant="text" width="40%" height={60} animation="wave" />
        </Box>

        <Box sx={{ mb: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 0.75,
            }}
          >
            <Skeleton variant="text" width="30%" height={20} animation="wave" />
            <Skeleton variant="text" width="15%" height={20} animation="wave" />
          </Box>
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height={8} 
            animation="wave"
            sx={{ borderRadius: 4 }}
          />
        </Box>

        <Box sx={{ mt: 3, pt: 2, borderTop: `1px dashed ${currentTheme.borderColor}` }}>
          <Skeleton variant="text" width="70%" height={20} animation="wave" />
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardStatsSkeleton;