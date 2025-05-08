import { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Paper,
} from "@mui/material";
import { Upload, User, Pencil, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import ErrorAndSuccesDialog from "../utils/ErrorAndSuccesDialog.jsx";
import {
  updateProfile,
  toggleEditing,
  togglePasswordVisibility,
  profileSelector,
  setProfile,
  updatePasswords,
  previewImage,
  submittingData,
} from "../global-redux/profileManagementSlice.jsx";
import { colors } from "../utils/Colors.jsx";
import { fetchprofiledataquery } from "../creator/creator-tanstack-queries/FetchProfileDataQuery.jsx";
import {
  globalReduxSelector,
  setErrorAndSuccesDialogMessage,
  toggleErrorAndSuccesDialog,
} from "../global-redux/GlobalRedux.jsx";
import { useProfileDataUpdateMutation } from "../creator/creator-tanstack-mutations/ProfileDataUpdateMutation.jsx";
import BackDropLoader from "../utils/BackDropLoader.jsx";
import { fetchmoderatorprofiledataquery } from "../moderator/moderator-tanstack-queries/FetchModeratorProfileDataQuery.jsx";
import { useModeratorProfileDataUpdateMutation } from "../moderator/moderator-tanstack-mutations/ModeratorProfileDataUpdateMutation.jsx";
import ProfileDataSkeleton from "../skeletons/ProfileDataSkeleton.jsx";
import { fetchAdminprofiledataquery } from "../admin/admin-tanstack-queries/FetchAdminProfile.jsx";
import { useAdminProfileDataUpdateMutation } from "../admin/admin-tanstack-mutations/UpdateAdminProfileMutation.jsx";

export default function ProfileManagement() {
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();

  const {
    isEditing,
    passwordVisible,
    profileData,
    allpasswords,
    preveiwImageUrl,
    isSubmitting,
  } = useSelector(profileSelector);

  const {
    darkMode: isDark,
    errorAndSuccesDialog,
    userDetails,
  } = useSelector(globalReduxSelector);
  const mode = isDark ? "dark" : "light";
  const currentColors = colors[mode];

  const { mutate: updateProfileBackend } = useProfileDataUpdateMutation();
  const { mutate: updateModeratorProfile } =
    useModeratorProfileDataUpdateMutation();

  const { mutate: updateAdminProfile } = useAdminProfileDataUpdateMutation();

  let isCreator = userDetails?.role === "creator";
  let isModerator = userDetails?.role === "moderator";
  let isAdmin = userDetails?.role === "admin";

  const {
    data: creatorProfile,
    isLoading: creatorProfileLoading,
    error: creatorError,
  } = fetchprofiledataquery(isCreator);
  const {
    data: moderatorProfile,
    isLoading: moderatorProfileLoading,
    error: moderatorError,
  } = fetchmoderatorprofiledataquery(isModerator);

  const {
    data: adminProfile,
    isLoading: adminProfileLoading,
    error: adminError,
  } = fetchAdminprofiledataquery(isAdmin);

  // Select which one to use based on isCreator
  const fetchedData = isAdmin
    ? adminProfile
    : isCreator
    ? creatorProfile
    : moderatorProfile;

  const isLoading = isAdmin
    ? adminProfileLoading
    : isCreator
    ? creatorProfileLoading
    : moderatorProfileLoading;

  const error = isAdmin
    ? adminError
    : isCreator
    ? creatorError
    : moderatorError;

  useEffect(() => {
    if (fetchedData) {
      dispatch(setProfile({ ...profileData, ...fetchedData }));
    }
  }, [fetchedData, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobileNumber") {
      const numericOnly = value.replace(/\D/g, "");
      if (numericOnly.length > 10) return;

      dispatch(updateProfile({ [name]: numericOnly }));
      return;
    }

    if (
      name !== "currentPassword" &&
      name !== "newPassword" &&
      name !== "confirmPassword"
    ) {
      dispatch(updateProfile({ [name]: value }));
    } else {
      dispatch(updatePasswords({ [name]: value }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(previewImage(reader.result));
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = allpasswords;

    const isPasswordChangeAttempted =
      currentPassword || newPassword || confirmPassword;

    if (isPasswordChangeAttempted) {
      if (!currentPassword) {
        dispatch(toggleErrorAndSuccesDialog());
        dispatch(
          setErrorAndSuccesDialogMessage({
            message:
              "Please enter your current password to change your password",
            type: "Error",
            buttonname: "Try Again",
          })
        );
        return;
      }

      if (!newPassword || !confirmPassword) {
        dispatch(
          setErrorAndSuccesDialogMessage({
            message: "Please enter your new password and confirm it",
            type: "Error",
            buttonname: "Try Again",
          })
        );
        dispatch(toggleErrorAndSuccesDialog());
        return;
      }

      if (newPassword !== confirmPassword) {
        dispatch(
          setErrorAndSuccesDialogMessage({
            message: "New password and confirm password do not match",
            type: "Error",
            buttonname: "Try Again",
          })
        );
        dispatch(toggleErrorAndSuccesDialog());
        return;
      }
    }

    // Continue with form submission
    const formData = formDataDetails(profileData, allpasswords, selectedFile);
    dispatch(submittingData());

    if (userDetails?.role == "creator") {
      updateProfileBackend(formData);
    } else if (userDetails?.role === "moderator") {
      updateModeratorProfile(formData);
    } else if (userDetails?.role === "admin") {
      updateAdminProfile(formData);
    }
  };

  const formDataDetails = (profileData, allPasswords, selectedFile) => {
    const formData = new FormData();
    formData.append("name", profileData.name);
    formData.append("email", profileData.email);
    formData.append("mobileNumber", profileData.mobileNumber);

    if (selectedFile) {
      formData.append("file", selectedFile);
    } else {
      formData.append("avatar", profileData.avatar);
    }

    formData.append("currentPassword", allPasswords.currentPassword);
    formData.append("newPassword", allPasswords.newPassword);
    formData.append("confirmPassword", allPasswords.confirmPassword);
    return formData;
  };

  const handleCancel = () => {
    dispatch(toggleEditing());
    dispatch(previewImage(null));
    dispatch(
      updatePasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    );
    setSelectedFile(null);
  };

  const togglePasswordVisibilityfunc = (field) => {
    dispatch(togglePasswordVisibility({ field }));
  };

  if (isLoading) {
    return <ProfileDataSkeleton />;
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography color="error">
          Error loading profile data: {error.message}
        </Typography>
      </Box>
    );
  }

  // Text field styling that works for both light and dark modes
  const getTextFieldSx = (disabled = false) => ({
    "& .MuiOutlinedInput-root": {
      color: disabled ? currentColors.textSecondary : currentColors.text,
      "& fieldset": {
        borderColor: currentColors.divider,
      },
      "&:hover fieldset": {
        borderColor: currentColors.primary,
      },
      "&.Mui-focused fieldset": {
        borderColor: currentColors.primary,
      },
      "& input": {
        color: disabled ? currentColors.textSecondary : currentColors.text,
        WebkitTextFillColor: currentColors.text,
      },
      "& input:-webkit-autofill": {
        WebkitBoxShadow: `0 0 0 1000px ${currentColors.background} inset`,
        WebkitTextFillColor: disabled
          ? currentColors.textSecondary
          : currentColors.text,
        transition: "background-color 5000s ease-in-out 0s",
      },
    },
    "& .MuiInputLabel-root": {
      color: currentColors.textSecondary,
      "&.Mui-focused": {
        color: currentColors.primary,
      },
      "&.Mui-disabled": {
        color: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.38)",
      },
    },
    "& .MuiFormLabel-root.Mui-disabled": {
      color: currentColors.text,
    },
    backgroundColor: currentColors.background,
  });

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={2}
      sx={{
        bgcolor: currentColors.background,
        color: currentColors.text,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 500,
          borderRadius: 3,
          bgcolor: currentColors.paper,
          boxShadow: `0px 4px 20px ${currentColors.shadow}`,
        }}
      >
        <Box p={4}>
          <Typography
            variant="h5"
            component="div"
            align="center"
            mb={3}
            sx={{
              color: currentColors.text,
              "& span": {
                color: profileData.isActive ? "green" : "red",
                fontWeight: "bold",
              },
            }}
          >
            Profile (<span>{profileData.isActive ? "Active" : "InActive"}</span>
            )
          </Typography>

          <form onSubmit={handleSave}>
            {/* Avatar Section */}
            <Box display="flex" justifyContent="center" mb={4}>
              <Box position="relative">
                <Avatar
                  src={
                    isEditing && preveiwImageUrl
                      ? preveiwImageUrl
                      : profileData?.avatar || null
                  }
                  sx={{
                    width: 100,
                    height: 100,
                    border:
                      profileData?.avatar || preveiwImageUrl
                        ? `2px solid ${currentColors.divider}`
                        : "none",
                    cursor: isEditing ? "pointer" : "default",
                    bgcolor:
                      !profileData?.avatar && !preveiwImageUrl
                        ? currentColors.primaryLight
                        : "transparent",
                    "&:hover": isEditing ? { opacity: 0.9 } : {},
                  }}
                  onClick={() =>
                    isEditing &&
                    document.getElementById("avatar-upload").click()
                  }
                >
                  {
                    // Show User icon only if there is no image at all
                    !preveiwImageUrl && !profileData?.avatar && (
                      <User size={40} color={currentColors.text} />
                    )
                  }
                </Avatar>

                {isEditing && (
                  <>
                    <input
                      type="file"
                      id="avatar-upload"
                      hidden
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    <IconButton
                      size="small"
                      onClick={() =>
                        document.getElementById("avatar-upload").click()
                      }
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        bgcolor: currentColors.primary,
                        color: currentColors.text,
                        border: `1px solid ${currentColors.divider}`,
                        "&:hover": {
                          bgcolor: currentColors.primaryDark,
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <Upload size={16} />
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>

            {/* Profile Fields */}
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                label="Full Name"
                name="name"
                value={profileData.name || ""}
                onChange={handleChange}
                placeholder="Enter your full name"
                fullWidth
                disabled={!isEditing}
                sx={getTextFieldSx(!isEditing)}
              />

              <TextField
                label="Email Address"
                name="email"
                value={profileData.email || ""}
                onChange={handleChange}
                placeholder="your.email@example.com"
                fullWidth
                disabled={!isEditing}
                sx={getTextFieldSx(!isEditing)}
              />

              <TextField
                label="Phone Number"
                name="mobileNumber"
                value={profileData?.mobileNumber || ""}
                onChange={handleChange}
                placeholder="+1 (123) 456-7890"
                fullWidth
                disabled={!isEditing}
                sx={getTextFieldSx(!isEditing)}
              />

              {!isEditing ? (
                <TextField
                  label="Password"
                  type="password"
                  value="••••••••"
                  disabled
                  fullWidth
                  sx={getTextFieldSx(!isEditing)}
                />
              ) : (
                <>
                  {["currentPassword", "newPassword", "confirmPassword"].map(
                    (field) => (
                      <TextField
                        key={field}
                        label={
                          field === "currentPassword"
                            ? "Current Password"
                            : field === "newPassword"
                            ? "New Password"
                            : "Confirm New Password"
                        }
                        name={field}
                        type={passwordVisible[field] ? "text" : "password"}
                        value={allpasswords[field] || ""}
                        onChange={handleChange}
                        placeholder={
                          field === "currentPassword"
                            ? "Enter current password"
                            : field === "newPassword"
                            ? "Enter new password"
                            : "Re-enter new password"
                        }
                        fullWidth
                        sx={getTextFieldSx(!isEditing)}
                        inputProps={{
                          autoComplete: "new-password", // random, unique value
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() =>
                                  togglePasswordVisibilityfunc(field)
                                }
                                edge="end"
                                sx={{ color: currentColors.textSecondary }}
                              >
                                {passwordVisible[field] ? (
                                  <EyeOff size={20} />
                                ) : (
                                  <Eye size={20} />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )
                  )}
                </>
              )}
            </Box>

            {/* Action Buttons */}
            <Box mt={4} display="flex" gap={2}>
              {isEditing ? (
                <>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleCancel}
                    sx={{
                      color: currentColors.error,
                      borderColor: currentColors.error,
                      "&:hover": {
                        borderColor: currentColors.error,
                        backgroundColor: `${currentColors.error}10`,
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    sx={{
                      bgcolor: currentColors.primary,
                      "&:hover": {
                        bgcolor: currentColors.primaryDark,
                      },
                      "&:disabled": {
                        bgcolor: currentColors.textSecondary,
                      },
                    }}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => dispatch(toggleEditing())}
                  startIcon={<Pencil size={16} />}
                  sx={{
                    bgcolor: currentColors.primary,
                    "&:hover": {
                      bgcolor: currentColors.primaryDark,
                    },
                  }}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </form>
        </Box>
      </Paper>

      {errorAndSuccesDialog && <ErrorAndSuccesDialog />}

      {isSubmitting && <BackDropLoader />}
    </Box>
  );
}
