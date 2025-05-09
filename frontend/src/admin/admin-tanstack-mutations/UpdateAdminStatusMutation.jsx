import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useDispatch, useSelector } from "react-redux";
import {
  setErrorAndSuccesDialogMessage,
  toggleBackdrop,
} from "../../global-redux/GlobalRedux.jsx";
import { updateAdminStatusApi } from "../admin-apis/UpdateAdminStatusApi.jsx";
import {
  manageContentSelector,
  setAdminPostStatusDetails,
  setContentTotalData,
} from "../../global-redux/ManageContentSlice.jsx";
import { setDataCount } from "../../global-redux/AdminDashboardSlice.jsx";

export const updateAdminStatusMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { contentTotalData, params } = useSelector(manageContentSelector);

  return useMutation({
    mutationKey: ["updateadminstatusmutaion"],
    mutationFn: updateAdminStatusApi,
    onSuccess: (data) => {
      queryClient.setQueryData(["adminmanagecontent", params], (oldData) => {
        const updatedPost = data?.post;
        const totalData = [...contentTotalData];

        console.log(totalData, updatedPost);

        if (updatedPost?._id) {
          const updatedIndex = totalData.findIndex(
            (e) => e._id === updatedPost._id
          );

          console.log(updatedIndex);

          if (updatedIndex !== -1) {
            totalData[updatedIndex] = updatedPost;

            const newPosts = {
              ...oldData,
              posts: totalData,
            };

            console.log(newPosts);

            return newPosts;
          }
        }
        return oldData;
      });

      queryClient.setQueryData(["GetAdminStatsQuery"], (oldData) => {
        console.log("Old GetAdminStatsQuery data:", oldData);

        if (!oldData) {
          console.warn("No existing GetAdminStatsQuery data found");
          return oldData;
        }

        const newData = {
          ...oldData,
          dataCount: data?.dataCount,
        };

        console.log("New GetAdminStatsQuery data:", newData);
        return newData;
      });

      dispatch(setAdminPostStatusDetails({}));
    },
    onError: (error) => {
      if (error?.message === "POST_ALREADY_MODERATED") {
        dispatch(
          setErrorAndSuccesDialogMessage({
            message:
              "This Post Is Already Moderated, Do You Wish To Change Status Again",
            type: "Error",
            buttonname: "Change Status",
          })
        );

        dispatch({
          type: "globalredux/toggleErrorAndSuccesDialog",
          payload: true,
        });
      } else {
        dispatch(
          setErrorAndSuccesDialogMessage({
            message: error.message,
            type: "Error",
            buttonname: "Try Again",
          })
        );

        dispatch({
          type: "globalredux/toggleErrorAndSuccesDialog",
          payload: true,
        });
      }
    },
    onSettled: (data) => {
      dispatch(toggleBackdrop());
    },
  });
};
