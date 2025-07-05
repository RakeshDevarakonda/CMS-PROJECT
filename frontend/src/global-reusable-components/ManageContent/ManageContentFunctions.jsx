import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  manageContentSelector,
  setModeratorPostStatusChange,
  setSortOrder,
  setVersionList,
  setVersionposts,
  setAdminPostStatusChange,
  setContentSelectedOpportunity,
  togglePostDetailsDialog,
  setContentDeleteId,
  setContentSearchQuery,
  setContentDateFilter,
  setFinalStartDates,
  setFinalEndDates,
  setContentOpenDateDialog,
  setContentCustomStartDate,
  setContentCustomEndDate,
  setContentStatusFilter,
  setContentCurrentPageNumber,
  setContentRowsPerPage,
  setFinalSearchterm,
  setContentSearchUsername,
  setFinalSearchUsername,
  toggleIsSearchModeratorName,
  setModeratoratedByData, // You forgot to import this
} from "../../global-redux/ManageContentSlice";

import {
  globalReduxSelector,
  setErrorAndSuccesDialogMessage,
  toggleErrorAndSuccesDialog,
} from "../../global-redux/GlobalRedux";
import { useMemo, useRef } from "react";
import {
  Block,
  BusinessCenter,
  CalendarMonth,
  CalendarToday,
  CheckCircle,
  DateRange,
  Event,
  HourglassEmpty,
  InsertChart,
  Today,
} from "@mui/icons-material";

