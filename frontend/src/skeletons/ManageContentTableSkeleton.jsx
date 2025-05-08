import React from "react";
import {
  Skeleton,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
} from "@mui/material";
import ManageContentOnlyTableSkeleton from "./ManageContentOnlyTableSkeleton";
import { useSelector } from "react-redux";
import { globalReduxSelector } from "../global-redux/GlobalRedux";

const ManageContentTableSkeleton = () => {
  const { darkMode } = useSelector(globalReduxSelector);

  const theme = darkMode ? "dark" : "light";
  // Theme colors configuration
  const themeColors = {
    light: {
      background: "linear-gradient(to bottom, #f9fafd, #ffffff)",
      cardBackground: "#e3e1e1",
      textPrimary: "#1a1a2c",
      border: "#e2e8f0",
      tableHeaderBg: "#f8fafc",
      tableRowHover: "#f8fafc",
    },
    dark: {
      background: "#292929",
      cardBackground: "#3b3939",
      textPrimary: "#e1e1e1",
      border: "#3b393",
      tableHeaderBg: "#252525",
      tableRowHover: "#2a2a2a",
    },
  };

  const colors = themeColors[theme] || themeColors.light;

  return (
    <Box
      sx={{
        pb: 4,
        background: colors.background,
        padding: { xs: 2, md: 4 },
        border: `2px solid ${colors.cardBackground}`,
      }}
    >
      {/* Header Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Box>
          <Skeleton
            sx={{
              background: colors.cardBackground,
            }}
            variant="text"
            width="250px"
            height={40}
          />
          <Skeleton
            variant="text"
            width="200px"
            height={24}
            sx={{ background: colors.cardBackground, mt: 1 }}
          />
        </Box>
        <Skeleton
          sx={{
            background: colors.cardBackground,
          }}
          variant="circular"
          width={40}
          height={40}
        />
      </Box>

      {/* Filters Section */}
      <Card
        sx={{
          p: 3,
          mb: 3,
          borderRadius: "16px",
          backgroundColor: colors.background,
          border: `1px solid ${colors.cardBackground}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: 2,
          }}
        >
          {/* Search Filter */}
          <Skeleton
            variant="rounded"
            width="100%"
            height={40}
            sx={{ flex: 1, background: colors.cardBackground }}
          />

          {/* Status Filter */}
          <FormControl
            fullWidth
            size="small"
            sx={{ background: colors.cardBackground, minWidth: 120 }}
          >
            <InputLabel sx={{ background: colors.cardBackground }}>
              <Skeleton variant="text" width="80px" />
            </InputLabel>
            <Select
              sx={{ background: colors.cardBackground }}
              disabled
              value=""
            >
              <MenuItem
                sx={{ background: colors.cardBackground }}
                value=""
              ></MenuItem>
            </Select>
          </FormControl>

          {/* Date Filter */}
          <FormControl
            fullWidth
            size="small"
            sx={{ background: colors.cardBackground, minWidth: 120 }}
          >
            <InputLabel sx={{ background: colors.cardBackground }}>
              <Skeleton variant="text" width="80px" />
            </InputLabel>
            <Select
              sx={{ background: colors.cardBackground }}
              disabled
              value=""
            >
              <MenuItem
                sx={{ background: colors.cardBackground }}
                value=""
              ></MenuItem>
            </Select>
          </FormControl>

          {/* Clear Button */}
          <Skeleton
            sx={{ background: colors.cardBackground }}
            variant="rounded"
            width="120px"
            height={40}
          />
        </Box>

        {/* Applied Filters */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
          <Skeleton
            sx={{ background: colors.cardBackground }}
            variant="text"
            width="80px"
          />
          <Skeleton
            sx={{ background: colors.cardBackground }}
            variant="rounded"
            width="120px"
            height={32}
          />
          <Skeleton
            sx={{ background: colors.cardBackground }}
            variant="rounded"
            width="100px"
            height={32}
          />
        </Box>
      </Card>

      {/* Table Section */}
      <Card sx={{ borderRadius: "16px", overflow: "hidden" }}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 0,
            boxShadow: "none",
            backgroundColor: colors.background,
            overflowX: "auto", // Enable horizontal scrolling
            overflowY: "auto", // Keep vertical scrolling

            // Combined scrollbar styles for both directions
            scrollbarColor: `${colors.dialogBackground} ${colors.background}`, // Firefox

            // WebKit scrollbars (Chrome, Safari, Edge)
            "&::-webkit-scrollbar": {
              width: "50px", // Vertical scrollbar width
              height: "20px", // Horizontal scrollbar height
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgb(222, 222, 222)",
              borderRadius: "10px",
              "&:hover": {
                background: "#ffffff",
              },
            },
            // Horizontal scrollbar specific
            "&::-webkit-scrollbar:horizontal": {
              height: "5px",
            },
            "&::-webkit-scrollbar-thumb:horizontal": {
              backgroundColor: "rgb(222, 222, 222)",
              "&:hover": {
                backgroundColor: "#ffffff",
              },
            },
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: colors.tableHeaderBg,
                  borderBottom: `1px solid ${colors.background}`, // You need to specify width and style
                  "&:last-child td, &:last-child th": { border: 0 }, // Remove border from last row
                }}
              >
                {[...Array(7)].map((header, index) => (
                  <TableCell key={index}>
                    <Skeleton
                      sx={{ background: colors.cardBackground }}
                      variant="text"
                      width="100%"
                    />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <ManageContentOnlyTableSkeleton theme={theme} />
          </Table>
        </TableContainer>

        {/* Pagination Section */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: colors.tableHeaderBg,
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          <Skeleton
            sx={{ background: colors.cardBackground }}
            variant="text"
            width="120px"
          />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Skeleton
              sx={{ background: colors.cardBackground }}
              variant="rounded"
              width={32}
              height={32}
            />
            <Skeleton
              sx={{ background: colors.cardBackground }}
              variant="rounded"
              width={32}
              height={32}
            />
            <Skeleton
              sx={{ background: colors.cardBackground }}
              variant="rounded"
              width={32}
              height={32}
            />
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default ManageContentTableSkeleton;
