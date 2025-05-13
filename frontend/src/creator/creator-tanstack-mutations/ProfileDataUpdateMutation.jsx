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


       queryClient.setQueryData(["fetchcreatorprofileData"], (oldData) => {
        if (!oldData) {
          return oldData;
        }
        const updatedData = {
          ...oldData,

          ...data.user,
        };
        return updatedData;
      });

      queryClient.setQueryData(["authStatus"], (oldData) => {
        if (!oldData) {
          return oldData;
        }
        const updatedData = {
          ...oldData,

          ...data.payload,
        };
        return updatedData;
      });


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
    },
  });
};
