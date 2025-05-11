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
        if (!oldData) {
          return oldData;
        }

        const findIndex = oldData.posts.findIndex(
          (e) => e._id === data.post._id
        );

        if (findIndex !== -1) {
          const updatedPosts = [...oldData.posts];

          updatedPosts[findIndex] = data.post;

          return {
            ...oldData,
            posts: updatedPosts,
          };
        }
        return oldData;
      });

      queryClient.setQueryData(["GetAdminStatsQuery"], (oldData) => {
        if (!oldData) {
          return oldData;
        }

        const newData = {
          ...oldData,
          dataCount: data?.dataCount,
        };

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
