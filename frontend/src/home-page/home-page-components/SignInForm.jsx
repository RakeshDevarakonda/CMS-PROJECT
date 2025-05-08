import React, { useEffect, useMemo, useState } from "react";
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
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Redux selectors and actions
import {
  setIsSignInSubmitting,
  setShowPassword,
  setSignInErrors,
  setSignInFormData,
  signInSliceSelector,
} from "./../home-page-redux/SignInSlice";


// Components and utilities
import { SignInMutation } from "../home-page-tanstack_mutations/SignInMutatation.jsx";
import { colors } from "../../utils/Colors.jsx";
import { FullPageLoader } from "../../utils/FullPageLoader.jsx";
import { globalReduxSelector } from "../../global-redux/GlobalRedux.jsx";

const spinAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const SignInForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const useSignInMutation = SignInMutation();

  // Selectors
  const { darkMode } = useSelector(globalReduxSelector);
  const { isUserLogged, isAuthChecked } = useSelector(globalReduxSelector);
  const {
    formData,
    errors,
    showPassword,
    
    isSignInSubmitting,
  } = useSelector(signInSliceSelector);


  // Derived values
  const mode = darkMode ? "dark" : "light";
  const currentColors = useMemo(() => colors[mode], [mode]);

  useEffect(() => {
    if (isAuthChecked && isUserLogged) {
      navigate("/", { replace: true });
    }
  }, [isAuthChecked, isUserLogged, navigate]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setSignInFormData({ [name]: value }));

    if (errors[name]) {
      dispatch(setSignInErrors({ [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    dispatch(setSignInErrors(newErrors));
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(setIsSignInSubmitting());
      useSignInMutation.mutate(formData);
    }
  };

  const togglePasswordVisibility = () => {
    dispatch(setShowPassword());
  };

  // Styles
  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: currentColors.border },
      "&:hover fieldset": { borderColor: currentColors.primaryLight },
      "&.Mui-focused fieldset": { borderColor: currentColors.primary },
      "& input.Mui-disabled": { WebkitTextFillColor: currentColors.text },
    },
  };

  const buttonStyles = {
    mt: 3,
    mb: 2,
    py: 1.5,
    borderRadius: 2,
    backgroundColor: currentColors.primary,
    color: "#fff",
    "&:hover": { backgroundColor: currentColors.primaryDark },
    "&:disabled": {
      backgroundColor: currentColors.primaryDark,
      color: currentColors.disabledText,
    },
  };

  if (!isAuthChecked || isUserLogged) return <FullPageLoader />;

  return (
    <>
      <Container component="main" maxWidth="xs">
        {/* Global styles for autofill */}
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
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 8,
            borderRadius: 2,
            backgroundColor: currentColors.paper,
            color: currentColors.text,
            boxShadow: `0px 4px 12px ${currentColors.shadow}`,
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Sign In
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              disabled={isSignInSubmitting}
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
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
              sx={textFieldStyles}
            />

            <TextField
              margin="normal"
              required
              disabled={isSignInSubmitting}
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: currentColors.textSecondary }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      disabled={isSignInSubmitting}
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
              sx={textFieldStyles}
            />

            <Box sx={{ textAlign: "right", mt: 1 }}>
              <Link
                to="#"
                style={{
                  color: currentColors.accent,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSignInSubmitting}
              sx={buttonStyles}
            >
              {isSignInSubmitting ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      mr: 1,
                      animation: `${spinAnimation} 1s linear infinite`,
                    }}
                  >
                    ⏳
                  </Box>
                  Signing In...
                </Box>
              ) : (
                "Sign In"
              )}
            </Button>

            <Grid container justifyContent="center">
              <Grid>
                <Link
                  to="/signup"
                  style={{
                    color: currentColors.primary,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  <Typography variant="body2">
                    Don't have an account? Sign Up
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>

     
    </>
  );
};

export default SignInForm;
