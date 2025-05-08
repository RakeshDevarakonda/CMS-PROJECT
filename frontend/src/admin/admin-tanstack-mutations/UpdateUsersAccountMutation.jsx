import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useDispatch } from "react-redux";
import {
  setErrorAndSuccesDialogMessage,
  toggleErrorAndSuccesDialog,
} from "../../global-redux/GlobalRedux.jsx";
import { updateUsersAccountApi } from "../admin-apis/UpdateUserAccountApi.jsx";

export const updateUsersAccountMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ["updateadminuseraccount"],
    mutationFn: updateUsersAccountApi,
    onSuccess: (data) => {},
    onError: (error) => {
      dispatch(
        setErrorAndSuccesDialogMessage({
          message: error.message,
          type: "Error",
          buttonname: "Try Again",
        })
      );

      dispatch(toggleErrorAndSuccesDialog());
    },
    onSettled: () => {
      queryClient.refetchQueries(["fetchAllUsersInAdmin"]);
    },
  });
};
