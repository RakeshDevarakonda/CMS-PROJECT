import React from "react";
import { Skeleton, Box, TableBody, TableCell, TableRow } from "@mui/material";
import { globalReduxSelector } from "../global-redux/GlobalRedux";
import { useSelector } from "react-redux";

export default function ManageContentOnlyTableSkeleton({ manageuser }) {
  const { darkMode, userDetails } = useSelector(globalReduxSelector);
  const theme = darkMode ? "dark" : "light";
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
    <>
      <TableBody
        sx={{
          backgroundColor: colors.tableHeaderBg,
          borderBottom: `1px solid ${colors.background}`, // You need to specify width and style
          "&:last-child td, &:last-child th": { border: 0 }, // Remove border from last row
        }}
      >
        {[...Array(5)].map((_, index) => (
          <TableRow
            key={index}
            sx={{
              backgroundColor: colors.tableHeaderBg,
              borderBottom: `1px solid ${colors.background}`,
            }}
          >
            {!manageuser && (
              <>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Skeleton
                      variant="rectangular"
                      width={3}
                      height={40}
                      sx={{ mr: 1.5, background: colors.cardBackground }}
                    />
                    <Box>
                      <Skeleton
                        sx={{ background: colors.cardBackground }}
                        variant="text"
                        width="150px"
                      />
                      <Skeleton
                        sx={{ background: colors.cardBackground }}
                        variant="text"
                        width="100px"
                      />
                    </Box>
                  </Box>
                </TableCell>
               {userDetails?.role !=="admin" && (
                 <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Skeleton
                      variant="rectangular"
                      width={3}
                      height={40}
                      sx={{ mr: 1.5, background: colors.cardBackground }}
                    />
                    <Box>
                      <Skeleton
                        sx={{ background: colors.cardBackground }}
                        variant="text"
                        width="150px"
                      />
                      <Skeleton
                        sx={{ background: colors.cardBackground }}
                        variant="text"
                        width="100px"
                      />
                    </Box>
                  </Box>
                </TableCell>
               )}
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Skeleton
                      variant="rectangular"
                      width={3}
                      height={40}
                      sx={{ mr: 1.5, background: colors.cardBackground }}
                    />
                    <Box>
                      <Skeleton
                        sx={{ background: colors.cardBackground }}
                        variant="text"
                        width="150px"
                      />
                      <Skeleton
                        sx={{ background: colors.cardBackground }}
                        variant="text"
                        width="100px"
                      />
                    </Box>
                  </Box>
                </TableCell>
              </>
            )}

            <TableCell>
              <Box>
                <Skeleton
                  sx={{ background: colors.cardBackground }}
                  variant="text"
                  width="120px"
                />
                <Skeleton
                  sx={{ background: colors.cardBackground }}
                  variant="text"
                  width="80px"
                />
              </Box>
            </TableCell>

            <TableCell>
              <Box>
                <Skeleton
                  sx={{ background: colors.cardBackground }}
                  variant="text"
                  width="120px"
                />
                <Skeleton
                  sx={{ background: colors.cardBackground }}
                  variant="text"
                  width="80px"
                />
              </Box>
            </TableCell>

            {userDetails?.role !== "moderator" && userDetails?.role !== "creator" && (
              <TableCell>
                <Box>
                  <Skeleton
                    sx={{ background: colors.cardBackground }}
                    variant="text"
                    width="120px"
                  />
                  <Skeleton
                    sx={{ background: colors.cardBackground }}
                    variant="text"
                    width="80px"
                  />
                </Box>
              </TableCell>
            )}

            <TableCell>
              <Box>
                <Skeleton
                  sx={{ background: colors.cardBackground }}
                  variant="text"
                  width="120px"
                />
                <Skeleton
                  sx={{ background: colors.cardBackground }}
                  variant="text"
                  width="80px"
                />
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}
