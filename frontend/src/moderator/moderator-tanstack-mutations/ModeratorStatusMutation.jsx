import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateModeratorStatusApi } from "../moderator-apis/ModeratorStatusChangeApi";
import { useDispatch, useSelector } from "react-redux";
import {
  setErrorAndSuccesDialogMessage,
  toggleBackdrop,
} from "../../global-redux/GlobalRedux";
import {
  manageContentSelector,
  setContentTotalData,
} from "../../global-redux/ManageContentSlice";

export const updateModeratorStatusMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { contentTotalData, params } = useSelector(manageContentSelector);

  return useMutation({
    mutationKey: ["updatemoderatorstatusmutaion"],
    mutationFn: updateModeratorStatusApi,
    onSuccess: (data) => {
      console.log(data)
      queryClient.setQueryData(
        ["moderatormanagecontent", params],
        (oldData) => {
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
        }
      );

      queryClient.setQueryData(
        ["GetModeratorStatsQuery"],
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            dataCount: data?.dataCount,
          };
        }
      );
    },


    onError: (error) => {
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
    },
    onSettled: () => {
      dispatch(toggleBackdrop());
    },
  });
};
