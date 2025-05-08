import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// Import the color modes
import { colors } from "../utils/Colors.jsx";
import { useSelector } from "react-redux";
import { globalReduxSelector } from "../global-redux/GlobalRedux.jsx";
import DashboardStats from "./DashboardStats.jsx";
import { creatorDashboardSelector } from "../global-redux/CreatorDashBoardslice.jsx";
import { adminDashboardSelector } from "../global-redux/AdminDashboardSlice.jsx";
import { moderatorDashboardSelector } from "./../global-redux/ModeratorDashboardSlice";

// Status colors and configuration

const GlobalDashboard = ({ getStatusConfig }) => {
  const { darkMode, userDetails } = useSelector(globalReduxSelector);
  const colorMode = darkMode ? "dark" : "light";
  const theme = colors[colorMode];
  const statusConfig = getStatusConfig();

  // console.log(userDetails);

  const {
    dataCount: creatordatacount,
    statusCounts: creatorstatuscount,
    articles,
    trendData: creatortrenddata,
  } = useSelector(creatorDashboardSelector);

  const {
    dataCount: admindatacount,
    statusCounts: adminstatuscount,
    trendData: admintrenddata,
  } = useSelector(adminDashboardSelector);

  const {
    dataCount: moderatordatacount,
    statusCounts: moderatorstatuscount,
    trendData: moderatortrenddata,
  } = useSelector(moderatorDashboardSelector);

  let dataCount;
  let statusCounts2;
  let trendData;

  if (userDetails?.role === "admin") {
    dataCount = admindatacount;
    statusCounts2 = adminstatuscount;
    trendData = admintrenddata;
  } else if (userDetails?.role === "creator") {
    dataCount = creatordatacount;
    statusCounts2 = creatorstatuscount;
    trendData = creatortrenddata;
  } else if (userDetails?.role === "moderator") {
    dataCount = moderatordatacount;
    statusCounts2 = moderatorstatuscount;
    trendData = moderatortrenddata;
  }

  const getStatusChip = (status) => {
    const config = statusConfig[status];
    return (
      <span
        className="status-chip"
        style={{
          backgroundColor: config.lightBg,
          color: config.bgColor,
          border: `1px solid ${config.bgColor}20`,
          display: "inline-flex",
          alignItems: "center",
          padding: "2px 8px",
          borderRadius: "16px",
          fontSize: "0.75rem",
          gap: "4px",
        }}
      >
        <span
          className="icon"
          style={{ display: "flex", alignItems: "center" }}
        >
          {config.icon}
        </span>
        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </span>
    );
  };

  // Custom tooltip style that works with both light and dark themes
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            padding: "10px",
            backgroundColor: theme.paper,
            color: theme.text,
            border: `1px solid ${theme.divider}`,
            borderRadius: "4px",
            boxShadow: `0 4px 8px ${theme.shadow}`,
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              margin: "0 0 5px 0",
              fontSize: "14px",
            }}
          >
            {label}
          </p>
          {payload.map((item, index) => (
            <p
              key={`tooltip-item-${index}`}
              style={{
                color: item.color,
                margin: "2px 0",
                fontSize: "12px",
              }}
            >
              {item.name}: {item.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Main styles for the component
  const styles = {
    container: {
      Width: "100vw",
      margin: "0 auto",
      padding: "16px",
      color: theme.text,
      backgroundColor: theme.background,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
      paddingBottom: "16px",
      borderBottom: `1px solid ${theme.divider}`,
      flexWrap: "wrap", // For responsive design
      gap: "16px",
    },
    pageTitle: {
      fontSize: "2rem",
      fontWeight: "bold",
      margin: "0",
      color: theme.text,
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
    },
    button: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "0.875rem",
      transition: "all 0.2s ease",
    },
    primaryButton: {
      background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`,
      color: "#ffffff",
    },
    themeToggle: {
      background: colorMode === "light" ? "#1e1e1e" : "#f5f5f5",
      color: colorMode === "light" ? "#fff" : "#000",
    },
    cardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "16px",
      marginBottom: "24px",
    },
    card: {
      backgroundColor: theme.paper,
      borderRadius: "8px",
      boxShadow: `0 4px 8px ${theme.shadow}`,
      overflow: "hidden",
    },
    statusCard: (color) => ({
      backgroundColor: theme.paper,
      borderRadius: "8px",
      boxShadow: `0 4px 8px ${theme.shadow}`,
      borderLeft: `4px solid ${color}`,
      overflow: "hidden",
    }),
    cardContent: {
      padding: "16px",
    },
    chartGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
      gap: "24px",
      marginBottom: "24px",
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
    },
    statusIcon: (bgColor) => ({
      backgroundColor: bgColor,
      width: "40px",
      height: "40px",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    cardTitle: {
      fontSize: "0.75rem",
      textTransform: "uppercase",
      fontWeight: "600",
      margin: "0",
    },
    cardValue: {
      fontSize: "1.75rem",
      fontWeight: "bold",
      margin: "0",
    },
    tableContainer: {
      borderRadius: "8px",
      overflow: "hidden",
      border: `1px solid ${theme.divider}`,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      backgroundColor: theme.paper,
    },
    tableHead: {
      backgroundColor:
        colorMode === "light" ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.05)",
    },
    tableRow: {
      borderBottom: `1px solid ${theme.divider}`,
    },
    tableCell: {
      padding: "12px 16px",
      fontSize: "0.875rem",
      textAlign: "left",
    },
    chartCard: {
      height: "400px",
    },
    chartContainer: {
      height: "300px",
      width: "100%",
    },
    sectionTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "16px",
      color: theme.text,
    },
  };

  // Responsive adjustments for small screens
  const mediaQuery = window.matchMedia("(max-width: 600px)");
  if (mediaQuery.matches) {
    styles.chartGrid.gridTemplateColumns = "1fr";
    styles.header.flexDirection = "column";
    styles.header.alignItems = "flex-start";
  }

  return (
    <>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Creator Dashboard</h1>
        </div>

        {/* Status Cards */}

        {userDetails?.role == "creator" && dataCount && (
          <DashboardStats dataCount={dataCount} />
        )}

        {/* Weekly Trend */}

        <div style={{ ...styles.card, marginBottom: "24px" }}>
          <div style={styles.cardContent}>
            <h2 style={styles.sectionTitle}>Weekly Article Activity</h2>
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.divider} />
                  <XAxis dataKey="date" tick={{ fill: theme.textSecondary }} />
                  <YAxis tick={{ fill: theme.textSecondary }} />
                  <Tooltip arrow content={<CustomTooltip />} />
                  <Legend />

                  {userDetails?.role === "creator" && (
                    <Line
                      type="monotone"
                      dataKey="draft"
                      stroke={statusConfig.Draft.bgColor}
                      strokeWidth={2}
                      dot={{ r: 4, fill: statusConfig.Draft.bgColor }}
                      activeDot={{ r: 6 }}
                      name="Draft"
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="approved"
                    stroke={statusConfig.Approved.bgColor}
                    strokeWidth={2}
                    dot={{ r: 4, fill: statusConfig.Approved.bgColor }}
                    activeDot={{ r: 6 }}
                    name="approved"
                  />

                  {userDetails?.role !== "moderator" && (
                    <Line
                      type="monotone"
                      dataKey="pending"
                      stroke={statusConfig.Pending.bgColor}
                      strokeWidth={2}
                      dot={{ r: 4, fill: statusConfig.Pending.bgColor }}
                      activeDot={{ r: 6 }}
                      name="Pending"
                    />
                  )}

                  <Line
                    type="monotone"
                    dataKey="rejected"
                    stroke={statusConfig.Rejected.bgColor}
                    strokeWidth={2}
                    dot={{ r: 4, fill: statusConfig.Rejected.bgColor }}
                    activeDot={{ r: 6 }}
                    name="Rejected"
                  />

                  {userDetails?.role !== "moderator" && (
                    <Line
                      type="monotone"
                      dataKey="deleted"
                      stroke={statusConfig.Deleted.bgColor}
                      strokeWidth={2}
                      dot={{ r: 4, fill: statusConfig.Deleted.bgColor }}
                      activeDot={{ r: 6 }}
                      name="Deleted"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div style={styles.chartGrid}>
          <div style={styles.card}>
            <div style={styles.cardContent}>
              <h2 style={styles.sectionTitle}>Articles by Status</h2>
              <div style={styles.chartContainer}>
                {statusCounts2.length > 0 &&
                statusCounts2.some((item) => item.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusCounts2}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {statusCounts2.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip arrow content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div
                    style={{
                      height: "300px", // Set the height similar to your chart container
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "18px",
                      fontWeight: "500",
                      color: "#888",
                    }}
                  >
                    No data available
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardContent}>
              <h2 style={styles.sectionTitle}>Article Status Distribution</h2>
              <div style={styles.chartContainer}>
                {statusCounts2.length > 0 &&
                statusCounts2.some((item) => item.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={statusCounts2}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme.divider}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: theme.textSecondary }}
                      />
                      <YAxis tick={{ fill: theme.textSecondary }} />
                      <Tooltip
                        arrow
                        content={<CustomTooltip />}
                        cursor={{
                          fill:
                            theme === "dark"
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(16, 121, 234, 0.1)",
                        }}
                      />
                      <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
                        {statusCounts2.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div
                    style={{
                      height: "300px", // adjust height same as chart
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "18px",
                      fontWeight: "500",
                      color: "#888",
                    }}
                  >
                    No data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Articles Table */}

        {userDetails?.role === "creator" && (
          <div style={styles.card}>
            <div style={styles.cardContent}>
              <div style={styles.cardHeader}>
                <h2 style={styles.sectionTitle}>Recent Articles</h2>
              </div>
              <div style={styles.tableContainer}>
                <div
                  className="responsive-table-wrapper"
                  style={{ overflowX: "auto", width: "100%" }}
                >
                  <table style={styles.table}>
                    <thead style={styles.tableHead}>
                      <tr>
                        <th style={styles.tableCell}>Title</th>
                        <th style={styles.tableCell}>Description</th>
                        <th style={styles.tableCell}>Date</th>
                        <th style={styles.tableCell}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.length > 0 ? (
                        articles.map((article) => (
                          <tr key={article._id} style={styles.tableRow}>
                            <td style={styles.tableCell}>{article.title}</td>
                            <td style={styles.tableCell}>
                              {article.content
                                ? `${article.content.slice(0, 10)}...`
                                : ""}
                            </td>
                            <td style={styles.tableCell}>
                              {new Date(article.updatedAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td style={styles.tableCell}>
                              {getStatusChip(
                                article.status.charAt(0).toUpperCase() +
                                  article.status.slice(1)
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            style={{ ...styles.tableCell, textAlign: "center" }}
                          >
                            No articles available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GlobalDashboard;
