import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateModeratorStatusApi } from "../moderator-apis/ModeratorStatusChangeApi";
import { useDispatch } from "react-redux";
import { setErrorAndSuccesDialogMessage, toggleBackdrop } from "../../global-redux/GlobalRedux";

export const updateModeratorStatusMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

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
