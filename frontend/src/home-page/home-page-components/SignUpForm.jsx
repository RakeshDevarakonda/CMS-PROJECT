import React, { useEffect, useState } from "react";
import { keyframes } from "@mui/system";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Grid,
  useMediaQuery,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Badge,
  FormHelperText,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  KeyboardArrowDown,
  Create,
  Security,
  AdminPanelSettings,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedRole,
  setShowConfirmPassword,
  setShowPassword,
  setSignUpFormData,
  setSignUpFormDataErrors,
  setSignUpSubmitting,
} from "../home-page-redux/SignupSlice.jsx";
import { colors } from "../../utils/Colors.jsx";
import { signUpFormDataSelector } from "../home-page-redux/SignupSlice.jsx";
import { SignUpMutation } from "../home-page-tanstack_mutations/SignUpMutation.jsx";

import { FullPageLoader } from "../../utils/FullPageLoader.jsx";
import { globalReduxSelector } from "../../global-redux/GlobalRedux.jsx";
import BackDropLoader from "../../utils/BackDropLoader.jsx";

const SignUpForm = () => {
  const signUpMutation = SignUpMutation();

  const navigate = useNavigate();

  const { isUserLogged, isAuthChecked } = useSelector(globalReduxSelector);

  useEffect(() => {
    if (isAuthChecked && isUserLogged) {
      navigate("/", { replace: true });
    }
  }, [isAuthChecked, isUserLogged, navigate]);

  const dispatch = useDispatch();
  const { darkMode } = useSelector(globalReduxSelector);
  const mode = darkMode ? "dark" : "light";
  const currentColors = colors[mode];
  const isMobile = useMediaQuery("(max-width:600px)");

  const {
    signUpFormData,
    signUpFormDataErrors,
    showPassword,
    showConfirmPassword,
    selectedRole,
    isSignUpSubmitting,
  } = useSelector(signUpFormDataSelector);

  const handleChange = (e) => {
    console.log(e.target.name);
    const { name, value } = e.target;
    dispatch(setSignUpFormData({ [name]: value }));

    if (signUpFormDataErrors[name]) {
      dispatch(setSignUpFormDataErrors({ [name]: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    };

    if (!signUpFormData.username.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!signUpFormData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(signUpFormData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!signUpFormData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (signUpFormData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!signUpFormData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (signUpFormData.password !== signUpFormData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!["creator", "admin", "moderator"].includes(selectedRole)) {
      newErrors.role = "Please select a role";
      isValid = false;
    }

    dispatch(setSignUpFormDataErrors(newErrors));
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(setSignUpSubmitting());

      const update = { role: selectedRole };

 

      const updatedData = { ...signUpFormData, ...update };
      signUpMutation.mutate(updatedData);
    }
  };

  const togglePasswordVisibility = () => {
    dispatch(setShowPassword());
  };

  const toggleConfirmPasswordVisibility = () => {
    dispatch(setShowConfirmPassword());
  };

  const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
  if (!isAuthChecked || isUserLogged) return <FullPageLoader />;

  return (
    <>
      <Container component="main" maxWidth="xs">
        {/* Auto-fill styles */}
        <style>
          {`
          input:-webkit-autofill,
          input:-webkit-autofill:hover, 
          input:-webkit-autofill:focus, 
          input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px ${currentColors.background} inset !important;
            -webkit-text-fill-color: ${currentColors.text} !important;
          }
        `}
        </style>

        <Paper
          elevation={3}
          sx={{
            p: isMobile ? 3 : 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: isMobile ? 4 : 8,
            borderRadius: 2,
            backgroundColor: currentColors.paper,
            color: currentColors.text,
            boxShadow: `0px 4px 12px ${currentColors.shadow}`,
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            sx={{
              mb: 3,
              color: currentColors.text,
              fontWeight: 600,
            }}
          >
            Create an Account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: currentColors.border,
                  },
                  "&:hover fieldset": {
                    borderColor: currentColors.primaryLight,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: currentColors.primary,
                  },
                  "& input.Mui-disabled": {
                    WebkitTextFillColor: currentColors.text, // this overrides browser default grey
                  },
                },
              }}
              margin="normal"
              required
              fullWidth
              id="name"
              label="User Name"
              name="username"
              autoComplete="name"
              disabled={isSignUpSubmitting}
              autoFocus
              value={signUpFormData.username}
              onChange={handleChange}
              error={!!signUpFormDataErrors.name}
              helpertext={signUpFormDataErrors.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: currentColors.textSecondary }} />
                  </InputAdornment>
                ),
                style: {
                  backgroundColor: currentColors.background,
                  color: currentColors.text,
                },
              }}
              InputLabelProps={{
                style: { color: currentColors.textSecondary },
              }}
            />

            <TextField
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: currentColors.border,
                  },
                  "&:hover fieldset": {
                    borderColor: currentColors.primaryLight,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: currentColors.primary,
                  },
                  "& input.Mui-disabled": {
                    WebkitTextFillColor: currentColors.text, // this overrides browser default grey
                  },
                },
              }}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              disabled={isSignUpSubmitting}
              value={signUpFormData.email}
              onChange={handleChange}
              error={!!signUpFormDataErrors.email}
              helpertext={signUpFormDataErrors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: currentColors.textSecondary }} />
                  </InputAdornment>
                ),
                style: {
                  backgroundColor: currentColors.background,
                  color: currentColors.text,
                },
              }}
              InputLabelProps={{
                style: { color: currentColors.textSecondary },
              }}
            />

            <TextField
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: currentColors.border,
                  },
                  "&:hover fieldset": {
                    borderColor: currentColors.primaryLight,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: currentColors.primary,
                  },
                  "& input.Mui-disabled": {
                    WebkitTextFillColor: currentColors.text, // this overrides browser default grey
                  },
                },
              }}
              margin="normal"
              required
              fullWidth
              disabled={isSignUpSubmitting}
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              value={signUpFormData.password}
              onChange={handleChange}
              error={!!signUpFormDataErrors.password}
              helpertext={signUpFormDataErrors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: currentColors.textSecondary }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff
                          sx={{ color: currentColors.textSecondary }}
                        />
                      ) : (
                        <Visibility
                          sx={{ color: currentColors.textSecondary }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
                style: {
                  backgroundColor: currentColors.background,
                  color: currentColors.text,
                },
              }}
              InputLabelProps={{
                style: { color: currentColors.textSecondary },
              }}
            />

            <TextField
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: currentColors.border,
                  },
                  "&:hover fieldset": {
                    borderColor: currentColors.primaryLight,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: currentColors.primary,
                  },
                  "& input.Mui-disabled": {
                    WebkitTextFillColor: currentColors.text, // this overrides browser default grey
                  },
                },
              }}
              margin="normal"
              required
              fullWidth
              disabled={isSignUpSubmitting}
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              autoComplete="new-password"
              value={signUpFormData.confirmPassword}
              onChange={handleChange}
              error={!!signUpFormDataErrors.confirmPassword}
              helpertext={signUpFormDataErrors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: currentColors.textSecondary }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff
                          sx={{ color: currentColors.textSecondary }}
                        />
                      ) : (
                        <Visibility
                          sx={{ color: currentColors.textSecondary }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
                style: {
                  backgroundColor: currentColors.background,
                  color: currentColors.text,
                },
              }}
              InputLabelProps={{
                style: { color: currentColors.textSecondary },
              }}
            />

            <Box>
              <FormControl
                size="medium"
                fullWidth
                error={!!signUpFormDataErrors.role}
                helpertext={signUpFormDataErrors.role}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: currentColors.background,
                    borderColor: currentColors.primaryLight,
                    boxShadow: "0 4px 12px rgba(58, 86, 196, 0.12)",
                    transition: "all 0.3s ease",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: currentColors.primary,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: currentColors.primary,
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: currentColors.text,
                    fontWeight: 500,
                  },
                }}
              >
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{
                    color: darkMode ? "white" : "black",
                    fontWeight: 500,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Badge
                      sx={{ fontSize: "1.1rem", color: currentColors.primary }}
                    />
                    Role Type
                  </Box>
                </InputLabel>
                <Select
                  value={selectedRole}
                  onChange={(e) => {
                    dispatch(setSelectedRole(e.target.value));
                  }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  displayEmpty
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: currentColors.background,
                        color: currentColors.text,
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.12)",
                        borderRadius: "8px",
                        "&::-webkit-scrollbar": { width: "6px" },
                        "&::-webkit-scrollbar-thumb": {
                          background: darkMode
                            ? currentColors.primaryLight
                            : "#d0d9ff",
                          borderRadius: "10px",
                          "&:hover": {
                            background: darkMode
                              ? currentColors.primary
                              : "#b5c4ff",
                          },
                        },
                        "& .MuiMenuItem-root": {
                          color: currentColors.text,
                          padding: "10px 16px",
                          "&:hover": {
                            backgroundColor: darkMode
                              ? "rgba(58, 86, 196, 0.12)"
                              : "rgba(58, 86, 196, 0.08)",
                          },
                          "&.Mui-selected": {
                            backgroundColor: darkMode
                              ? "rgba(58, 86, 196, 0.25)"
                              : "rgba(58, 86, 196, 0.12)",
                            "&:hover": {
                              backgroundColor: darkMode
                                ? "rgba(58, 86, 196, 0.35)"
                                : "rgba(58, 86, 196, 0.2)",
                            },
                          },
                        },
                      },
                    },
                  }}
                  IconComponent={(props) => (
                    <KeyboardArrowDown
                      {...props}
                      sx={{
                        color: `${currentColors.text} !important`, // Force the color to apply
                        transition: "transform 0.3s ease",
                        ".MuiOutlinedInput-root.Mui-focused &": {
                          transform: "rotate(180deg)",
                        },
                      }}
                    />
                  )}
                >
                  <MenuItem value="Select Role" disabled>
                    <em>Select Role</em>
                  </MenuItem>

                  <MenuItem value="creator">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, ${currentColors.primary} 0%, #6384ff 100%)`,
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                          boxShadow: "0 2px 6px rgba(58, 86, 196, 0.3)",
                        }}
                      >
                        <Create fontSize="small" />
                      </Box>
                      <span>Creator</span>
                    </Box>
                  </MenuItem>
                  <MenuItem value="moderator">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, ${currentColors.primary} 0%, #6384ff 100%)`,
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                          boxShadow: "0 2px 6px rgba(58, 86, 196, 0.3)",
                        }}
                      >
                        <Security fontSize="small" />
                      </Box>
                      <span>Moderator</span>
                    </Box>
                  </MenuItem>
                  <MenuItem value="admin">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, ${currentColors.primary} 0%, #6384ff 100%)`,
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                          boxShadow: "0 2px 6px rgba(58, 86, 196, 0.3)",
                        }}
                      >
                        <AdminPanelSettings fontSize="small" />
                      </Box>
                      <span>Admin</span>
                    </Box>
                  </MenuItem>
                </Select>

                {signUpFormDataErrors.role && (
                  <FormHelperText>please Select Role</FormHelperText>
                )}
              </FormControl>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSignUpSubmitting}
              sx={{
                mt: 3,

                mb: 2,
                py: 1.5,
                borderRadius: 2,

                backgroundColor: currentColors.primary,
                color: "#fff",
                "&:hover": {
                  backgroundColor: currentColors.primaryDark,
                },
                "&:disabled": {
                  backgroundColor: currentColors.primaryDark,
                  color: currentColors.disabledText,
                },
              }}
            >
              {isSignUpSubmitting ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      mr: 1,
                      color: "red",
                      animation: `${spin} 1s linear infinite`,
                    }}
                  >
                    ⏳
                  </Box>
                  <Typography
                    variant="button"
                    sx={{ color: "#fff", textTransform: "none" }}
                  >
                    Signing Up...
                  </Typography>
                </Box>
              ) : (
                <Typography
                  variant="button"
                  sx={{ color: "#fff", textTransform: "none" }}
                >
                  Sign Up
                </Typography>
              )}
            </Button>

            <Grid container justifyContent="center">
              <Grid>
                <Link
                  to="/signin"
                  style={{
                    textDecoration: "none",
                    color: currentColors.secondary,
                  }}
                >
                  <Typography variant="body2" align="center">
                    Already have an account? Sign In
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>

      {isSignUpSubmitting && <BackDropLoader />}
    </>
  );
};

export default SignUpForm;
