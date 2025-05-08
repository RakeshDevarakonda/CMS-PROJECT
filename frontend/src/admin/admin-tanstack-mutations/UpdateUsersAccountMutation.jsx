import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useDispatch, useSelector } from "react-redux";
import {
  setErrorAndSuccesDialogMessage,
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

  const { manageUsersTotalData } = useSelector(manageContentSelector);

  return useMutation({
    mutationKey: ["updateadminuseraccount"],
    mutationFn: updateUsersAccountApi,
    onSuccess: (data) => {
      const updatedUser = data?.user;
      const UserRole = data?.role;

      if (updatedUser?._id && manageUsersTotalData[UserRole]) {
        const roleArray = [...manageUsersTotalData[UserRole]];

        const updatedIndex = roleArray.findIndex(
          (e) => e._id === updatedUser._id
        );

        if (updatedIndex !== -1) {
          roleArray[updatedIndex] = updatedUser;

          const updatedUsersData = {
            ...manageUsersTotalData,
            [UserRole]: roleArray,
          };

          dispatch(setManageUsersTotalData(updatedUsersData));
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

      dispatch(toggleErrorAndSuccesDialog());
    },
    onSettled: () => {
      // queryClient.refetchQueries(["fetchAllUsersInAdmin"]);
    },
  });
};