export default function useManageContentFunctions() {
  const { userDetails } = useSelector(globalReduxSelector);

  const { selectedFilterType } = useSelector(manageContentSelector);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    versionList,
    versionposts,
    contentTotalData,
    sortOrder,
    contentCurrentPageNumber,
    contentRowsPerPage,
    contentCustomStartDate,
    contentCustomEndDate,
    finalSearchUsername,
    contentSearchUsername,
  } = useSelector(manageContentSelector);

  const handleEditOpportunity = (e, version) => {
    navigate(`${e._id}/editpost?version=${version}`);
  };

  const themeColors = {
    light: {
      background: "#ffffff",
      cardBackground: "#f8fafc",
      textPrimary: "#1a1a2c",
      textSecondary: "#64748b",
      border: "#e2e8f0",
      tableHeaderBg: "#f8fafc",
      tableRowHover: "#f8fafc",
      chipBackground: "rgba(226, 232, 240, 0.5)",
      inputBackground: "white",
      dialogBackground: "#ffffff",
    },
    dark: {
      background: "#121212",
      cardBackground: "#1e1e1e",
      textPrimary: "#e1e1e1",
      textSecondary: "#a1a1a1",
      border: "#2d2d2d",
      tableHeaderBg: "#252525",
      tableRowHover: "#2a2a2a",
      chipBackground: "rgba(45, 45, 45, 0.5)",
      inputBackground: "#2d2d2d",
      dialogBackground: "#252525",
    },
  };

  const statusStyles = {
    All: {
      bgColor: "#6c757d",
      gradientFrom: "#6c757d",
      gradientTo: "#495057",
      icon: <InsertChart fontSize="small" />,
      lightBg: "#6c757d15",
    },
    draft: {
      bgColor: "#4cc9f0",
      gradientFrom: "#4cc9f0",
      gradientTo: "#4895ef",
      icon: <BusinessCenter fontSize="small" />,
      lightBg: "#4cc9f015",
    },

    approved: {
      bgColor: "#90be6d",
      gradientFrom: "#20c997",
      gradientTo: "#198754",
      icon: <CheckCircle fontSize="small" />,
      lightBg: "#19875415",
    },
    pending: {
      bgColor: "#ffc107",
      gradientFrom: "#ffe066",
      gradientTo: "#ffc107",
      icon: <HourglassEmpty fontSize="small" />,
      lightBg: "#ffc10715",
    },
    rejected: {
      bgColor: "#dc3545",
      gradientFrom: "#ff6b6b",
      gradientTo: "#dc3545",
      icon: <Block fontSize="small" />,
      lightBg: "#dc354515",
    },
  };

  const dateFilters = [
    {
      value: "All",
      label: "All Dates",
      icon: <CalendarToday fontSize="small" />,
    },
    {
      value: "Today",
      label: "Today",
      icon: <Today fontSize="small" />,
    },
    {
      value: "Yesterday",
      label: "Yesterday",
      icon: <Event fontSize="small" />,
    },
    {
      value: "This Month",
      label: "This Month",
      icon: <CalendarMonth fontSize="small" />,
    },
    {
      value: "This Year",
      label: "This Year",
      icon: <DateRange fontSize="small" />,
    },
    {
      value: "Custom Range",
      label: "Custom Range",
      icon: <DateRange fontSize="small" />,
    },
  ];

  const quickDateRanges = [
    { label: "This Week", days: 7 },
    { label: "Last 2 Weeks", days: 14 },
    { label: "This Month", days: 30 },
    { label: "Last Quarter", days: 90 },
  ];

  const handleSortOrdering = (e) => {
    dispatch(setVersionposts({}));
    dispatch(setSortOrder(e));
  };

  const handleVersionChange = ({ source, version, id, index }) => {
    dispatch(setVersionposts({ source, version, id, index }));
    dispatch(
      setVersionList({
        ...versionList,
        [id]: {
          ...versionList[id],
          selected: version,
        },
      })
    );
  };

  const handleModeratorStatusChange = (id, status, source, version) => {
    dispatch(
      setErrorAndSuccesDialogMessage({
        type: "Success",
        buttonname: "Update Status",
      })
    );
    dispatch(setModeratorPostStatusChange({ id, status, source, version }));
    dispatch(toggleErrorAndSuccesDialog());
  };

  const handleAdminStatusChange = (id, status, source, version) => {
    dispatch(
      setErrorAndSuccesDialogMessage({
        type: "Success",
        buttonname: "Update Status",
      })
    );
    dispatch(setAdminPostStatusChange({ id, status, source, version }));
    dispatch(toggleErrorAndSuccesDialog());
  };

  const handleopurtunitydetails = (e) => {
    dispatch(setContentSelectedOpportunity(e));
    dispatch(togglePostDetailsDialog());
  };

  const handleDeleteOpportunity = (e, version) => {
    dispatch(setContentDeleteId(e));
    dispatch(
      setErrorAndSuccesDialogMessage({
        message: "Do You Really Want To Delete This Post",
        type: "Delete",
        buttonname: "Delete",
        deleteId: e,
        deleteTheId: true,
        version: version,
      })
    );
    dispatch(toggleErrorAndSuccesDialog());
  };

  const handleVeiwReason = (e) => {
    dispatch(
      setErrorAndSuccesDialogMessage({
        message: e,
        type: "Error",
        buttonname: "Close",
      })
    );
    dispatch(toggleErrorAndSuccesDialog());
  };

  const debounceTimeoutRef = useRef(null);

  const handleSearchTerm = (e) => {
    const value = e.target.value;
    dispatch(setContentSearchQuery(value));
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      dispatch(setFinalSearchterm(value));
    }, 1000);
  };

  const handleSearchUsername = (e) => {
    const value = e.target.value;

    if (!value) {
      dispatch(setContentSearchUsername(""));
    } else {
      dispatch(setContentSearchUsername(value));
    }

    if (selectedFilterType === "Moderator Posts" && value) {
      dispatch(toggleIsSearchModeratorName("true"));
    } else {
      dispatch(toggleIsSearchModeratorName("false"));
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (!value) {
      dispatch(setFinalSearchUsername(""));
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (!value) {
        dispatch(setFinalSearchUsername(""));
      } else {
        dispatch(setFinalSearchUsername(value.trim()));
      }
    }, 1000);
  };

  const sortedData = useMemo(() => {
    // if (versionposts?.id) {
    //   return [...contentTotalData].slice(
    //     contentCurrentPageNumber * contentRowsPerPage,
    //     contentCurrentPageNumber * contentRowsPerPage + contentRowsPerPage
    //   );
    // }

    // console.log(contentTotalData)
    // return [...contentTotalData].slice(
    //   contentCurrentPageNumber * contentRowsPerPage,
    //   contentCurrentPageNumber * contentRowsPerPage + contentRowsPerPage
    // );

    return contentTotalData;

    // return [...contentTotalData].sort((a, b) => {
    //   const dateA = new Date(a.updatedAt).getTime();
    //   const dateB = new Date(b.updatedAt).getTime();
    //   return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    // });
  }, [contentTotalData, sortOrder]);

  const displayedOpportunities = useMemo(() => {
    return sortedData.slice(
      contentCurrentPageNumber * contentRowsPerPage,
      contentCurrentPageNumber * contentRowsPerPage + contentRowsPerPage
    );
  }, [sortedData, contentCurrentPageNumber, contentRowsPerPage]);

  const handleCloseDateDialog = () => dispatch(setContentOpenDateDialog(false));

  const applyCustomDateRange = () => {
    if (contentCustomStartDate && contentCustomEndDate) {
      const start = new Date(contentCustomStartDate);
      const end = new Date(contentCustomEndDate);

      if (start > end) {
        dispatch(toggleErrorAndSuccesDialog());
        dispatch(
          setErrorAndSuccesDialogMessage({
            message: "Start Date Canot Greater Than End Date",
            type: "Error",
            buttonname: "Try Again",
          })
        );
        dispatch(setContentDateFilter("All"));
        return;
      }

      dispatch(setContentDateFilter("Custom Range"));
      dispatch(setFinalStartDates(contentCustomStartDate));
      dispatch(setFinalEndDates(contentCustomEndDate));
      handleCloseDateDialog();
    }
  };

  const handleDateInputChange = (e, type) => {
    // year month date
    const value = e.target.value;
    if (type === "start") {
      dispatch(setContentCustomStartDate(value));
      if (
        contentCustomEndDate &&
        new Date(value) > new Date(contentCustomEndDate)
      ) {
        dispatch(setContentCustomEndDate(value));
      }
    } else {
      dispatch(setContentCustomEndDate(value));
    }
  };

  const clearAllFilters = () => {
    dispatch(setContentSearchQuery(""));
    dispatch(setContentStatusFilter("All"));
    dispatch(setContentDateFilter("All"));
    dispatch(setContentCustomStartDate(""));
    dispatch(setContentCustomEndDate(""));
    dispatch(setFinalStartDates(""));
    dispatch(setFinalEndDates(""));
  };

  const getStatusStyle = (status) => {
    return statusStyles[status] || statusStyles.default;
  };

  const handleChangePage = (_, newPage) =>
    dispatch(setContentCurrentPageNumber(newPage));
  const handleChangeRowsPerPage = (e) => {
    dispatch(setContentRowsPerPage(parseInt(e.target.value, 10)));
    dispatch(setContentCurrentPageNumber(0));
  };

  const handleOpenDateDialog = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    if (!contentCustomStartDate) {
      dispatch(setContentCustomStartDate(today.toISOString().split("T")[0]));
    }
    if (!contentCustomEndDate) {
      dispatch(setContentCustomEndDate(nextWeek.toISOString().split("T")[0]));
    }
    dispatch(setContentOpenDateDialog(true));
  };

  const statusOptionsByRole = {
    creator: ["All", "draft", "approved", "pending", "rejected"],
    moderator: ["All", "approved", "pending", "rejected"],
    admin: ["All", "draft", "approved", "pending", "rejected"],
  };

  const statuses = statusOptionsByRole[userDetails?.role] || [];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    };
    return date.toLocaleString("en-IN", options); // Example: "01 May 2025"
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata", // Convert time to IST
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getIconColor = (
    value,
    contentCustomStartDate,
    contentCustomEndDate
  ) => {
    if (
      value === "Custom Range" &&
      contentCustomStartDate &&
      contentCustomEndDate
    ) {
      return "#3a0ca3";
    }
    switch (value) {
      case "Today":
        return "#4cc9f0";
      case "Yesterday":
        return "#f8961e";
      case "This Month":
        return "#90be6d";
      case "This Year":
        return "#ff595e";
      default:
        return "#4361ee";
    }
  };

  const handleDateFilterChange = (value) => {
    // Get current date in local timezone (not UTC)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Format date in YYYY-MM-DD (local time, not UTC)
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    let startDate, endDate;

    if (value === "Today") {
      startDate = formatDate(today);
      endDate = formatDate(today);
    } else if (value === "Yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      startDate = formatDate(yesterday);
      endDate = formatDate(yesterday);
    } else if (value === "This Month") {
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      startDate = formatDate(firstDayOfMonth);
      endDate = formatDate(today);
    } else if (value === "This Year") {
      const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
      startDate = formatDate(firstDayOfYear);
      endDate = formatDate(today);
    } else {
      startDate = null;
      endDate = null;
    }

    dispatch(setVersionList({}));
    dispatch(setVersionposts({}));

    dispatch(setContentDateFilter(value));
    dispatch(setContentCustomStartDate(startDate));
    dispatch(setContentCustomEndDate(endDate));

    dispatch(setContentRowsPerPage(5));
    dispatch(setContentCurrentPageNumber(0));
    dispatch(setFinalStartDates(startDate));
    dispatch(setFinalEndDates(endDate));
  };

  return {
    handleEditOpportunity,
    handleSortOrdering,
    handleVersionChange,
    handleModeratorStatusChange,
    handleAdminStatusChange,
    sortedData,
    handleopurtunitydetails,
    handleDeleteOpportunity,
    handleVeiwReason,
    handleSearchTerm,
    displayedOpportunities,
    themeColors,
    statusStyles,
    dateFilters,
    quickDateRanges,
    applyCustomDateRange,
    handleDateInputChange,
    clearAllFilters,
    getStatusStyle,
    handleCloseDateDialog,

    handleChangePage,
    handleOpenDateDialog,
    handleChangeRowsPerPage,
    statusOptionsByRole,
    statuses,
    formatDate,
    formatTime,
    getIconColor,
    handleDateFilterChange,
    handleSearchUsername,
  };
}
