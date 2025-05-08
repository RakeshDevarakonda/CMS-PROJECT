import { useSelector } from "react-redux";
import { colors } from "../../../utils/Colors.jsx"; // Adjust the import path as needed
import { globalReduxSelector } from "../../../global-redux/GlobalRedux.jsx"; // Adjust the import path as needed

import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  Box,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";


 const faqs = [
  {
    question: "What is this CMS project about?",
    answer:
      "This CMS (Content Management System) allows users to create, edit, and manage website content without needing to write code.",
  },
  {
    question: "Do I need technical skills to use this CMS?",
    answer:
      "No, the CMS is designed to be user-friendly. You can manage your content using a simple interface with no coding required.",
  },
  {
    question: "Can I upload images and other media?",
    answer:
      "Yes, you can upload images, videos, and documents to use in your pages and posts.",
  },
  {
    question: "Is there a way to preview content before publishing?",
    answer:
      "Yes, a live preview option is available so you can see your changes before making them public.",
  },
  {
    question: "Can multiple people use the CMS at the same time?",
    answer:
      "Yes, the CMS supports multiple users with different roles and permissions for secure collaboration.",
  },
];

function FAQ() {
  // Dark mode state
  const { darkMode } = useSelector(globalReduxSelector);
  const colorMode = darkMode ? "dark" : "light";
  const themeColors = colors[colorMode];

  const [expandedIndex, setExpandedIndex] = useState(-1);

  const handleChange = (index) => (event, isExpanded) => {
    setExpandedIndex(isExpanded ? index : null);
  };

  // Common animation styles
  const sectionStyles = {
    opacity: 1,
    transform: "translateY(0)",
    transition: "opacity 0.7s ease, transform 0.7s ease",
  };

  return (
    <Box bgcolor={themeColors.background} py={14} position="relative">
      <Box
        sx={{
          position: "absolute",
          top: "30%",
          right: 0,
          width: { xs: "100%", md: "40%" },
          height: "60%",
          background: `radial-gradient(circle, ${themeColors.secondary}05 0%, ${themeColors.secondary}00 70%)`,
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          maxWidth="sm"
          mx="auto"
          textAlign="center"
          mb={8}
          style={sectionStyles}
        >
          <Typography
            variant="subtitle1"
            color={themeColors.primary}
            fontWeight={600}
            gutterBottom
            sx={{
              textTransform: "uppercase",
              letterSpacing: 1.2,
              fontSize: "0.875rem",
            }}
          >
            FAQ
          </Typography>
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.primaryDark})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "2rem", md: "2.5rem" },
              mb: 2,
            }}
          >
            Frequently asked questions
          </Typography>
          <Typography
            variant="body1"
            color={themeColors.textSecondary}
            mt={3}
            sx={{ fontSize: "1.1rem" }}
          >
            Have questions? We're here to help. If you can't find the answer
            you're looking for, please don't hesitate to contact our support
            team.
          </Typography>
        </Box>

        <Box>
          <Box
            maxWidth="md"
            mx="auto"
            sx={{
              background: themeColors.paper,
              backdropFilter: "blur(10px)",
              borderRadius: 4,
              p: { xs: 2, md: 4 },
              boxShadow: `0 10px 40px ${themeColors.shadow}`,
            }}
          >
            {faqs.map((faq, index) => (
              <Box key={index}>
                <Accordion
                  expanded={expandedIndex === index}
                  onChange={handleChange(index)}
                  sx={{
                    mb: 2,
                    borderRadius: "16px !important",
                    overflow: "hidden",
                    boxShadow: "none",
                    border: `1px solid ${themeColors.divider}`,
                    "&:before": { display: "none" },
                    "&.Mui-expanded": {
                      borderColor: `${themeColors.primaryLight}`,
                      boxShadow: `0 8px 25px ${themeColors.shadow}`,
                      background: themeColors.background,
                    },
                    background:
                      expandedIndex === index
                        ? themeColors.background
                        : themeColors.paper,
                    transition: "all 0.3s ease",
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <Box
                        animate={{
                          rotate: expandedIndex === index ? 180 : 0,
                          scale: expandedIndex === index ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <ExpandMoreIcon
                          sx={{
                            color:
                              expandedIndex === index
                                ? themeColors.primary
                                : themeColors.text,
                          }}
                        />
                      </Box>
                    }
                    sx={{
                      padding: "16px 24px",
                      "&.Mui-expanded": {
                        borderBottom: `1px solid ${themeColors.divider}`,
                      },
                    }}
                  >
                    <Typography
                      fontWeight={600}
                      sx={{
                        color:
                          expandedIndex === index
                            ? themeColors.primary
                            : themeColors.text,
                        transition: "color 0.3s ease",
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ padding: "24px", paddingTop: 3 }}>
                    <Typography
                      color={themeColors.textSecondary}
                      sx={{ lineHeight: 1.7 }}
                    >
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default FAQ;
