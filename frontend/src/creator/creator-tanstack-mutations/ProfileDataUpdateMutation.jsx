// Mutation Hook File
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { updateProfileDataApi } from "../creator-apis/UpdateProfileDataApi";
import {
  setErrorAndSuccesDialogMessage,
  toggleErrorAndSuccesDialog,
} from "../../global-redux/GlobalRedux";
import {
  submittingData,
  toggleEditing,
} from "../../global-redux/profileManagementSlice.jsx";

export const useProfileDataUpdateMutation = () => {
  const dispatch = useDispatch();
  const queryClient=useQueryClient()
  return useMutation({
    mutationKey: ["updatecreatorprofile"],
    mutationFn: updateProfileDataApi,
    onSuccess: (data) => {
      dispatch(toggleEditing());
      // queryClient.refetchQueries(["fetchcreatorprofileData"]);
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
      // This runs in both success and error cases — like finally
      dispatch(submittingData());
    },
  });
};
