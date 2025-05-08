import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useDispatch } from "react-redux";
import { setErrorAndSuccesDialogMessage } from "../../global-redux/GlobalRedux.jsx";
import { updateAdminStatusApi } from "../admin-apis/UpdateAdminStatusApi.jsx";
import { setAdminPostStatusDetails } from "../../global-redux/ManageContentSlice.jsx";

export const updateAdminStatusMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ["updateadminstatusmutaion"],
    mutationFn: updateAdminStatusApi,
    onSuccess: (data) => {
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
    onSettled: () => {
      queryClient.refetchQueries(["adminmanagecontent"]);
    },
  });
};
