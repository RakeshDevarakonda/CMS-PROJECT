import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockIcon from "@mui/icons-material/Lock";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { globalReduxSelector } from "../global-redux/GlobalRedux.jsx";
import { LogoutMutation } from "../home-page/home-page-tanstack_mutations/LogoutMutation.jsx";

// Colors configuration
const colors = {
  light: {
    background: "#f8f9fa",
    text: "#212529",
    textSecondary: "#495057",
    primary: "#3f51b5",
    primaryDark: "#303f9f",
    primaryLight: "#7986cb",
    accent: "#ff4081",
    shadow: "rgba(63, 81, 181, 0.2)",
  },
  dark: {
    background: "#121212",
    text: "#e0e0e0",
    textSecondary: "#9e9e9e",
    primary: "#7986cb",
    primaryDark: "#5c6bc0",
    primaryLight: "#9fa8da",
    accent: "#ff80ab",
    shadow: "rgba(121, 134, 203, 0.25)",
  },
};

// Error types and their configurations
const errorTypes = {
  401: {
    title: "Unauthorized Access",
    message: "You need to be logged in to access this resource.",
    iconType: "key",
  },
  403: {
    title: "Access Forbidden",
    message: "You don't have permission to access this resource.",
    iconType: "lock",
  },
  404: {
    title: "Page Not Found",
    message: "The page you're looking for doesn't exist or has been moved.",
    iconType: "search",
  },
  500: {
    title: "Server Error",
    message: "Something went wrong on our end. We're working to fix it.",
    iconType: "error",
  },
};

// BackgroundAnimation Component
const BackgroundAnimation = ({ colorScheme }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Parse color to RGB
    const parseColor = (color) => {
      const div = document.createElement("div");
      div.style.color = color;
      document.body.appendChild(div);
      const rgbColor = window.getComputedStyle(div).color;
      document.body.removeChild(div);
      return rgbColor;
    };

    // Get primary color in RGB format
    const primaryRgb = parseColor(colorScheme.primary);
    const accentRgb = parseColor(colorScheme.accent);

    // Create particles
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = Math.random() > 0.5 ? primaryRgb : accentRgb;
        this.opacity = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.01;

        // Boundary checking
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
      }

      draw() {
        ctx.fillStyle = this.color
          .replace("rgb", "rgba")
          .replace(")", `,${this.opacity})`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Connect particles with lines if they're close enough
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = primaryRgb
              .replace("rgb", "rgba")
              .replace(")", `,${0.2 - distance / 500})`);
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [colorScheme]);

  return (
    <Box
      component="canvas"
      ref={canvasRef}
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
};

// ErrorCodeAnimation Component
const ErrorCodeAnimation = ({ statusCode, colorScheme }) => {
  const digits = statusCode.toString().split("");

  // Animation variants for each digit
  const digitVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        y: { type: "spring", stiffness: 200, damping: 13 },
        opacity: { duration: 0.2 },
      },
    }),
    hover: {
      y: -20,
      scale: 1.1,
      transition: { duration: 0.3, type: "spring", stiffness: 300 },
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: { xs: 1, sm: 3 },
        mb: 2,
      }}
    >
      {digits.map((digit, index) => (
        <motion.div
          key={index}
          custom={index}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          variants={digitVariants}
        >
          <Box
            sx={{
              fontSize: { xs: "8rem", sm: "10rem", md: "12rem" },
              fontWeight: 900,
              lineHeight: 0.9,
              color: "transparent",
              display: "inline-block",
              position: "relative",
              WebkitTextStroke: `3px ${colorScheme.primary}`,
              filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.2))",
              "&::after": {
                content: `"${digit}"`,
                position: "absolute",
                left: 0,
                top: "8px",
                WebkitTextStroke: "0px",
                color: colorScheme.accent,
                opacity: 0.3,
                zIndex: -1,
              },
            }}
          >
            {digit}
          </Box>
        </motion.div>
      ))}
    </Box>
  );
};

