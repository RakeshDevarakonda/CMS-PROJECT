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
import { updateAdminProfileDataApi } from "../admin-apis/UpdateAdminProfileApi.jsx";

export const useAdminProfileDataUpdateMutation = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateadminprofile"],
    mutationFn: updateAdminProfileDataApi,
    onSuccess: (data) => {
      dispatch(toggleEditing());

      queryClient.setQueryData(["fetchadminprofileData"], (oldData) => {
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
