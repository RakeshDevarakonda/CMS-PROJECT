import {
  Box,
  Card,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetAdminContentQuery } from "../../admin/admin-tanstack-queries/AdminManageContentQuery.jsx";
import { useGetAdminVersionDataQuery } from "../../admin/admin-tanstack-queries/GetAdminContentVersions.jsx";
import { useGetManageContentQuery } from "../../creator/creator-tanstack-queries/GetManageContentQuery.jsx";
import { useGetVersionDataQuery } from "../../creator/creator-tanstack-queries/UseGetVersionDataQuery.jsx";
import {
  globalReduxSelector,
  setErrorAndSuccesDialogMessage,
  toggleErrorAndSuccesDialog,
} from "../../global-redux/GlobalRedux.jsx";
import {
  manageContentSelector,
  setContentDataCount,
  setContentDateFilter,
  setContentFilteredData,
  setContentSearchUsername,
  setContentStatusFilter,
  setContentTotalData,
  setFinalSearchUsername,
  setManageUsersTotalData,
  setSelectedFilterType,
  setVersionList,
} from "../../global-redux/ManageContentSlice.jsx";
import { useGetModeratorManageContentQuery } from "../../moderator/moderator-tanstack-queries/ModeratorManageContentQuery.jsx";
import ManageContentOnlyTableSkeleton from "../../skeletons/ManageContentOnlyTableSkeleton.jsx";
import ManageContentTableSkeleton from "../../skeletons/ManageContentTableSkeleton.jsx";
import BackDropLoader from "../../utils/BackDropLoader.jsx";
import PostDetailsDialog from "../PostDetailsDialog.jsx";
import ManageContentFunctions from "./ManageContentDialoges.jsx";
import useManageContentFunctions from "./ManageContentFunctions.jsx";
import ManageContentPagination from "./ManageContentPagination.jsx";
import ManageContentTableBody from "./ManageContentTableBody.jsx";
import ManageContentUsersTable from "./ManageContentUsersTable.jsx";
import ManageContentFilters from "./ManageContentFilters.jsx";
import ManageContentHeader from "./ManageContentHeader.jsx";
import { fetchAllUsersInAdmin } from "../../admin/admin-tanstack-queries/FetchAllUsersInAdminQuery.jsx";
import { useNavigate } from "react-router-dom";

