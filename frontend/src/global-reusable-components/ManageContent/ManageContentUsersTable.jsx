import {
  ArrowForward,
  Block,
  CheckCircle,
  RemoveRedEye,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Switch,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { globalReduxSelector } from "../../global-redux/GlobalRedux";
import useManageContentFunctions from "./ManageContentFunctions";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import { updateUsersAccountMutation } from "../../admin/admin-tanstack-mutations/UpdateUsersAccountMutation";
import { useNavigate } from "react-router-dom";
import {
  setContentSearchUsername,
  setFinalSearchUsername,
  setSelectedFilterType,
  toggleIsSearchModeratorName,
} from "../../global-redux/ManageContentSlice";

// IOSSwitch styled component
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#65C466",
        opacity: 1,
        border: 0,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export default function ManageContentUsersTable({ usersData, userDataType }) {
  const getColor = (isActive) => {
    if (isActive) {
      return {
        bgColor: "#90be6d",
        gradientFrom: "#20c997",
        gradientTo: "#198754",
        icon: <CheckCircle fontSize="small" />,
        lightBg: "#19875415",
      };
    } else {
      return {
        bgColor: "#dc3545",
        gradientFrom: "#ff6b6b",
        gradientTo: "#dc3545",
        icon: <Block fontSize="small" />,
        lightBg: "#dc354515",
      };
    }
  };
  const { darkMode, userDetails } = useSelector(globalReduxSelector);
  const theme = darkMode ? "dark" : "light";

  const { themeColors, handleopurtunitydetails } = useManageContentFunctions();

  const colors = themeColors[theme];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate: updateAccountStatus } = updateUsersAccountMutation();

  const handleSwitchChange = (userId) => {
    updateAccountStatus(userId);
  };

  return (
    <>
      {usersData.length === 0 ? (
        <TableRow>
          <TableCell colSpan={4} align="center">
            <Typography variant="body1" sx={{ color: "gray", py: 2 }}>
              No users found
            </Typography>
          </TableCell>
        </TableRow>
      ) : (
        usersData.map((userData, index) => {
          const statusStyle = getColor(userData.isActive);

          return (
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
                  <Typography
                    fontWeight="700"
                    sx={{ color: colors.textPrimary }}
                  >
                    {userData.name}
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
                    sx={{ color: colors.textPrimary }}
                  >
                    {userData.email}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell align="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography
                    sx={{
                      color: userData?.isActive == true ? "green" : "red",
                      minWidth: 100,
                      textAlign: "end",
                      fontWeight: "bolder",
                    }}
                  >
                    {userData?.isActive == true ? "Active" : "InActive"}
                  </Typography>

                  <FormControlLabel
                    control={
                      <IOSSwitch
                        checked={userData.isActive}
                        onChange={() => handleSwitchChange(userData._id)} // Update user status when toggled
                      />
                    }
                    label=""
                  />
                </Stack>
              </TableCell>

              <TableCell
                align="center"
                sx={{ padding: "4px", whiteSpace: "nowrap" }}
              >
                {/* <Tooltip arrow title="View Details">
                  <IconButton
                    onClick={() => handleopurtunitydetails(userData)}
                    sx={{
                      background: `linear-gradient(135deg, ${statusStyle.gradientFrom}20, ${statusStyle.gradientTo}20)`,
                      color: statusStyle.bgColor,
                      marginRight: "30px",
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
                </Tooltip> */}

                <Tooltip arrow title="View Posts" placement="top">
                  <Button
                    variant="outlined"
                    startIcon={<ArrowForward fontSize="small" />}
                    size="small"
                    onClick={() => {
                      if (userDataType) {
                        navigate(
                          `/${userDetails?.role}/managecontent/allcontent`
                        );
                      }
                      if (userData?.role === "creator") {
                        dispatch(setSelectedFilterType("Creator Posts"));
                      } else if (userData?.role === "moderator") {
                        dispatch(setSelectedFilterType("Moderator Posts"));
                        dispatch(toggleIsSearchModeratorName("true"));
                      } else if (userData?.role === "admin") {
                        dispatch(setSelectedFilterType("Admin Posts"));
                      }

                      if (userDataType && userDataType == "moderator") {
                        dispatch(toggleIsSearchModeratorName("true"));
                      } else {
                        dispatch(toggleIsSearchModeratorName("false"));
                      }
                      dispatch(setContentSearchUsername(userData.name));
                      dispatch(setFinalSearchUsername(userData.name));
                    }}
                    sx={{
                      fontWeight: 500,
                      textTransform: "none",
                      borderRadius: "6px",
                      padding: "4px 12px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        backgroundColor: (theme) => theme.palette.primary.light,
                        color: "#ffffff",
                      },
                    }}
                  >
                    View Posts
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          );
        })
      )}
    </>
  );
}
