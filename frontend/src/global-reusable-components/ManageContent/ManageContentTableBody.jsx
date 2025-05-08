import {
  AccessTime,
  Block,
  BusinessCenter,
  CalendarToday,
  CheckCircle,
  Delete,
  Edit,
  HourglassEmpty,
  Info,
  KeyboardArrowDown,
  RemoveRedEye,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  IconButton,
  MenuItem,
  Select,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { globalReduxSelector } from "../../global-redux/GlobalRedux";
import useManageContentFunctions from "./ManageContentFunctions";
import { useSelector } from "react-redux";
import { manageContentSelector } from "../../global-redux/ManageContentSlice";

export default function ManageContentTableBody({
  opportunity,
  index,
  statusStyle,
}) {
  const { darkMode } = useSelector(globalReduxSelector);

  const { versionList } = useSelector(manageContentSelector);
  const theme = darkMode ? "dark" : "light";

  const { userDetails } = useSelector(globalReduxSelector);

  const {
    themeColors,
    handleAdminStatusChange,
    handleModeratorStatusChange,

    formatDate,
    formatTime,
    handleVersionChange,
    handleopurtunitydetails,
    handleEditOpportunity,
    handleDeleteOpportunity,
    handleVeiwReason,
  } = useManageContentFunctions();
  const colors = themeColors[theme];
  return (
    <>
      <TableRow
        key={index}
        sx={{
          backgroundColor: colors.background,
          "&:hover": {
            backgroundColor: colors.tableRowHover,
          },
        }}
      >
        <TableCell>
          <Box
            sx={{
              borderLeft: `3px solid ${statusStyle.bgColor}`,
              pl: 2,
              ml: 0.5,
            }}
          >
            <Typography fontWeight="700" sx={{ color: colors.textPrimary }}>
              {opportunity.title.slice(0,15)}...
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              {opportunity.content
                ? `${opportunity.content
                    .replace(/<[^>]+>/g, "")
                    .slice(0, 25)}...`
                : ""}
            </Typography>
          </Box>
        </TableCell>

        <TableCell>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 0.5,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: colors.textPrimary,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {opportunity.userId.name}({opportunity.createdBy})
            </Typography>
          </Box>
        </TableCell>

        <TableCell>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 0.5,
            }}
          >
            <CalendarToday fontSize="small" sx={{ color: "#4361ee" }} />
            <Typography variant="body2" sx={{ color: colors.textPrimary }}>
              {formatDate(opportunity.updatedAt)}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              ml: 3.35,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: colors.textSecondary,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <AccessTime sx={{ fontSize: "0.9rem" }} />
              {formatTime(opportunity.updatedAt)}
            </Typography>
          </Box>
        </TableCell>

        {userDetails?.role == "creator" && (
          <TableCell align="center">
            <Chip
              icon={React.cloneElement(statusStyle.icon, {
                sx: {
                  color: statusStyle.bgColor,
                  minWidth: "35px",
                },
              })}
              label={
                opportunity.status.charAt(0).toUpperCase() +
                opportunity.status.slice(1)
              }
              sx={{
                width: "120px", // Set fixed width for all chips
                justifyContent: "flex-start", // Align content nicely
                backgroundColor:
                  theme === "light" ? "white" : colors.inputBackground,
                color: statusStyle.bgColor,
                border: `1px solid ${statusStyle.bgColor}30`,
                fontWeight: 600,
                "& .MuiChip-icon": {
                  color: statusStyle.bgColor,
                },
              }}
            />
          </TableCell>
        )}

        {userDetails?.role == "moderator" && (
          <TableCell align="center">
            <Select
              value={opportunity.status}
              onChange={(e) =>
                handleModeratorStatusChange(
                  opportunity._id,
                  e.target.value,
                  opportunity.source,
                  opportunity.version
                )
              }
              sx={{
                width: "160px",
                backgroundColor: colors.background,

                fontWeight: 600,
                borderRadius: "8px",
                border: `1px solid ${statusStyle.bgColor}30`,
                color: statusStyle.bgColor,
                ".MuiSelect-select": {
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                },
                "& .MuiSvgIcon-root.MuiSelect-icon": {
                  color: statusStyle.bgColor,
                },
                "&:hover": {
                  borderColor: colors.border,
                },
                "&:focus-within": {
                  boxShadow: `0 0 0 2px ${colors.shadow}`,
                },
                transition: "all 0.2s ease-in-out",
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderRadius: "6px",
                    boxShadow: `0 4px 20px ${colors.shadow}`,
                    overflow: "hidden",
                  },
                },
              }}
              IconComponent={(props) => <KeyboardArrowDown {...props} />}
            >
              {opportunity.status !== "approved" &&
                opportunity.status !== "rejected" && (
                  <MenuItem
                    value="pending"
                    sx={{
                      color: colors.textSecondary,
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      "&:hover": {
                        backgroundColor: colors.border,
                      },
                      "&.Mui-selected": {
                        backgroundColor: `${colors.divider}`,
                      },
                    }}
                  >
                    <HourglassEmpty
                      sx={{
                        fontSize: 18,
                        color: `${statusStyle.bgColor}`,
                      }}
                    />
                    Pending
                  </MenuItem>
                )}

              <MenuItem
                value="approved"
                sx={{
                  color: "green",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  "&:hover": {
                    backgroundColor: colors.border,
                  },
                  "&.Mui-selected": {
                    backgroundColor: `${colors.divider}`,
                  },
                }}
              >
                <CheckCircle
                  sx={{
                    fontSize: 18,
                    color: "green",
                  }}
                />
                Approve
              </MenuItem>
              <MenuItem
                value="rejected"
                sx={{
                  color: "red",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  "&:hover": {
                    backgroundColor: colors.border,
                  },
                  "&.Mui-selected": {
                    backgroundColor: `${colors.divider}`,
                  },
                }}
              >
                <Block
                  sx={{
                    fontSize: 18,
                    color: "red",
                  }}
                />
                Reject
              </MenuItem>
            </Select>
          </TableCell>
        )}

        {userDetails?.role == "admin" && (
          <TableCell align="center">
            <Select
              value={opportunity.status}
              onChange={(e) =>
                handleAdminStatusChange(
                  opportunity._id,
                  e.target.value,
                  opportunity.source,
                  opportunity.version
                )
              }
              sx={{
                width: "160px",
                backgroundColor: colors.background,

                fontWeight: 600,
                borderRadius: "8px",
                border: `1px solid ${statusStyle.bgColor}30`,
                color: statusStyle.bgColor,
                ".MuiSelect-select": {
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                },
                "& .MuiSvgIcon-root.MuiSelect-icon": {
                  color: statusStyle.bgColor,
                },
                "&:hover": {
                  borderColor: colors.border,
                },
                "&:focus-within": {
                  boxShadow: `0 0 0 2px ${colors.shadow}`,
                },
                transition: "all 0.2s ease-in-out",
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderRadius: "6px",
                    boxShadow: `0 4px 20px ${colors.shadow}`,
                    overflow: "hidden",
                  },
                },
              }}
              IconComponent={(props) => <KeyboardArrowDown {...props} />}
            >
              {opportunity.status === "pending" && [
                <MenuItem
                  value="pending"
                  sx={{
                    color: " #ffc107",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    "&:hover": {
                      backgroundColor: colors.border,
                    },
                    "&.Mui-selected": {
                      backgroundColor: `${colors.divider}`,
                    },
                  }}
                >
                  <HourglassEmpty
                    sx={{
                      fontSize: 18,
                      color: "#ffc107",
                    }}
                  />
                  Pending
                </MenuItem>,
              ]}

              {opportunity.status === "draft" && (
                <MenuItem
                  value="draft"
                  sx={{
                    color: "#4cc9f0",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    "&:hover": {
                      backgroundColor: colors.border,
                    },
                    "&.Mui-selected": {
                      backgroundColor: `${colors.divider}`,
                    },
                  }}
                >
                  <BusinessCenter
                    sx={{
                      fontSize: 18,
                      color: "#4cc9f0",
                    }}
                  />
                  Draft
                </MenuItem>
              )}

              {opportunity.status !== "draft" && [
                <MenuItem
                  value="approved"
                  sx={{
                    color: "green",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    "&:hover": {
                      backgroundColor: colors.border,
                    },
                    "&.Mui-selected": {
                      backgroundColor: `${colors.divider}`,
                    },
                  }}
                >
                  <CheckCircle
                    sx={{
                      fontSize: 18,
                      color: "green",
                    }}
                  />
                  Approve
                </MenuItem>,
                <MenuItem
                  value="rejected"
                  sx={{
                    color: "red",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    "&:hover": {
                      backgroundColor: colors.border,
                    },
                    "&.Mui-selected": {
                      backgroundColor: `${colors.divider}`,
                    },
                  }}
                >
                  <Block
                    sx={{
                      fontSize: 18,
                      color: "red",
                    }}
                  />
                  Reject
                </MenuItem>,
              ]}
            </Select>
          </TableCell>
        )}

        {userDetails?.role !== "creator" && (
          <TableCell>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  width: "100%",
                  color: colors.textPrimary,
                  display: "flex",
                  flexDirection: "column", // makes <br /> cleaner
                  textAlign: "center",
                  gap: 0.5,
                }}
              >
                {opportunity?.moderatedBy && opportunity?.moderatedBy.length > 0
                  ? (() => {
                      const lastModerator =
                        opportunity.moderatedBy[
                          opportunity.moderatedBy.length - 1
                        ];
                      const checkIsModeratorPresent =
                        opportunity.moderatedBy.some(
                          (e) => e.role === "moderator"
                        );

                      if (
                        checkIsModeratorPresent &&
                        lastModerator?.user?.role === "admin"
                      ) {
                        return (
                          <>
                            <b>Admin</b>
                            (Admin changed status of this post)
                          </>
                        );
                      }

                      const lastModeratorRole = lastModerator?.role;
                      if (
                        userDetails?.role === "moderator" &&
                        lastModeratorRole !== "moderator"
                      ) {
                        return (
                          <>
                            <b>Admin</b>
                            (Admin changed status of this post)
                          </>
                        );
                      }

                      const formattedName =
                        lastModerator?.user?.name.charAt(0).toUpperCase() +
                        lastModerator?.user?.name.slice(1);
                      const formattedRole =
                        lastModerator?.role.charAt(0).toUpperCase() +
                        lastModerator?.role.slice(1);

                      return `${formattedName} (${formattedRole})`;
                    })()
                  : "Not Moderated Yet"}
              </Typography>
            </Box>
          </TableCell>
        )}

        {userDetails?.role != "moderator" && (
          <TableCell align="center">
            <Select
              value={
                versionList[opportunity._id]?.selected ?? opportunity.version
              }
              onChange={(e) => {
                const selectedVersion = e.target.value;

                const originalOne = versionList[opportunity._id]?.original;

                const theSource =
                  selectedVersion === originalOne ? "post" : "posthistoru";

                handleVersionChange({
                  source: theSource,
                  version: selectedVersion,
                  id: opportunity._id,
                  index,
                });
              }}
              sx={{
                width: "80px",
                backgroundColor: colors.background,
                fontWeight: 600,
                borderRadius: "8px",
                border: `1px solid ${statusStyle.bgColor}30`,
                color: statusStyle.bgColor,
                ".MuiSelect-select": {
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                },
                "& .MuiSvgIcon-root.MuiSelect-icon": {
                  color: statusStyle.bgColor,
                },
                "&:hover": {
                  borderColor: colors.border,
                },
                "&:focus-within": {
                  boxShadow: `0 0 0 2px ${colors.shadow}`,
                },
                transition: "all 0.2s ease-in-out",
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: colors.background,
                    color: statusStyle.bgColor,
                    borderRadius: "6px",
                    boxShadow: `0 4px 20px ${colors.shadow}`,
                    overflow: "hidden",
                  },
                },
              }}
              IconComponent={(props) => <KeyboardArrowDown {...props} />}
            >
              {[
                ...Array(
                  versionList[opportunity._id]?.original ?? opportunity.version
                ),
              ].map((_, index) => {
                const versionNumber =
                  (versionList[opportunity._id]?.original ??
                    opportunity.version) - index;
                return (
                  <MenuItem
                    key={versionNumber}
                    value={versionNumber}
                    sx={{
                      color: colors.text,
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      "&:hover": {
                        backgroundColor: colors.border,
                      },
                      "&.Mui-selected": {
                        backgroundColor: `${colors.divider}`,
                      },
                    }}
                  >
                    {versionNumber}
                  </MenuItem>
                );
              })}
            </Select>
          </TableCell>
        )}

        <TableCell align="center" sx={{ padding: "4px", whiteSpace: "nowrap" }}>
          <Tooltip arrow title="View Details">
            <IconButton
              onClick={() => handleopurtunitydetails(opportunity)}
              sx={{
                background: `linear-gradient(135deg, ${statusStyle.gradientFrom}20, ${statusStyle.gradientTo}20)`,
                color: statusStyle.bgColor,
                margin: "0 2px",
                transition: "all 0.2s ease",
                "&:hover": {
                  background: `linear-gradient(135deg, ${statusStyle.gradientFrom}, ${statusStyle.gradientTo})`,
                  color: "white",
                  transform: "scale(1.1)",
                },
              }}
              size="small"
            >
              <RemoveRedEye fontSize="small" />
            </IconButton>
          </Tooltip>

          {opportunity.status !== "rejected" &&
            opportunity.status !== "deleted" &&
            userDetails?.role !== "moderator" &&
            userDetails?.role === opportunity.createdBy &&
            versionList[opportunity._id]?.original ===
              versionList[opportunity._id]?.selected && (
              <Tooltip arrow title="Edit">
                <IconButton
                  onClick={() =>
                    handleEditOpportunity(opportunity, opportunity.version)
                  }
                  sx={{
                    background: "rgba(25, 118, 210, 0.1)",
                    color: "#1976d2",
                    margin: "0 2px",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      background: "#1976d2",
                      color: "white",
                      transform: "scale(1.1)",
                    },
                  }}
                  size="small"
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

          {userDetails?.role != "moderator" &&
            opportunity.status !== "rejected" &&
            userDetails?.role === opportunity.createdBy &&
            versionList[opportunity._id]?.original ===
              versionList[opportunity._id]?.selected && (
              <Tooltip arrow title="Delete">
                <IconButton
                  onClick={() =>
                    handleDeleteOpportunity(
                      opportunity._id,
                      opportunity.version
                    )
                  }
                  sx={{
                    background: "rgba(211, 47, 47, 0.1)",
                    color: "#d32f2f",
                    margin: "0 2px",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      background: "#d32f2f",
                      color: "white",
                      transform: "scale(1.1)",
                    },
                  }}
                  size="small"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

          {opportunity.status === "rejected" && (
            <Tooltip arrow title="Reason">
              <IconButton
                onClick={() => handleVeiwReason(opportunity.reason)}
                sx={{
                  background: "rgba(211, 47, 47, 0.1)",
                  color: "#d32f2f",
                  margin: "0 2px",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: "#d32f2f",
                    color: "white",
                    transform: "scale(1.1)",
                  },
                }}
                size="small"
              >
                <Info fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
    </>
  );
}
