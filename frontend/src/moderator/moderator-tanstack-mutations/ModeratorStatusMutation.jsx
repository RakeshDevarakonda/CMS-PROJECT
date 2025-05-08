import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateModeratorStatusApi } from "../moderator-apis/ModeratorStatusChangeApi";
import { useDispatch, useSelector } from "react-redux";
import {
  setErrorAndSuccesDialogMessage,
  toggleBackdrop,
} from "../../global-redux/GlobalRedux";
import { manageContentSelector } from "../../global-redux/ManageContentSlice";

export const updateModeratorStatusMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { contentTotalData } = useSelector(manageContentSelector);

  return useMutation({
    mutationKey: ["updatemoderatorstatusmutaion"],
    mutationFn: updateModeratorStatusApi,
    onSuccess: (data) => {},
    onError: (error) => {
      dispatch(
        setErrorAndSuccesDialogMessage({
          message: error.message,
          type: "Error",
          buttonname: "Try Again",
        })
      );

      console.log(contentTotalData);

      dispatch({
        type: "globalredux/toggleErrorAndSuccesDialog",
        payload: true,
      });
    },
    onSettled: () => {
      queryClient.refetchQueries(["moderatormanagecontent"]);
      dispatch(toggleBackdrop());
    },
  });
};
