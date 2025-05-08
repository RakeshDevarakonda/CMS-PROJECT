import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Card,
  CardContent,
  Divider,
  Alert,
  Snackbar,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Send,
  CheckCircle,
  Error,
} from "@mui/icons-material";
import { globalReduxSelector } from "../../../global-redux/GlobalRedux.jsx";
import { colors } from "../../../utils/Colors.jsx";

const ContactUsPage = () => {
  const { darkMode } = useSelector(globalReduxSelector);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const themeColors = colors[darkMode ? "dark" : "light"];

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Contact info
  const contactInfo = [
    {
      icon: <LocationOn fontSize="large" />,
      title: "Our Location",
      details: ["123 Innovation Drive", "Tech City, TC 12345", "United States"],
    },
    {
      icon: <Email fontSize="large" />,
      title: "Email Us",
      details: ["info@cmsplatform.com", "support@cmsplatform.com"],
    },
    {
      icon: <Phone fontSize="large" />,
      title: "Call Us",
      details: ["+1 (555) 123-4567", "Toll Free: 1-800-CMS-HELP"],
    },
    {
      icon: <AccessTime fontSize="large" />,
      title: "Business Hours",
      details: ["Mon-Fri: 9AM - 6PM EST", "Sat: 10AM - 4PM EST"],
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: themeColors.background,
        color: themeColors.text,
        minHeight: "100vh",
        pt: 4,
        pb: 8,
      }}
    >
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          backgroundColor: themeColors.background,
          py: isMobile ? 6 : 10,
          mb: 6,
          borderRadius: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Typography
            variant={isMobile ? "h3" : "h2"}
            component="h1"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: 0.5,
            }}
          >
            Contact Us
          </Typography>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            align="center"
            sx={{
              mb: 2,
              color: "rgba(255,255,255,0.9)",
              maxWidth: "800px",
              mx: "auto",
              lineHeight: 1.5,
            }}
          >
            Have questions or need assistance? Our team is ready to help you
            with any inquiries.
          </Typography>
        </Container>
      </Paper>

      <Container maxWidth="lg">
        {/* Contact Information Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {contactInfo.map((info, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  backgroundColor: themeColors.paper,
                  color: themeColors.text,
                  height: "100%",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: `0 8px 25px ${themeColors.shadow}`,
                  },
                  borderRadius: 5,
                }}
              >
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Box
                    sx={{
                      backgroundColor: themeColors.primaryLight,
                      color: darkMode
                        ? themeColors.text
                        : themeColors.background,
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 2,
                      mx: "auto",
                    }}
                  >
                    {info.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {info.title}
                  </Typography>
                  {info.details.map((detail, i) => (
                    <Typography
                      key={i}
                      variant="body2"
                      sx={{
                        color: themeColors.textSecondary,
                        mb: i < info.details.length - 1 ? 1 : 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {detail}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider
          sx={{
            backgroundColor: themeColors.divider,
            my: 6,
          }}
        />

        {/* Contact Form Section */}
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
            "& .form-row": {
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              gap: 2,
              width: "100%",
              "& > div": {
                flex: 1,
              },
            },
          }}
        >
          <Box className="form-row">
            <TextField
              required
              id="name"
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              error={formSubmitted && !formData.name}
              helperText={
                formSubmitted && !formData.name ? "Please enter your name" : ""
              }
              variant="outlined"
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: themeColors.text,
                  },
                  "&:hover fieldset": {
                    borderColor: themeColors.text,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: themeColors.primary,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: themeColors.textSecondary,
                },
                "& .MuiInputBase-input": {
                  color: themeColors.text,
                },
                "& input:-webkit-autofill": {
                  boxShadow: `0 0 0 1000px ${themeColors.background} inset`,
                  WebkitTextFillColor: themeColors.text,
                  transition: "background-color 5000s ease-in-out 0s",
                },
                "& textarea:-webkit-autofill": {
                  boxShadow: `0 0 0 1000px ${themeColors.background} inset`,
                  WebkitTextFillColor: themeColors.text,
                  transition: "background-color 5000s ease-in-out 0s",
                },
              }}
            />
            <TextField
              required
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={formSubmitted && !formData.email}
              helperText={
                formSubmitted && !formData.email
                  ? "Please enter a valid email"
                  : ""
              }
              variant="outlined"
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: themeColors.text,
                  },
                  "&:hover fieldset": {
                    borderColor: themeColors.text,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: themeColors.primary,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: themeColors.textSecondary,
                },
                "& .MuiInputBase-input": {
                  color: themeColors.text,
                },
                "& input:-webkit-autofill": {
                  boxShadow: `0 0 0 1000px ${themeColors.background} inset`,
                  WebkitTextFillColor: themeColors.text,
                  transition: "background-color 5000s ease-in-out 0s",
                },
                "& textarea:-webkit-autofill": {
                  boxShadow: `0 0 0 1000px ${themeColors.background} inset`,
                  WebkitTextFillColor: themeColors.text,
                  transition: "background-color 5000s ease-in-out 0s",
                },
              }}
            />
          </Box>

          <TextField
            required
            fullWidth
            id="subject"
            name="subject"
            label="Subject"
            value={formData.subject}
            onChange={handleInputChange}
            error={formSubmitted && !formData.subject}
            helperText={
              formSubmitted && !formData.subject ? "Please enter a subject" : ""
            }
            variant="outlined"
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: themeColors.text,
                },
                "&:hover fieldset": {
                  borderColor: themeColors.text,
                },
                "&.Mui-focused fieldset": {
                  borderColor: themeColors.primary,
                },
              },
              "& .MuiInputLabel-root": {
                color: themeColors.textSecondary,
              },
              "& .MuiInputBase-input": {
                color: themeColors.text,
              },
              "& input:-webkit-autofill": {
                boxShadow: `0 0 0 1000px ${themeColors.background} inset`,
                WebkitTextFillColor: themeColors.text,
                transition: "background-color 5000s ease-in-out 0s",
              },
              "& textarea:-webkit-autofill": {
                boxShadow: `0 0 0 1000px ${themeColors.background} inset`,
                WebkitTextFillColor: themeColors.text,
                transition: "background-color 5000s ease-in-out 0s",
              },
            }}
          />

          <TextField
            required
            fullWidth
            id="message"
            name="message"
            label="Your Message"
            multiline
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            error={formSubmitted && !formData.message}
            helperText={
              formSubmitted && !formData.message
                ? "Please enter your message"
                : ""
            }
            variant="outlined"
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: themeColors.text,
                },
                "&:hover fieldset": {
                  borderColor: themeColors.text,
                },
                "&.Mui-focused fieldset": {
                  borderColor: themeColors.primary,
                },
              },
              "& .MuiInputLabel-root": {
                color: themeColors.textSecondary,
              },
              "& .MuiInputBase-input": {
                color: themeColors.text,
              },
              "& input:-webkit-autofill": {
                boxShadow: `0 0 0 1000px ${themeColors.background} inset`,
                WebkitTextFillColor: themeColors.text,
                transition: "background-color 5000s ease-in-out 0s",
              },
              "& textarea:-webkit-autofill": {
                boxShadow: `0 0 0 1000px ${themeColors.background} inset`,
                WebkitTextFillColor: themeColors.text,
                transition: "background-color 5000s ease-in-out 0s",
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            startIcon={<Send />}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: themeColors.text,
                },
                "&:hover fieldset": {
                  borderColor: themeColors.text,
                },
                "&.Mui-focused fieldset": {
                  borderColor: themeColors.primary,
                },
              },
              "& .MuiInputLabel-root": {
                color: themeColors.textSecondary,
              },
              "& .MuiInputBase-input": {
                color: themeColors.text,
              },
              "& input:-webkit-autofill": {
                boxShadow: `0 0 0 1000px ${themeColors.background} inset`,
                WebkitTextFillColor: themeColors.text,
                transition: "background-color 5000s ease-in-out 0s",
              },
              "& textarea:-webkit-autofill": {
                boxShadow: `0 0 0 1000px ${themeColors.background} inset`,
                WebkitTextFillColor: themeColors.text,
                transition: "background-color 5000s ease-in-out 0s",
              },
            }}
          >
            Send Message
          </Button>
        </Box>

        {/* Newsletter Section */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: themeColors.paper,
            p: isMobile ? 3 : 10,
            borderRadius: 2,
            textAlign: "center",
            mb: 4,
            marginTop: "30px",
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            gutterBottom
            sx={{ color: "#ffffff", fontWeight: 600 }}
          >
            Stay Updated
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{
              color: "rgba(255,255,255,0.9)",
              maxWidth: 700,
              mx: "auto",
              mb: 3,
            }}
          >
            Subscribe to our newsletter for product updates and exclusive
            offers.
          </Typography>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
              maxWidth: 600,
              mx: "auto",
            }}
          >
            <TextField
              fullWidth
              placeholder="Your Email Address"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: themeColors.text,
                  },
                  "&:hover fieldset": {
                    borderColor: themeColors.text,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: themeColors.primary,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: themeColors.textSecondary,
                },
                "& .MuiInputBase-input": {
                  color: themeColors.text,
                },
                "& input:-webkit-autofill": {
                  boxShadow: `0 0 0 1000px ${themeColors.background} inset`,
                  WebkitTextFillColor: themeColors.text,
                  transition: "background-color 5000s ease-in-out 0s",
                },
                "& textarea:-webkit-autofill": {
                  boxShadow: `0 0 0 1000px ${themeColors.background} inset`,
                  WebkitTextFillColor: themeColors.text,
                  transition: "background-color 5000s ease-in-out 0s",
                },
              }}
            />
            <Button
              variant="contained"
              size="large"
              sx={{
                paddingX: "50px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: themeColors.text,
                  },
                  "&:hover fieldset": {
                    borderColor: themeColors.text,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: themeColors.primary,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: themeColors.textSecondary,
                },
                "& .MuiInputBase-input": {
                  color: themeColors.text,
                },
                "& input:-webkit-autofill": {
                  boxShadow: `0 0 0 1000px ${themeColors.background} inset`,
                  WebkitTextFillColor: themeColors.text,
                  transition: "background-color 5000s ease-in-out 0s",
                },
                "& textarea:-webkit-autofill": {
                  boxShadow: `0 0 0 1000px ${themeColors.background} inset`,
                  WebkitTextFillColor: themeColors.text,
                  transition: "background-color 5000s ease-in-out 0s",
                },
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={formSuccess ? "success" : "error"}
          icon={formSuccess ? <CheckCircle /> : <Error />}
          sx={{
            width: "100%",
            boxShadow: `0 4px 12px ${themeColors.shadow}`,
          }}
        >
          {formSuccess
            ? "Your message has been sent successfully! We'll get back to you soon."
            : "Please fill out all required fields correctly."}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactUsPage;
