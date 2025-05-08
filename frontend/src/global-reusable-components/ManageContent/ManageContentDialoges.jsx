import { CalendarMonth, DateRange, Event } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";
import useManageContentFunctions from "./ManageContentFunctions";
import {
  manageContentSelector,
  setContentCustomEndDate,
  setContentCustomStartDate,
} from "../../global-redux/ManageContentSlice";
import { useDispatch, useSelector } from "react-redux";
import { globalReduxSelector } from "../../global-redux/GlobalRedux";

export default function ManageContentFunctions() {
  const { darkMode } = useSelector(globalReduxSelector);
  const theme = darkMode ? "dark" : "light";

  
  const {
    applyCustomDateRange,
    quickDateRanges,
    themeColors,
    
    handleCloseDateDialog,
    
    handleDateInputChange,
  } = useManageContentFunctions();
  const colors = themeColors[theme];

  const dispatch = useDispatch();

  const { contentOpenDateDialog,contentCustomStartDate ,contentCustomEndDate} = useSelector(manageContentSelector);
  return (
    <>
      <Dialog
        open={contentOpenDateDialog}
        onClose={handleCloseDateDialog}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: colors.dialogBackground,
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: colors.cardBackground,
            borderBottom: `1px solid ${colors.border}`,
            color: colors.textPrimary,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <DateRange sx={{ color: "#3a0ca3" }} />
          Select Custom Date Range
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, my: 1 }}>
            <Box>
              <Typography
                variant="subtitle2"
                component="label"
                sx={{
                  mb: 1,
                  color: colors.textPrimary,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Event fontSize="small" sx={{ color: "#3a0ca3" }} />
                Start Date
              </Typography>
              <input
                type="date"
                value={contentCustomStartDate}
                onChange={(e) => handleDateInputChange(e, "start")}
                max={new Date().toISOString().split("T")[0]}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  backgroundColor: colors.inputBackground,
                  color: colors.textPrimary,
                }}
              />
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                component="label"
                sx={{
                  mb: 1,
                  color: colors.textPrimary,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <CalendarMonth fontSize="small" sx={{ color: "#3a0ca3" }} />
                End Date
              </Typography>
              <input
                type="date"
                value={contentCustomEndDate}
                onChange={(e) => handleDateInputChange(e, "end")}
                max={new Date().toISOString().split("T")[0]}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  backgroundColor: colors.inputBackground,
                  color: colors.textPrimary,
                }}
              />
            </Box>

            <Box sx={{ mt: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  color: colors.textSecondary,
                  fontSize: "0.75rem",
                }}
              >
                Quick Ranges:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {quickDateRanges.map((range) => (
                  <Chip
                    key={range.label}
                    label={range.label}
                    size="small"
                    onClick={() => {
                      const end = new Date();
                      const start = new Date();
                      start.setDate(start.getDate() - range.days);
                      dispatch(
                        setContentCustomEndDate(end.toISOString().split("T")[0])
                      );
                      dispatch(
                        setContentCustomStartDate(
                          start.toISOString().split("T")[0]
                        )
                      );
                    }}
                    sx={{
                      bgcolor:
                        theme === "light"
                          ? "rgba(58, 12, 163, 0.1)"
                          : "rgba(58, 12, 163, 0.2)",
                      color: theme === "light" ? "#3a0ca3" : "#a78df0",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ borderTop: `1px solid ${colors.border}`, padding: 2 }}
        >
          <Button
            onClick={handleCloseDateDialog}
            sx={{ color: colors.textSecondary }}
          >
            Cancel
          </Button>
          <Button
            onClick={applyCustomDateRange}
            disabled={!contentCustomStartDate || !contentCustomEndDate}
            sx={{
              backgroundColor: "#3a0ca3",
              color: "white",
              "&:hover": { backgroundColor: "#4361ee" },
              "&.Mui-disabled": {
                backgroundColor: theme === "light" ? "#cbd5e1" : "#3f3f3f",
                color: theme === "light" ? "#94a3b8" : "#717171",
              },
            }}
          >
            Apply Range
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
