import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useDispatch, useSelector } from "react-redux";
import {
  setErrorAndSuccesDialogMessage,
  toggleBackdrop,
  toggleErrorAndSuccesDialog,
} from "../../global-redux/GlobalRedux.jsx";
import { updateUsersAccountApi } from "../admin-apis/UpdateUserAccountApi.jsx";
import {
  manageContentSelector,
  setManageUsersTotalData,
} from "../../global-redux/ManageContentSlice.jsx";

export const updateUsersAccountMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { manageUsersTotalData, manageuser, finalSearchUsername } = useSelector(
    manageContentSelector
  );

  return useMutation({
    mutationKey: ["updateadminuseraccount"],
    mutationFn: updateUsersAccountApi,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["fetchAllUsersInAdmin", manageuser, finalSearchUsername],
        (oldData) => {
          return {
            ...oldData,
            getUsers: oldData.getUsers.map((user) =>
              user._id === data.user._id ? data.user : user
            ),
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

      dispatch(toggleErrorAndSuccesDialog());
    },
    onSettled: () => {
      dispatch(toggleBackdrop());
    },
  });
};