// FloatingIcons Component
const FloatingIcons = ({ iconType, colorScheme }) => {
  // Map icon types to components
  const iconMap = {
    key: VpnKeyIcon,
    lock: LockIcon,
    search: SearchOffIcon,
    error: ErrorOutlineIcon,
    warning: WarningAmberIcon,
  };

  const IconComponent = iconMap[iconType] || iconMap.warning;

  // Create an array of random positions for floating icons
  const floatingIcons = Array(6)
    .fill()
    .map((_, i) => ({
      id: i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      size: Math.random() * 30 + 20,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 3,
      opacity: Math.random() * 0.3 + 0.1,
    }));

  return (
    <Box
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      {floatingIcons.map((icon) => (
        <motion.div
          key={icon.id}
          initial={{
            x: `calc(50% + ${icon.x}vw)`,
            y: `calc(50% + ${icon.y}vh)`,
            opacity: 0,
          }}
          animate={{
            x: [
              `calc(50% + ${icon.x}vw)`,
              `calc(50% + ${icon.x - 10}vw)`,
              `calc(50% + ${icon.x + 10}vw)`,
              `calc(50% + ${icon.x}vw)`,
            ],
            y: [
              `calc(50% + ${icon.y}vh)`,
              `calc(50% + ${icon.y + 10}vh)`,
              `calc(50% + ${icon.y - 15}vh)`,
              `calc(50% + ${icon.y}vh)`,
            ],
            opacity: icon.opacity,
          }}
          transition={{
            duration: icon.duration,
            delay: icon.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          style={{ position: "absolute" }}
        >
          <IconComponent
            sx={{
              fontSize: icon.size,
              color:
                icon.id % 2 === 0 ? colorScheme.primary : colorScheme.accent,
              opacity: icon.opacity,
              filter: `blur(${Math.random() > 0.7 ? "1px" : "0px"})`,
            }}
          />
        </motion.div>
      ))}
    </Box>
  );
};

// Main ErrorPage Component
const ErrorPage = ({ statusCode = 404 }) => {
  const navigate = useNavigate();
  const { darkMode } = useSelector(globalReduxSelector);
  const colorScheme = darkMode ? colors.dark : colors.light;

  const [isLoaded, setIsLoaded] = useState(false);
  const useLogoutMutuation = LogoutMutation();
  // Get error content based on status code
  const errorContent = errorTypes[statusCode] || {
    title: "Unexpected Error",
    message: "Something went wrong. Please try again.",
    iconType: "warning",
  };

  // Initialize animations
  useEffect(() => {
    // Allow components to mount first
    setTimeout(() => {
      setIsLoaded(true);

      // Content entrance animation
      gsap.fromTo(
        ".error-content",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.15 }
      );

      // Button animation
      gsap.fromTo(
        ".error-buttons button",
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          stagger: 0.2,
          delay: 0.6,
        }
      );
    }, 300);
  }, [statusCode]);

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        bgcolor: colorScheme.background,
        color: colorScheme.text,
      }}
    >
      {/* Animated background */}
      <BackgroundAnimation colorScheme={colorScheme} />

      {/* Floating icons */}
      <AnimatePresence>
        {isLoaded && (
          <FloatingIcons
            iconType={errorContent.iconType}
            colorScheme={colorScheme}
          />
        )}
      </AnimatePresence>

      <Container maxWidth="md">
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          sx={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            py: { xs: 4, md: 6 },
          }}
        >
          {/* Status Code Animation */}
          <ErrorCodeAnimation
            statusCode={statusCode}
            colorScheme={colorScheme}
          />

          {/* Title */}
          <Typography
            variant="h3"
            component="h1"
            className="error-content"
            sx={{
              fontWeight: 700,
              mt: 3,
              mb: 2,
              background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.accent})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.5px",
            }}
          >
            {errorContent.title}
          </Typography>

          {/* Message */}
          <Typography
            variant="h6"
            component="p"
            className="error-content"
            sx={{
              maxWidth: "600px",
              mx: "auto",
              opacity: 0.85,
              mb: 5,
              color: colorScheme.textSecondary,
            }}
          >
            {errorContent.message}
          </Typography>

          {/* Action Buttons */}
          <Box
            className="error-buttons"
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: { xs: "wrap", sm: "nowrap" },
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              onClick={() => {
                navigate("/");
                window.location.reload();
                useLogoutMutuation.mutate();
              }}
              sx={{
                bgcolor: colorScheme.primary,
                color: "#fff",
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                fontWeight: 600,
                boxShadow: `0 8px 16px ${colorScheme.shadow}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: colorScheme.primaryDark,
                  transform: "translateY(-3px)",
                  boxShadow: `0 12px 20px ${colorScheme.shadow}`,
                },
                "&:active": {
                  transform: "translateY(1px)",
                },
              }}
            >
              Back to Home
            </Button>

            {/* <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                navigate(-1);

                window.location.reload();
              }}
              sx={{
                borderColor: colorScheme.primary,
                color: colorScheme.primary,
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                fontWeight: 600,
                borderWidth: "2px",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: colorScheme.primaryDark,
                  bgcolor: `${colorScheme.primaryLight}15`,
                  transform: "translateY(-3px)",
                },
                "&:active": {
                  transform: "translateY(1px)",
                },
              }}
            >
              Go Back
            </Button> */}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ErrorPage;
