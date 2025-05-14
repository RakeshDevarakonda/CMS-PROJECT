import {
  Alert,
  Box,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { globalReduxSelector } from "../../global-redux/GlobalRedux";
import useManageContentFunctions from "./ManageContentFunctions";
import { Close, FilterList, InsertChart, Refresh } from "@mui/icons-material";
import {
  manageContentSelector,
  setContentShowFilter,
  setVersionposts,
} from "../../global-redux/ManageContentSlice";

export default function ManageContentHeader({
  adminrefresh,
  moderatorrefresh,
  createrrefresh,
  setRefreshKey,
  manageuser,
  usersRefetch,
}) {
  const { darkMode, userDetails } = useSelector(globalReduxSelector);
  const theme = darkMode ? "dark" : "light";
  const { themeColors } = useManageContentFunctions();

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const colors = themeColors[theme];

  const dispatch = useDispatch();

  const {
    contentDataCount,
    contentRowsPerPage,
    contentShowFilter,
    contentCurrentPageNumber,
    totalPages,
    contentTotalData,
  } = useSelector(manageContentSelector);
  return (
    <>
      {/* Table Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.5rem", md: "1.75rem" },
              color: colors.textPrimary,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <InsertChart sx={{ color: "#4361ee" }} /> Manage Content
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: colors.textSecondary, mt: 0.5 }}
          >
            Total {contentDataCount?.totalCount} Articles • Page{" "}
            {contentCurrentPageNumber + 1} of {totalPages}
          </Typography>
        </Box>

        <Box>
          <Tooltip
            arrow
            title="Filters"
            placement="top"
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: theme === "dark" ? "#1e1e1e" : "#ffffff",
                  color: colors.textPrimary,
                  boxShadow:
                    theme === "light"
                      ? "0 4px 20px rgba(0,0,0,0.05)"
                      : "0 4px 20px rgba(0,0,0,0.2)",
                  "& .MuiTooltip-arrow": {
                    color: theme === "dark" ? "#1e1e1e" : "#ffffff",
                  },
                },
              },
            }}
          >
            <IconButton
              onClick={() => dispatch(setContentShowFilter(!contentShowFilter))}
              aria-label="filter list"
              sx={{ color: colors.textPrimary }}
            >
              <FilterList sx={{ fontSize: "1.5rem" }} />
            </IconButton>
          </Tooltip>

          <Tooltip
            arrow
            title="Refresh"
            placement="top"
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: theme === "dark" ? "#1e1e1e" : "#ffffff",
                  color: colors.textPrimary,
                  boxShadow:
                    theme === "light"
                      ? "0 4px 20px rgba(0,0,0,0.05)"
                      : "0 4px 20px rgba(0,0,0,0.2)",
                  "& .MuiTooltip-arrow": {
                    color: theme === "dark" ? "#1e1e1e" : "#ffffff",
                  },
                },
              },
            }}
          >
            <IconButton
              onClick={() => {
                setOpen(true);
                if (!manageuser) {
                  dispatch(setVersionposts({}));
                  setRefreshKey(Date.now());
                  if (userDetails?.role === "creator") {
                    createrrefresh();
                  } else if (userDetails?.role === "moderator") {
                    moderatorrefresh();
                  } else if (userDetails?.role === "admin") {
                    adminrefresh();
                  }
                }
                if (manageuser) {
                  usersRefetch();
                }
              }}
              aria-label="filter list"
              sx={{ color: colors.textPrimary }}
            >
              <Refresh sx={{ fontSize: "1.5rem" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Snackbar
        open={open}
        onClose={(event, reason) => {
          if (reason !== "clickaway") {
            setOpen(false);
          }
        }}
        autoHideDuration={1000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Refreshed
        </Alert>
      </Snackbar>
    </>
  );
}
