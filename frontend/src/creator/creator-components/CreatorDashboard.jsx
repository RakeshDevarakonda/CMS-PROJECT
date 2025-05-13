import React, { useEffect } from "react";
import GlobalDashboard from "../../global-reusable-components/GlobalDashboard";
import {
  Block,
  BusinessCenter,
  CheckCircle,
  HourglassEmpty,
  InsertChart,
} from "@mui/icons-material";
import { useGetCreatorStatsQuery } from "../creator-tanstack-queries/CreatorStatsQuery";
import {
  creatorDashboardSelector,
  setlastfivedatsstats,
  setStatusCounts,
  setArticles,
  setDataCount,
  setTrendData,
} from "../../global-redux/CreatorDashBoardslice.jsx";
import { useDispatch, useSelector } from "react-redux";
import DashboardStats from "../../global-reusable-components/DashboardStats.jsx";
import GlobalDashboardSkeleton from "../../skeletons/CreatorDashboardSkeleton.jsx";
import DashboardStatsSkeleton from "../../skeletons/DashboardStatsSkeleton.jsx";

export default function CreatorDashboard() {
  const dispatch = useDispatch();
  const getStatusConfig = () => ({
    All: {
      bgColor: "#6c757d",
      gradientFrom: "#6c757d",
      gradientTo: "#495057",
      icon: <InsertChart />,

      lightBg: "#6c757d15",
    },
    Draft: {
      bgColor: "#4cc9f0",
      gradientFrom: "#4cc9f0",
      gradientTo: "#4895ef",
      icon: <BusinessCenter />,
      lightBg: "#4cc9f015",
    },
    Approved: {
      bgColor: "#90be6d",
      gradientFrom: "#20c997",
      gradientTo: "#198754",
      icon: <CheckCircle />,
      lightBg: "#19875415",
    },

    Pending: {
      bgColor: "#ffc107",
      gradientFrom: "#ffe066",
      gradientTo: "#ffc107",
      icon: <HourglassEmpty />,
      lightBg: "#ffc10715",
    },
    Rejected: {
      bgColor: "rgb(217, 107, 107)",
      gradientFrom: "rgb(217, 107, 107)",
      gradientTo: "rgb(253, 60, 60)",
      icon: <Block />,
      lightBg: "#dc354515",
    },
    Deleted: {
      bgColor: "#8B0000",
      gradientFrom: "#8B0000",
      gradientTo: "#8B0000",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
          <path
            fillRule="evenodd"
            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
          />
        </svg>
      ),
      lightBg: "#6f42c115",
    },
  });

  const { lastfivedatsstats } = useSelector(creatorDashboardSelector);

  const {
    data: statsData,
    isLoading: isCreatorLoading,
    refetch,isRefetching,
    isError,
  } = useGetCreatorStatsQuery();

  useEffect(() => {
    if (!isCreatorLoading && statsData && !isError) {
      dispatch(setDataCount(statsData?.dataCount));
      dispatch(setArticles(statsData.latestPosts));
      dispatch(setlastfivedatsstats(statsData.lastFiveDaysStats));
    }

    const statusConfig = getStatusConfig();

    const statusData = statsData?.dataCount
      ? Object.entries(statsData?.dataCount)
          .filter(([key]) => key !== "totalPosts")
          .map(([status, value]) => {
            const key = status.charAt(0).toUpperCase() + status.slice(1);

            return {
              name: key,
              value,
              color: statusConfig[key]?.bgColor || "#ccc",
            };
          })
      : [];

    dispatch(setStatusCounts(statusData));

    const trend = [];
    for (let i = 0; i <= 4; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayData = lastfivedatsstats?.[dateStr] || {
        draft: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        deleted: 0,
      };

      trend.push({
        date: dateStr,
        draft: dayData.draft || 0,
        approved: dayData.approved || 0,
        pending: dayData.pending || 0,
        rejected: dayData.rejected || 0,
        deleted: dayData.deleted || 0,
      });
    }

    dispatch(setTrendData(trend));
  }, [statsData]);

  if (isCreatorLoading || isRefetching) {
    return (
      <>
        <DashboardStatsSkeleton />;
        <GlobalDashboardSkeleton />;
      </>
    );
  }

  return <GlobalDashboard getStatusConfig={getStatusConfig} refetch={refetch} />;
}
