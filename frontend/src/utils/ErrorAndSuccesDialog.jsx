import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  Block,
  Delete,
  Error,
  HourglassEmpty,
  CheckCircle,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import {
  globalReduxSelector,
  setErrorAndSuccesDialogMessage,
  toggleBackdrop,
  toggleErrorAndSuccesDialog,
} from "../global-redux/GlobalRedux.jsx";
import {
  manageContentSelector,
  setAdminPostStatusChange,
  setAdminPostStatusDetails,
  setContentTotalData,
  setModeratorPostStatusChange,
  toggleDeleting,
} from "../global-redux/ManageContentSlice.jsx";
import { deleteSinglePostMutation } from "../creator/creator-tanstack-mutations/DeleteSinglePostMutation.jsx";
import { updateModeratorStatusMutation } from "../moderator/moderator-tanstack-mutations/ModeratorStatusMutation.jsx";
import { updateAdminStatusMutation } from "../admin/admin-tanstack-mutations/UpdateAdminStatusMutation.jsx";
import { deleteAdminSinglePostMutation } from "./../admin/admin-tanstack-mutations/DeleteAdminSinglePost";

const ErrorAndSuccesDialog = () => {
  const navigate = useNavigate();
  const { userDetails } = useSelector(globalReduxSelector);
  const { mutate: updateModeratorStatus } = updateModeratorStatusMutation();
  const { mutate: updateAdminStatus } = updateAdminStatusMutation();

  const handleStatusChange = (e) => {
    if (userDetails?.role === "moderator") {
      dispatch(setModeratorPostStatusChange({ status: e.target.value }));
    } else {
      dispatch(setAdminPostStatusChange({ status: e.target.value }));
    }
  };
  const { mutate: deleteCreatorPost } = deleteSinglePostMutation();
  const { mutate: deleteAdminPost } = deleteAdminSinglePostMutation();

  const { darkMode } = useSelector(globalReduxSelector);
  const {
    moderatorPostStatusChange,
    adminPostStatusChange,
    adminPostStatusDetails,
  } = useSelector(manageContentSelector);

  const statusChangeDetails =
    userDetails?.role == "admin"
      ? adminPostStatusChange
      : moderatorPostStatusChange;

  const [rejectionReason, setRejectionReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const rejectionReasons = [
    "Inappropriate content",
    "Spam",
    "Copyright violation",
    "Poor quality",
    "Other",
  ];

  const handleRejectionReasonChange = (e) => {
    setRejectionReason(e.target.value);
    if (e.target.value !== "Other") {
      setOtherReason("");
    }
  };

  const handleOtherReasonChange = (e) => {
    setOtherReason(e.target.value);
  };

  const isDark = darkMode;
  const dispatch = useDispatch();

  const messageType = {
    Success: (
      <CheckCircle
        sx={{
          color: "#90be6d",
        }}
      />
    ),
    Error: <Error color="error" />,
    Delete: <Delete color="error" />,
  };

  const { errorAndSuccesDialogMessage, errorAndSuccesDialog } =
    useSelector(globalReduxSelector);

  const isDialogOpen = errorAndSuccesDialog;

  const dialogeMessage = errorAndSuccesDialogMessage;

  const handleClose = () => {
    dispatch(toggleErrorAndSuccesDialog());
    dispatch(setErrorAndSuccesDialogMessage(""));

    if (dialogeMessage?.signedup) {
      navigate("/signin");
    }
  };
  let reasonfor;
  const handleButtonClick = () => {
    if (
      dialogeMessage?.buttonname === "Delete" &&
      dialogeMessage?.deleteTheId
    ) {
      if (userDetails?.role == "admin") {
        deleteAdminPost({
          id: dialogeMessage.deleteId,
          version: dialogeMessage.version,
        });
      } else if (userDetails?.role === "creator") {
        deleteCreatorPost({
          id: dialogeMessage.deleteId,
          version: dialogeMessage.version,
        });
      }

      dispatch(toggleDeleting());
    }

    if (dialogeMessage?.buttonname == "Change Status") {
      updateAdminStatus({ ...adminPostStatusDetails, isChecked: true });
      dispatch(toggleBackdrop());
    }

    if (dialogeMessage?.buttonname == "Update Status") {
      if (rejectionReason == "Other") {
        reasonfor = otherReason;
      } else {
        reasonfor = rejectionReason;
      }
      if (userDetails?.role == "moderator") {
        dispatch(toggleBackdrop());
        updateModeratorStatus({
          postId: statusChangeDetails.id,
          status: statusChangeDetails.status,
          source: statusChangeDetails.source,
          version: statusChangeDetails.version,
          reason: reasonfor && reasonfor.trim().length > 0 ? reasonfor : null,
        });
        dispatch(
          setModeratorPostStatusChange({ id: null, status: null, source: null })
        );
      } else {
        const dataToSend = {
          postId: statusChangeDetails.id,
          status: statusChangeDetails.status,
          source: statusChangeDetails.source,
          version: statusChangeDetails.version,
          reason: reasonfor && reasonfor.trim().length > 0 ? reasonfor : null,
        };

        updateAdminStatus(dataToSend);

        dispatch(toggleBackdrop());

        dispatch(setAdminPostStatusDetails(dataToSend));

        dispatch(
          setAdminPostStatusChange({ id: null, status: null, source: null })
        );
      }
    }

    handleClose();
  };

  const getStatusColor = () => {
    if (statusChangeDetails.status === "pending") return "#ffc107"; // yellow
    if (statusChangeDetails.status === "rejected") return "#dc3545"; // red
    if (statusChangeDetails.status === "approved") return "#90be6d"; // green
    return isDark ? "white" : "black"; // fallback
  };

  const dialogStyles = {
    paper: {
      backgroundColor: isDark ? "rgb(30, 30, 30)" : "#FFFFFF",
      borderRadius: "0.75rem",
      overflow: "hidden",
    },
    title: {
      backgroundColor: isDark ? "rgb(30, 30, 30)" : "#FFFFFF",
      color: isDark ? "#F9FAFB" : "#111827",
      fontWeight: "bold",
      fontSize: "1.25rem",
      borderBottom: `1px solid ${isDark ? "#4B5563" : "#E5E7EB"}`,
    },
    content: {
      backgroundColor: isDark ? "rgb(30, 30, 30)" : "#FFFFFF",
      color: isDark ? "#D1D5DB" : "#4B5563",
      padding: "1.5rem",
    },
    contentText: {
      backgroundColor: isDark ? "rgb(30, 30, 30)" : "#FFFFFF",
      color: isDark ? "#D1D5DB" : "#4B5563",
      fontSize: "1rem",
      marginTop: "20px",
    },
    actions: {
      backgroundColor: isDark ? "rgb(30, 30, 30)" : "#FFFFFF",
      padding: "1rem",
      borderTop: `1px solid ${isDark ? "#4B5563" : "#E5E7EB"}`,
    },
    button: {
      fontSize: "1rem",
      borderRadius: "0.5rem",
      fontWeight: "bold",
      textTransform: "none",
      backgroundColor:
        dialogeMessage.type === "Success" ? "#059669" : "#DC2626",
      color: "#fff",
      "&:hover": {
        backgroundColor:
          dialogeMessage.type === "Success" ? "#047857" : "#B91C1C",
      },
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
      padding: "0.5rem 1.5rem",
    },
    textField: {
      marginTop: "16px",
      width: "100%",
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: isDark ? "#4B5563" : "#E5E7EB",
        },
        "&:hover fieldset": {
          borderColor: isDark ? "#6B7280" : "#D1D5DB",
        },
        "&.Mui-focused fieldset": {
          borderColor: isDark ? "#9CA3AF" : "#9CA3AF",
        },
      },
      "& .MuiInputLabel-root": {
        color: isDark ? "#9CA3AF" : "#6B7280",
      },
      "& .MuiInputBase-input": {
        color: isDark ? "#F3F4F6" : "#111827",
      },
    },
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ style: dialogStyles.paper }}
    >
      <DialogTitle
        sx={{
          ...dialogStyles.title,
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        {messageType[dialogeMessage?.type]}

        {statusChangeDetails?.status ? (
          <span>Change Status</span>
        ) : (
          <span>{dialogeMessage?.type}</span>
        )}
      </DialogTitle>

      <DialogContent sx={dialogStyles.content}>
        <DialogContentText sx={dialogStyles.contentText}>
          {dialogeMessage?.message}
        </DialogContentText>

        {statusChangeDetails?.status && (
          <Select
            value={statusChangeDetails.status}
            onChange={handleStatusChange}
            sx={{
              marginTop: "10px",
              width: "160px",
              backgroundColor: isDark ? "rgb(30, 30, 30)" : "#FFFFFF",
              fontWeight: 600,
              borderRadius: "8px",
              border: `1px solid ${isDark ? "#4B5563" : "#E5E7EB"}`,
              color: getStatusColor(),
              ".MuiSelect-select": {
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              },
              "& .MuiSvgIcon-root.MuiSelect-icon": {
                color: isDark ? "white" : "black",
              },
              "&:hover": {
                borderColor: isDark ? "#4B5563" : "#E5E7EB",
              },
              "&:focus-within": {
                boxShadow: `0 0 0 2px ${isDark ? "#4B5563" : "#E5E7EB"}`,
              },
              transition: "all 0.2s ease-in-out",
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: isDark ? "rgb(30, 30, 30)" : "#FFFFFF",
                  color: isDark ? "white" : "black",
                  borderRadius: "6px",
                  boxShadow: `0 0 0 2px ${isDark ? "#4B5563" : "#E5E7EB"}`,
                  overflow: "hidden",
                },
              },
            }}
          >
            <MenuItem
              value="approved"
              sx={{
                color: "green",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {" "}
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
              }}
            >
              {" "}
              <Block
                sx={{
                  fontSize: 18,
                  color: "red",
                }}
              />
              Reject
            </MenuItem>
          </Select>
        )}
        {statusChangeDetails?.status === "rejected" && (
          <>
            <Select
              value={rejectionReason}
              onChange={handleRejectionReasonChange}
              displayEmpty
              sx={{
                marginTop: "10px",
                width: "100%",
                backgroundColor: isDark ? "rgb(30, 30, 30)" : "#FFFFFF",
                fontWeight: 600,
                borderRadius: "8px",
                border: `1px solid ${isDark ? "#4B5563" : "#E5E7EB"}`,
                color: rejectionReason
                  ? getStatusColor()
                  : isDark
                  ? "#9CA3AF"
                  : "#6B7280",
                ".MuiSelect-select": {
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                },
                "& .MuiSvgIcon-root.MuiSelect-icon": {
                  color: isDark ? "white" : "black",
                },
                "&:hover": {
                  borderColor: isDark ? "#4B5563" : "#E5E7EB",
                },
                "&:focus-within": {
                  boxShadow: `0 0 0 2px ${isDark ? "#4B5563" : "#E5E7EB"}`,
                },
                transition: "all 0.2s ease-in-out",
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: isDark ? "rgb(30, 30, 30)" : "#FFFFFF",
                    color: isDark ? "white" : "black",
                    borderRadius: "6px",
                    boxShadow: `0 0 0 2px ${isDark ? "#4B5563" : "#E5E7EB"}`,
                    overflow: "hidden",
                  },
                },
              }}
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <em style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}>
                      Select Reason For Rejection
                    </em>
                  );
                }
                return selected;
              }}
            >
              <MenuItem value="" disabled>
                <em>Select Reason For Rejection</em>
              </MenuItem>
              {rejectionReasons.map((reason, index) => (
                <MenuItem
                  key={index}
                  value={reason}
                  sx={{
                    color: isDark ? "white" : "#6B7280",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {reason}
                </MenuItem>
              ))}
            </Select>

            {rejectionReason === "Other" && (
              <TextField
                value={otherReason}
                onChange={handleOtherReasonChange}
                label="Please specify the reason"
                variant="outlined"
                multiline
                rows={3}
                sx={dialogStyles.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          </>
        )}
      </DialogContent>
      <DialogActions sx={dialogStyles.actions}>
        <Button
          disabled={
            statusChangeDetails.status === "pending" ||
            (statusChangeDetails.status === "rejected" &&
              ((rejectionReason.trim() === "Other" &&
                otherReason.trim().length === 0) ||
                (rejectionReason.trim() !== "Other" &&
                  rejectionReason.trim() === "")))
          }
          onClick={handleButtonClick}
          sx={dialogStyles.button}
        >
          {dialogeMessage.buttonname}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorAndSuccesDialog;