const ManageContent = ({ statusfilter, userDataType }) => {
  const navigate = useNavigate();
  const { themeColors, sortedData, displayedOpportunities, getStatusStyle } =
    useManageContentFunctions();

  const dispatch = useDispatch();
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const {
    contentTotalData,
    contentCurrentPageNumber,
    contentRowsPerPage,
    contentStatusFilter,
    contentDataCount,
    contentDateFilter,
    contentOpenDateDialog,
    contentShowFilter,
    contentPostDetailsDialog,
    finalStartDate,
    finalEndDate,
    finalSearchterm,
    isDeleting,
    isRunApiCallOfManageContent,
    versionposts,
    versionList,
    manageUsersTotalData,
    selectedFilterType,
    finalSearchUsername,
    isSearchModeratorName,
  } = useSelector(manageContentSelector);

  const { darkMode, userDetails, showBackdrop } =
    useSelector(globalReduxSelector);
  const theme = darkMode ? "dark" : "light";
  const colors = themeColors[theme];

  const manageuser = useMemo(() => {
    if (userDataType) {
      if (userDataType === "creator") return "creator";
      if (userDataType === "moderator") return "moderator";
      if (userDataType === "admin") return "admin";
      return userDataType;
    }

    if (selectedFilterType === "Creator List") return "creator";
    if (selectedFilterType === "Moderator List") return "moderator";
    if (selectedFilterType === "Admin List") return "admin";

    return null;
  }, [userDataType, selectedFilterType]);

  const isFirstLoad = useRef(true);
  const params = useMemo(
    () => ({
      contentCurrentPageNumber,
      contentRowsPerPage,
      finalSearchterm: finalSearchterm || null,
      contentStatusFilter: contentStatusFilter || null, // <-- Redux will get updated when statusfilter changes
      contentDateFilter: contentDateFilter || null,
      finalStartDate: finalStartDate || null,
      finalEndDate: finalEndDate || null,
      selectedFilterType,
      finalSearchUsername,
      isSearchModeratorName,
    }),
    [
      contentCurrentPageNumber,
      contentRowsPerPage,
      finalSearchterm,
      contentStatusFilter,
      contentDateFilter,
      finalStartDate,
      finalEndDate,
      selectedFilterType,
      finalSearchUsername,
      isSearchModeratorName,
    ]
  );

  useEffect(() => {
    if (statusfilter) {
      dispatch(setContentStatusFilter(statusfilter));
    }
    if (userDataType) {
      dispatch(setContentSearchUsername(""));
      dispatch(setFinalSearchUsername(""));
    }
  }, [statusfilter, dispatch, userDataType]);

  let isCreator = userDetails?.role === "creator";
  let isModerator = userDetails?.role === "moderator";
  let isAdmin = userDetails?.role === "admin";

  const {
    data: creatorData,
    isLoading: creatorLoading,
    isSuccess: creatorSuccess,
    refetch: createrrefresh,
    isError: isCreatorGetError,
    error: errorForCreatorGetContent,
    isFetching: creatorIsFetching,
  } = useGetManageContentQuery(params, isCreator, manageuser);

  const {
    data: moderatorData,
    isLoading: moderatorLoading,
    isSuccess: moderatorSuccess,
    refetch: moderatorrefresh,
    isError: isModeratorGetError,
    error: errorForModeratorGetContent,
    isFetching: moderatorIsFetching,
  } = useGetModeratorManageContentQuery(params, isModerator, manageuser);

  const {
    data: adminData,
    isLoading: adminLoading,
    isSuccess: adminSuccess,
    refetch: adminrefresh,
    isError: isAdminGetError,
    error: errorForAdminGetContent,
    isFetching: adminIsFetching,
  } = useGetAdminContentQuery(params, isAdmin, manageuser);

  const isFetching =
    adminIsFetching || moderatorIsFetching || creatorIsFetching;

  const isGetContentError =
    isCreatorGetError || isModeratorGetError || isAdminGetError;

  const getContentErrorMessage =
    errorForAdminGetContent?.message ||
    errorForModeratorGetContent?.message ||
    errorForCreatorGetContent?.message;

  useEffect(() => {
    if (isGetContentError && getContentErrorMessage) {
      dispatch(toggleErrorAndSuccesDialog());
      dispatch(
        setErrorAndSuccesDialogMessage({
          message: getContentErrorMessage,
          type: "Error",
          buttonname: "Try Again",
        })
      );
      dispatch(setContentDateFilter("All"));
    }
  }, [isGetContentError, getContentErrorMessage]);

  const {
    data: singlecreatorversiondata,
    isSuccess: singlecreatorversionsuccess,
  } = useGetVersionDataQuery(versionposts, isCreator);

  const { data: singleadminversiondata, isSuccess: singleadminversionsuccess } =
    useGetAdminVersionDataQuery(versionposts, isAdmin);

  const singleversiondata = isAdmin
    ? singleadminversiondata
    : singlecreatorversiondata;

  const singleversionsuccess = isAdmin
    ? singleadminversionsuccess
    : singlecreatorversionsuccess;

  let backendDataintable;
  let isSuccess;
  let loadingData;

  if (isAdmin) {
    backendDataintable = adminData;
  } else if (isCreator) {
    backendDataintable = creatorData;
  } else {
    backendDataintable = moderatorData;
  }

  if (isAdmin) {
    isSuccess = adminSuccess;
    loadingData = adminLoading;
  } else if (isCreator) {
    isSuccess = creatorSuccess;
    loadingData = creatorLoading;
  } else {
    isSuccess = moderatorSuccess;
    loadingData = moderatorLoading;
  }

  const {
    data: usersDataForAdmin,
    isLoading: userDataLoading,
    isFetching: fetchingusers,
    isSuccess: usersDataSuccesForAdmin,
    refetch: usersRefetch,
  } = fetchAllUsersInAdmin(manageuser, finalSearchUsername);

  useEffect(() => {
    if (usersDataForAdmin && usersDataSuccesForAdmin) {
      dispatch(
        setManageUsersTotalData({
          ...manageUsersTotalData,
          [manageuser]: usersDataForAdmin?.getUsers,
        })
      );

      if (usersDataForAdmin?.statusSummary) {
        dispatch(setContentDataCount(usersDataForAdmin?.statusSummary));
      }
    }
  }, [usersDataForAdmin, usersDataSuccesForAdmin]);

  useEffect(() => {
    if (isSuccess && backendDataintable) {
      const shouldResetData =
        contentCurrentPageNumber === 0 ||
        (backendDataintable.posts && backendDataintable.posts.length === 0);

      if (shouldResetData) {
        dispatch(setContentTotalData(backendDataintable.posts || []));
      } else if (backendDataintable.posts?.length) {
        const existingIds = new Set(contentTotalData.map((opp) => opp._id));
        const newOpportunities = backendDataintable.posts.filter(
          (opp) => !existingIds.has(opp._id)
        );

        if (newOpportunities.length > 0) {
          dispatch(
            setContentTotalData([...contentTotalData, ...newOpportunities])
          );
        }
      }

      isFirstLoad.current = false;

      const initialVersionList = {};

      backendDataintable.posts.forEach((post) => {
        initialVersionList[post._id] = {
          original: post.version,
          selected: post.version,
        };
      });

      dispatch(setVersionList(initialVersionList));

      if (backendDataintable.statusSummary) {
        dispatch(setContentDataCount(backendDataintable.statusSummary));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    backendDataintable,
    refreshKey,
    isSuccess,
    contentCurrentPageNumber,
    dispatch,
    statusfilter,
    isRunApiCallOfManageContent,
  ]);

  useEffect(() => {
    if (singleversiondata && singleversionsuccess) {
      let updatedContentTotalData = sortedData;

      if (!versionposts && versionposts.id) {
        dispatch(setContentTotalData(updatedContentTotalData));
        return;
      }

      const changeindex = versionposts.index;
      let newPostId;
      let updatedContent;
      if (versionposts.source == "post") {
        newPostId = singleversiondata._id;

        updatedContent = {
          ...singleversiondata,
          _id: newPostId,
        };
      } else {
        newPostId = singleversiondata.postId;

        updatedContent = {
          ...singleversiondata,
          _id: newPostId,
        };
      }

      updatedContentTotalData[changeindex] = updatedContent;

      dispatch(setContentTotalData(updatedContentTotalData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleversiondata, refreshKey, versionList, versionposts]);

  if (isFirstLoad.current && loadingData) {
    return <ManageContentTableSkeleton />;
  }

  return (
    <>
      <Box
        sx={{
          pb: 4,
          background:
            theme === "light"
              ? "linear-gradient(to bottom, #f9fafd, #ffffff)"
              : "linear-gradient(to bottom, #1a1a1a, #121212)",
          padding: { xs: 2, md: 4 },
          boxShadow:
            theme === "light"
              ? "0 10px 40px rgba(0,0,0,0.05)"
              : "0 10px 40px rgba(0,0,0,0.3)",
        }}
      >
        <ManageContentHeader
          adminrefresh={adminrefresh}
          moderatorrefresh={moderatorrefresh}
          createrrefresh={createrrefresh}
          usersRefetch={usersRefetch}
          setRefreshKey={setRefreshKey}
          manageuser={manageuser}
        />

        {contentShowFilter && (
          <ManageContentFilters
            userDataType={userDataType}
            manageuser={manageuser}
            statusfilter={statusfilter}
          />
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center", // vertically center content
            padding: "12px 20px", // add padding for spacing
            borderTop: `1px solid ${colors.border}`,
            backgroundColor: colors.tableHeaderBg,
          }}
        >
          <Typography
            variant="h6" // makes the text larger
            fontWeight="bold"
            sx={{ fontSize: "1.5rem", color: "rgb(99, 102, 241)" }}
          >
            {userDataType === "creator"
              ? "Creator List"
              : userDataType === "moderator"
              ? "Moderator List"
              : userDataType === "admin"
              ? "Admin List"
              : null || selectedFilterType}{" "}
            ({contentDataCount?.totalCount})
          </Typography>

          <ManageContentPagination />
        </Box>

        {/* Table */}
        <Card
          sx={{
            borderBottomLeftRadius: "16px",
            borderBottomRightRadius: "16px",
            overflow: "hidden",
          }}
        >
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 0,
              boxShadow: "none",
              backgroundColor: colors.background,
              overflowX: "auto", // Enable horizontal scrolling
              overflowY: "auto", // Keep vertical scrolling

              // Combined scrollbar styles for both directions
              scrollbarColor: `${colors.dialogBackground} ${colors.background}`, // Firefox

              // WebKit scrollbars (Chrome, Safari, Edge)
              "&::-webkit-scrollbar": {
                width: "50px", // Vertical scrollbar width
                height: "20px", // Horizontal scrollbar height
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgb(222, 222, 222)",
                borderRadius: "10px",
                "&:hover": {
                  background: "#ffffff",
                },
              },
              // Horizontal scrollbar specific
              "&::-webkit-scrollbar:horizontal": {
                height: "5px",
              },
              "&::-webkit-scrollbar-thumb:horizontal": {
                backgroundColor: "rgb(222, 222, 222)",
                "&:hover": {
                  backgroundColor: "#ffffff",
                },
              },
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: colors.tableHeaderBg,
                    "& th": {
                      fontWeight: 700,
                      color: colors.textPrimary,
                      borderBottom: "2px solid #4361ee",
                    },
                  }}
                >
                  {manageuser ? (
                    <>
                      <TableCell>UserName</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>Title</TableCell>
                      <TableCell align="start">Created By</TableCell>
                      <TableCell>Date & Time</TableCell>
                      <TableCell align="center">Status</TableCell>

                      {userDetails?.role !== "creator" && (
                        <TableCell align="center">Recent Moderated </TableCell>
                      )}

                      {userDetails?.role != "moderator" && (
                        <TableCell align="center">Version</TableCell>
                      )}
                      <TableCell align="center">Action</TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              {loadingData || userDataLoading || isFetching || fetchingusers ? (
                <ManageContentOnlyTableSkeleton manageuser={manageuser} />
              ) : (
                <TableBody>
                  {manageuser ? (
                    <ManageContentUsersTable
                      userDataType={userDataType}
                      usersData={manageUsersTotalData?.[manageuser] || []}
                    />
                  ) : displayedOpportunities.length > 0 ? (
                    displayedOpportunities.map((opportunity, index) => {
                      const statusStyle = getStatusStyle(opportunity?.status);
                      return (
                        <ManageContentTableBody
                          key={index}
                          statusStyle={statusStyle}
                          opportunity={opportunity}
                          index={index}
                        />
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography
                          variant="body1"
                          sx={{ color: colors.textSecondary }}
                        >
                          No Posts found matching your filters
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              )}
            </Table>
          </TableContainer>

          <ManageContentPagination />
        </Card>
      </Box>

      {contentPostDetailsDialog && <PostDetailsDialog />}

      {contentOpenDateDialog && <ManageContentFunctions />}

      {(isDeleting || showBackdrop) && <BackDropLoader />}
    </>
  );
};

export default ManageContent;
