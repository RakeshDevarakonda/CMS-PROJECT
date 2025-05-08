import {
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  manageContentSelector,
  setContentDateFilter,
  setContentSearchQuery,
  setContentSearchUsername,
  setContentStatusFilter,
  setFinalSearchterm,
  setFinalSearchUsername,
  setSelectedFilterType,
  setVersionList,
  setVersionposts,
  toggleIsSearchModeratorName,
} from "../../global-redux/ManageContentSlice";
import { globalReduxSelector } from "../../global-redux/GlobalRedux";
import useManageContentFunctions from "./ManageContentFunctions";
import {
  ArrowDownward,
  ArrowUpward,
  Clear,
  DateRange,
  FilterList,
  Movie,
  Person,
  Search,
  SearchOff,
} from "@mui/icons-material";

export default function ManageContentFilters({
  statusfilter,
  manageuser,
  userDataType,
}) {
  const dispatch = useDispatch();

  const [searchError, setSearchError] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const {
    selectedFilterType,
    contentStatusFilter,
    contentDateFilter,
    contentCustomEndDate,
    contentCustomStartDate,
    contentSearchQuery,
    sortOrder,
    contentSearchUsername,
  } = useSelector(manageContentSelector);
  const { darkMode, userDetails } = useSelector(globalReduxSelector);
  const theme = darkMode ? "dark" : "light";
  const {
    themeColors,
    dateFilters,
    statusStyles,
    clearAllFilters,
    handleSortOrdering,
    getIconColor,
    handleSearchTerm,
    statuses,
    handleDateFilterChange,
    handleOpenDateDialog,
    formatDate,
    handleSearchUsername,
  } = useManageContentFunctions();

  // All data, both lists and posts
  const AllTypesData = [
    { value: "All Posts", label: "All Posts", short: "AP" },
    { value: "Creator List", label: "Creator List", short: "CL" },
    { value: "Creator Posts", label: "Creator Posts", short: "CP" },
    { value: "Moderator List", label: "Moderator List", short: "ML" },
    { value: "Moderator Posts", label: "Moderator Posts", short: "MP" },
    { value: "Admin List", label: "Admin List", short: "AL" },
    { value: "Admin Posts", label: "Admin Posts", short: "AP" },
  ];

  // Posts only data
  const FewDataList = [
    { value: "All Posts", label: "All Posts", short: "AP" },
    { value: "Creator Posts", label: "Creator Posts", short: "CP" },
    { value: "Moderator Posts", label: "Moderator Posts", short: "MP" },
    { value: "Admin Posts", label: "Admin Posts", short: "AP" },
  ];

  const [fullshow, setFullshow] = React.useState(true);

  const showSearchFieldTypes = ["Admin List", "Creator List", "Moderator List"];
  const statusFilterTypes = ["pending", "approved", "rejected"];

  useEffect(() => {
    if (
      showSearchFieldTypes.includes(selectedFilterType) &&
      statusFilterTypes.includes(statusfilter)
    ) {
      dispatch(setSelectedFilterType("All Posts"));
    }
    if (statusFilterTypes.includes(statusfilter)) {
      setFullshow(false);
    } else {
      setFullshow(true);
    }
  }, [statusfilter, selectedFilterType, dispatch]);

  const AllList = fullshow ? AllTypesData : FewDataList;

  const colors = themeColors[theme];
  return (
    <>
      <Card
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: "16px",
          boxShadow:
            theme === "light"
              ? "0 4px 20px rgba(0,0,0,0.05)"
              : "0 4px 20px rgba(0,0,0,0.2)",
          background:
            theme === "light"
              ? "linear-gradient(135deg, #f8fafc, #f1f5f9)"
              : "linear-gradient(135deg, #252525, #2a2a2a)",
          border: `1px solid ${colors.border}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            rowGap: 2.5, // vertical spacing
            columnGap: 0, // horizontal spacing
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {/* Search by Title */}

          {/* autocomple */}

          {/* Stack with Autocomplete and Select */}

          {userDetails?.role !== "creator" && !userDataType && (
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{
                width: { xs: "100%", md: "auto" },
                flexWrap: { xs: "nowrap", md: "wrap" },
              }}
            >
              {/* TYPE SELECT (Admin Only) */}
              {userDetails?.role === "admin" && (
                <FormControl
                  size="small"
                  sx={{
                    minWidth: { xs: "100%", md: "180px" },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: colors.inputBackground,
                      borderRadius: "10px",
                      boxShadow: "0 2px 8px rgba(67, 97, 238, 0.07)",
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#4361ee",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#4361ee",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputBase-input": { color: colors.textPrimary },
                  }}
                  error={searchError}
                >
                  <InputLabel
                    id="role-select-label"
                    sx={{ color: theme === "dark" ? "white" : "black" }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Person sx={{ fontSize: "0.9rem", color: "#3a56c4" }} />
                      Type
                    </Box>
                  </InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="role-select"
                    value={selectedFilterType}
                    onChange={(e) => {
                      dispatch(setSelectedFilterType(e.target.value));
                      setSearchError(false);
                      if (showSearchFieldTypes.includes(e.target.value)) {
                        dispatch(setContentStatusFilter("All"));
                        dispatch(setContentDateFilter("All"));
                      }

                      dispatch(setContentSearchQuery(""));
                      dispatch(setFinalSearchterm(""));
                      dispatch(setContentSearchUsername(""));
                      dispatch(setFinalSearchUsername(""));
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: colors.cardBackground,
                          color: colors.textPrimary,
                          "&::-webkit-scrollbar": { width: "5px" },
                          "&::-webkit-scrollbar-thumb": {
                            background: theme === "dark" ? "#555" : "#ddd",
                            borderRadius: "10px",
                            "&:hover": {
                              background: theme === "dark" ? "#777" : "#ccc",
                            },
                          },
                          "& .MuiMenuItem-root": {
                            color: colors.textPrimary,
                            "&:hover": {
                              backgroundColor: colors.tableRowHover,
                            },
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select Type</em>
                    </MenuItem>

                    {AllList.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              backgroundColor: "#3a56c4",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.8rem",
                              fontWeight: "bold",
                            }}
                          >
                            {item.short}
                          </Box>
                          <span>{item.label}</span>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>

                  {searchError && (
                    <FormHelperText>
                      Please select type before searching
                    </FormHelperText>
                  )}
                </FormControl>
              )}

              {/* Autocomplete (Optional - You can uncomment and complete it) */}
              {/* {!userDataType && (
            <Autocomplete
              disablePortal
              options={top100Films}
              inputValue={inputValue}
              onInputChange={(event, newInputValue, reason) => {
                if (
                  userDetails?.role === "admin" &&
                  selectedFilterType === "All Posts"
                ) {
                  setSearchError(true);
                  return;
                }

                setSearchError(false);
                setInputValue(newInputValue);
              }}
              size="small"
              sx={{
                minWidth: { xs: "100%", md: "200px" },
                "& .MuiOutlinedInput-root": {
                  bgcolor: colors.inputBackground,
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(67, 97, 238, 0.07)",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4361ee",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4361ee",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputBase-input": { color: colors.textPrimary },
              }}
              noOptionsText={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SearchOff fontSize="small" sx={{ color: "#f77f00" }} />
                  <Typography sx={{ color: colors.textPrimary }}>
                    No options found
                  </Typography>
                </Box>
              }
              PaperComponent={(props) => (
                <Paper
                  {...props}
                  sx={{
                    bgcolor: colors.cardBackground,
                    color: colors.textPrimary,
                  }}
                />
              )}
              renderInput={(params) => (
                <TextField {...params} label="Search..." variant="outlined" />
              )}
            />
          )} */}
            </Stack>
          )}

          {userDetails.role === "admin" && (
            <TextField
              placeholder={
                manageuser === "moderator"
                  ? "Search Moderator"
                  : manageuser === "creator"
                  ? "Search Creator"
                  : manageuser === "admin"
                  ? "Search Admin"
                  : "Search By UserName"
              }
              variant="outlined"
              size="small"
              value={contentSearchUsername}
              onChange={handleSearchUsername}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" sx={{ color: "#4361ee" }} />
                  </InputAdornment>
                ),
                endAdornment: contentSearchUsername && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleSearchUsername}
                      sx={{ color: colors.textSecondary }}
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: { xs: "100%", md: "250px" },
                marginX: "10px",
                "& .MuiOutlinedInput-root": {
                  bgcolor: colors.inputBackground,
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(67, 97, 238, 0.07)",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4361ee",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4361ee",
                    borderWidth: "2px",
                  },

                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: `0 0 0 30px ${colors.background} inset !important`,
                    WebkitTextFillColor: `${colors.text} !important`,
                  },
                  "& input:-webkit-autofill:hover": {
                    WebkitBoxShadow: `0 0 0 30px ${colors.background} inset !important`,
                  },
                  "& input:-webkit-autofill:focus": {
                    WebkitBoxShadow: `0 0 0 30px ${colors.background} inset !important`,
                  },
                  "& input:-webkit-autofill:active": {
                    WebkitBoxShadow: `0 0 0 30px ${colors.background} inset !important`,
                  },
                
                },
                
                "& .MuiInputBase-input": { color: colors.textPrimary },
              }}
            />
          )}

          {!["creator", "moderator", "admin"].includes(manageuser) && (
            <TextField
              placeholder="Search by title"
              variant="outlined"
              size="small"
              value={contentSearchQuery}
              onChange={handleSearchTerm}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" sx={{ color: "#4361ee" }} />
                  </InputAdornment>
                ),
                endAdornment: contentSearchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        dispatch(setContentSearchQuery(""));
                        dispatch(setFinalSearchterm(""));
                      }}
                      sx={{ color: colors.textSecondary }}
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: { xs: "100%", md: "250px" },

                "& .MuiOutlinedInput-root": {
                  bgcolor: colors.inputBackground,
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(67, 97, 238, 0.07)",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4361ee",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4361ee",
                    borderWidth: "2px",
                  },

                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: `0 0 0 30px ${colors.background} inset !important`,
                    WebkitTextFillColor: `${colors.text} !important`,
                  },
                  "& input:-webkit-autofill:hover": {
                    WebkitBoxShadow: `0 0 0 30px ${colors.background} inset !important`,
                  },
                  "& input:-webkit-autofill:focus": {
                    WebkitBoxShadow: `0 0 0 30px ${colors.background} inset !important`,
                  },
                  "& input:-webkit-autofill:active": {
                    WebkitBoxShadow: `0 0 0 30px ${colors.background} inset !important`,
                  },
                },

                "& .MuiInputBase-input": { color: colors.textPrimary },
              }}
            />
          )}

          {!manageuser && (
            <>
              {/* Status Filter */}

              {statusfilter === "All" && (
                <FormControl
                  size="small"
                  sx={{
                    minWidth: { xs: "100%", md: "180px" },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: colors.inputBackground,
                      borderRadius: "10px",
                    },
                    "& .MuiInputBase-input": { color: colors.textPrimary },
                  }}
                >
                  <InputLabel
                    sx={{ color: theme === "dark" ? "white" : "black" }}
                    id="status-filter-label"
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <FilterList sx={{ fontSize: "0.9rem" }} />
                      Status
                    </Box>
                  </InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={contentStatusFilter}
                    onChange={(e) => {
                      dispatch(setVersionList({}));
                      dispatch(setVersionposts({}));
                      dispatch(setContentStatusFilter(e.target.value));
                    }}
                    input={<OutlinedInput label="Status" />}
                    renderValue={(selected) => {
                      const style =
                        statusStyles[selected] || statusStyles.default;
                      return (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.8,
                          }}
                        >
                          {React.cloneElement(style.icon, {
                            sx: { color: style.bgColor },
                          })}
                          <Typography
                            sx={{ fontWeight: 500, color: colors.textPrimary }}
                          >
                            {selected?.charAt(0).toUpperCase() +
                              selected?.slice(1)}
                          </Typography>
                        </Box>
                      );
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: colors.cardBackground,
                          color: colors.textPrimary,
                          "& .MuiMenuItem-root": {
                            "&:hover": {
                              backgroundColor: colors.tableRowHover,
                            },
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="All">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <FilterList
                          fontSize="small"
                          sx={{ color: "#4361ee" }}
                        />
                        <span style={{ color: colors.textPrimary }}>
                          All Statuses
                        </span>
                      </Box>
                    </MenuItem>
                    {statuses
                      .filter((s) => s !== "All")
                      .map((status, index) => (
                        <MenuItem key={index} value={status}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {React.cloneElement(statusStyles[status].icon, {
                              sx: { color: statusStyles[status].bgColor },
                            })}
                            <span style={{ color: colors.textPrimary }}>
                              <span>
                                {status?.charAt(0).toUpperCase() +
                                  status?.slice(1)}
                              </span>
                            </span>
                          </Box>
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}

              {/* Date Filter */}

              <FormControl
                size="small"
                sx={{
                  minWidth: { xs: "100%", md: "200px" },
                  "& .MuiOutlinedInput-root": {
                    bgcolor: colors.inputBackground,
                    borderRadius: "10px",
                  },
                  "& .MuiInputBase-input": { color: colors.textPrimary },
                }}
              >
                <InputLabel
                  id="date-filter-label"
                  sx={{ color: theme === "dark" ? "white" : "black" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <DateRange sx={{ fontSize: "0.9rem", color: "#90be6d" }} />
                    Date Range
                  </Box>
                </InputLabel>
                <Select
                  labelId="date-filter-label"
                  value={contentDateFilter}
                  onChange={(e) => {
                    if (e.target.value === "Custom Range") {
                      handleOpenDateDialog();
                    } else {
                      dispatch(setVersionList({}));
                      dispatch(setVersionposts({}));
                      handleDateFilterChange(e.target.value);
                    }
                  }}
                  input={<OutlinedInput label="Date Range" />}
                  renderValue={(selected) => {
                    const filter =
                      dateFilters.find((f) => f.value === selected) ||
                      dateFilters[0];
                    const iconColor = getIconColor(
                      selected,
                      contentCustomStartDate,
                      contentCustomEndDate
                    );

                    return (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.8 }}
                      >
                        {React.cloneElement(filter.icon, {
                          sx: { color: iconColor, fontSize: "1rem" },
                        })}
                        <Typography
                          sx={{ fontWeight: 500, color: colors.textPrimary }}
                        >
                          {selected === "Custom Range" &&
                          contentCustomStartDate &&
                          contentCustomEndDate
                            ? `${formatDate(
                                contentCustomStartDate
                              )} - ${formatDate(contentCustomEndDate)}`
                            : selected}
                        </Typography>
                      </Box>
                    );
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: colors.cardBackground,
                        color: colors.textPrimary,
                        "& .MuiMenuItem-root": {
                          color: colors.textPrimary,
                          "&:hover": { backgroundColor: colors.tableRowHover },
                        },
                      },
                    },
                  }}
                >
                  {dateFilters.map((filter) => {
                    const iconColor = getIconColor(
                      filter.value,
                      contentCustomStartDate,
                      contentCustomEndDate
                    );

                    return (
                      <MenuItem
                        key={filter.value}
                        onClick={() => {
                          if (filter.value === "Custom Range") {
                            handleOpenDateDialog();
                          }
                        }}
                        value={filter.value}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {React.cloneElement(filter.icon, {
                            sx: { color: iconColor, fontSize: "1rem" },
                          })}
                          <span style={{ color: colors.textPrimary }}>
                            {filter.label}
                          </span>
                        </Box>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </>
          )}

          {!showSearchFieldTypes.includes(selectedFilterType) &&
            !userDataType &&
            !manageuser && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  bgcolor: colors.inputBackground,
                  borderRadius: "10px",
                  p: "4px 8px",
                  border: `1px solid ${colors.border}`,
                }}
              >
                <Tooltip
                  arrow
                  title="Sort ascending"
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
                    size="small"
                    onClick={() => handleSortOrdering("asc")}
                    sx={{
                      p: 0.5,
                      color:
                        sortOrder === "asc" ? "#4361ee" : colors.textSecondary,
                      "&:hover": {
                        color: "#4361ee",
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    <ArrowUpward fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ height: 20, my: "auto" }}
                />

                <Tooltip
                  arrow
                  title="Sort descending"
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
                    size="small"
                    onClick={() => handleSortOrdering("desc")}
                    sx={{
                      p: 0.5,
                      color:
                        sortOrder === "desc" ? "#4361ee" : colors.textSecondary,
                      "&:hover": {
                        color: "#4361ee",
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    <ArrowDownward fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}

          {/* Clear Filters Button */}
          <Button
            variant="contained"
            size="small"
            onClick={clearAllFilters}
            startIcon={<Clear />}
            sx={{
              background: "linear-gradient(135deg, #4361ee, #3a0ca3)",
              color: "white",
              borderRadius: "10px",
              "&:hover": {
                background: "linear-gradient(135deg, #3a0ca3, #4361ee)",
              },
              minWidth: { xs: "100%", md: "auto" },
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Clear Filters
          </Button>
        </Box>

        {/* Applied Filters Chips */}
        {(contentSearchQuery ||
          contentSearchUsername ||
          contentStatusFilter !== "All" ||
          contentDateFilter !== "All") &&
          !manageuser && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                mt: 2,
                pt: 2,
                borderTop: `1px solid ${colors.border}`,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: colors.textSecondary,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  mr: 1,
                }}
              >
                <FilterList fontSize="small" sx={{ mr: 0.5 }} /> Applied
                Filters:
              </Typography>

              {contentSearchQuery && (
                <Chip
                  label={`title: "${contentSearchQuery}"`}
                  size="small"
                  onDelete={() => {
                    dispatch(setContentSearchQuery(""));
                    dispatch(setFinalSearchterm(""));
                  }}
                  deleteIcon={<Clear fontSize="small" />}
                  icon={<Search fontSize="small" />}
                  sx={{
                    bgcolor:
                      theme === "light"
                        ? "rgba(67, 97, 238, 0.1)"
                        : "rgba(67, 97, 238, 0.2)",
                    color: "#4361ee",
                    "& .MuiChip-icon, & .MuiChip-deleteIcon": {
                      color: "#4361ee",
                    },
                  }}
                />
              )}

              {contentSearchUsername && (
                <Chip
                  label={`${
                    selectedFilterType === "Moderator Posts"
                      ? "Search moderator"
                      : "Search By UserName"
                  }: "${contentSearchUsername}"`}
                  size="small"
                  onDelete={handleSearchUsername}
                  deleteIcon={<Clear fontSize="small" />}
                  icon={<Search fontSize="small" />}
                  sx={{
                    bgcolor:
                      theme === "light"
                        ? "rgba(67, 97, 238, 0.1)"
                        : "rgba(67, 97, 238, 0.2)",
                    color: "#4361ee",
                    "& .MuiChip-icon, & .MuiChip-deleteIcon": {
                      color: "#4361ee",
                    },
                  }}
                />
              )}

              {contentStatusFilter !== "All" && (
                <Chip
                  label={`Status: ${
                    contentStatusFilter?.charAt(0).toUpperCase() +
                    contentStatusFilter?.slice(1)
                  }`}
                  size="small"
                  onDelete={
                    statusfilter === "All"
                      ? () => dispatch(setContentStatusFilter("All"))
                      : undefined
                  }
                  deleteIcon={
                    statusfilter === "All" ? (
                      <Clear fontSize="small" />
                    ) : undefined
                  }
                  icon={React.cloneElement(
                    statusStyles[contentStatusFilter].icon,
                    {
                      fontSize: "small",
                    }
                  )}
                  sx={{
                    bgcolor:
                      theme === "light"
                        ? `rgba(${parseInt(
                            statusStyles[contentStatusFilter].bgColor.slice(
                              1,
                              3
                            ),
                            16
                          )}, ${parseInt(
                            statusStyles[contentStatusFilter].bgColor.slice(
                              3,
                              5
                            ),
                            16
                          )}, ${parseInt(
                            statusStyles[contentStatusFilter].bgColor.slice(
                              5,
                              7
                            ),
                            16
                          )}, 0.1)`
                        : `rgba(${parseInt(
                            statusStyles[contentStatusFilter].bgColor.slice(
                              1,
                              3
                            ),
                            16
                          )}, ${parseInt(
                            statusStyles[contentStatusFilter].bgColor.slice(
                              3,
                              5
                            ),
                            16
                          )}, ${parseInt(
                            statusStyles[contentStatusFilter].bgColor.slice(
                              5,
                              7
                            ),
                            16
                          )}, 0.2)`,
                    color: statusStyles[contentStatusFilter].bgColor,
                    "& .MuiChip-icon, & .MuiChip-deleteIcon": {
                      color: statusStyles[contentStatusFilter].bgColor,
                    },
                  }}
                />
              )}

              {contentDateFilter !== "All" && (
                <Chip
                  label={
                    contentDateFilter === "Custom Range" &&
                    contentCustomStartDate &&
                    contentCustomEndDate
                      ? `Date: ${formatDate(
                          contentCustomStartDate
                        )} - ${formatDate(contentCustomEndDate)}`
                      : `Date: ${contentDateFilter}`
                  }
                  size="small"
                  onDelete={() => dispatch(setContentDateFilter("All"))}
                  deleteIcon={<Clear fontSize="small" />}
                  icon={React.cloneElement(
                    dateFilters.find((f) => f.value === contentDateFilter)
                      ?.icon || dateFilters[0].icon,
                    { fontSize: "small" }
                  )}
                  sx={{
                    bgcolor:
                      theme === "light"
                        ? "rgba(144, 190, 109, 0.1)"
                        : "rgba(144, 190, 109, 0.2)",
                    color: "#90be6d",
                    "& .MuiChip-icon, & .MuiChip-deleteIcon": {
                      color: "#90be6d",
                    },
                  }}
                />
              )}
            </Box>
          )}
      </Card>
    </>
  );
}
