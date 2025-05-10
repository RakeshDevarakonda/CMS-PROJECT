// Mutation Hook File
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import {
  setErrorAndSuccesDialogMessage,
  toggleErrorAndSuccesDialog,
} from "../../global-redux/GlobalRedux.jsx";
import {
  submittingData,
  toggleEditing,
} from "../../global-redux/profileManagementSlice.jsx";
import { updateModeratorProfileDataApi } from "../moderator-apis/UpdateModeratorProfileDataApi.jsx";

export const useModeratorProfileDataUpdateMutation = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updatemoderatorprofile"],
    mutationFn: updateModeratorProfileDataApi,
    onSuccess: (data) => {
      dispatch(toggleEditing());
    },
    onError: (error) => {
      dispatch(toggleErrorAndSuccesDialog());
      dispatch(
        setErrorAndSuccesDialogMessage({
          message: error.message,
          type: "Error",
          buttonname: "Try Again",
        })
      );
    },
    onSettled: () => {
      dispatch(submittingData());
      queryClient.refetchQueries({
        queryKey: ["fetchmoderatorprofileData"],
        exact: true,
      });
      queryClient.refetchQueries({ queryKey: ["authStatus"], exact: true });
    },
  });
};
