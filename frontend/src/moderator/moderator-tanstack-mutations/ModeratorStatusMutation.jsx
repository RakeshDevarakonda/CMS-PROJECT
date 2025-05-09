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
  const { contentTotalData } = useSelector(manageContentSelector);

  return useMutation({
    mutationKey: ["updatemoderatorstatusmutaion"],
    mutationFn: updateModeratorStatusApi,
    onSuccess: (data) => {
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
          dispatch(setContentTotalData(totalData));
        }
      }

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
