import React from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Skeleton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Stack,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useSelector } from "react-redux";
import { globalReduxSelector } from "../global-redux/GlobalRedux.jsx";
import { colors } from "../utils/Colors.jsx";
import DashboardStatsSkeleton from "./DashboardStatsSkeleton";

// Status colors and configuration similar to the main dashboard

const GlobalDashboardSkeleton = () => {
  const { darkMode } = useSelector(globalReduxSelector);
  const colorMode = darkMode ? "dark" : "light";
  const theme = colors[colorMode];

  const isMobile = useMediaQuery("(max-width:600px)");

  // Custom styling for MUI components to match your theme
  const customStyles = {
    container: {
      backgroundColor: theme.background,
      color: theme.text,
      minHeight: "100vh",
      py: 2,
      px: { xs: 2, sm: 3 },
    },
    card: {
      backgroundColor: theme.paper,
      boxShadow: `0 4px 8px ${theme.shadow}`,
      borderRadius: 1,
    },
    divider: {
      backgroundColor: theme.divider,
    },
    tableHead: {
      backgroundColor:
        colorMode === "light" ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.05)",
    },
    skeletonColor: {
      bgcolor: theme.paper + "80", // semi-transparent
    },
  };

  return (
    <Container maxWidth={false} disableGutters sx={customStyles.container}>
      {/* Header Skeleton */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          flexDirection: isMobile ? "column" : "row",
          mb: 3,
          pb: 2,
          borderBottom: `1px solid ${theme.divider}`,
        }}
      >
        <Skeleton
          variant="text"
          width={250}
          height={40}
          sx={customStyles.skeletonColor}
        />
      </Box>


      {/* Weekly Trend Chart Skeleton */}
      <Card sx={{ ...customStyles.card, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" component="div" sx={{ mb: 2 }}>
            <Skeleton
              variant="text"
              width={200}
              sx={customStyles.skeletonColor}
            />
          </Typography>
          <Box sx={{ height: 300 }}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={customStyles.skeletonColor}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Chart Grid Skeleton */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[0, 1].map((index) => (
          <Grid size={{ xs: 12, md: 6 }} key={index}>
            <Card sx={customStyles.card}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                  <Skeleton
                    variant="text"
                    width={180}
                    sx={customStyles.skeletonColor}
                  />
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Skeleton
                    width="100%"
                    height="100%"
                    sx={customStyles.skeletonColor}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Articles Table Skeleton */}
      <Card sx={customStyles.card}>
        <CardContent>
          <Typography variant="h6" component="div" sx={{ mb: 2 }}>
            <Skeleton
              variant="text"
              width={150}
              sx={customStyles.skeletonColor}
            />
          </Typography>
          <TableContainer
            component={Paper}
            sx={{
              ...customStyles.card,
              border: `1px solid ${theme.divider}`,
              "& .MuiTable-root": {
                borderCollapse: "collapse",
              },
              "& .MuiTableCell-root": {
                borderColor: theme.divider,
              },
            }}
          >
            <Table>
              <TableHead sx={customStyles.tableHead}>
                <TableRow>
                  {["Title", "Description", "Date", "Status"].map(
                    (header, index) => (
                      <TableCell key={index}>
                        <Skeleton
                          variant="text"
                          width={80}
                          height={24}
                          sx={customStyles.skeletonColor}
                        />
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array(5)
                  .fill(0)
                  .map((_, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        borderBottom: `1px solid ${theme.divider}`,
                        "& td, & th": { borderColor: theme.divider },
                      }}
                    >
                      <TableCell>
                        <Skeleton
                          variant="text"
                          width={150}
                          height={24}
                          sx={customStyles.skeletonColor}
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          variant="text"
                          width={200}
                          height={24}
                          sx={customStyles.skeletonColor}
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          variant="text"
                          width={100}
                          height={24}
                          sx={customStyles.skeletonColor}
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          variant="rounded"
                          width={80}
                          height={24}
                          sx={{
                            borderRadius: 4,
                            ...customStyles.skeletonColor,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default GlobalDashboardSkeleton;
