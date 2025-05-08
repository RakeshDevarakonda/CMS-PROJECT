import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import {
  setErrorAndSuccesDialogMessage,
  toggleErrorAndSuccesDialog,
} from "../../global-redux/GlobalRedux.jsx";
import { toggleDeleting } from "../../global-redux/ManageContentSlice.jsx";
import { deleteAdminSingleApi } from "../admin-apis/DeleteAdminSinglePostApi.jsx";
export const deleteAdminSinglePostMutation = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteadminsinglepost"],
    mutationFn: deleteAdminSingleApi,
    retry: 1,
    onSuccess: (data) => {},
    onError: (error) => {
      console.error("Delete error:", error);

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
      dispatch(toggleDeleting());
      queryClient.refetchQueries(["adminmanagecontent"]);
      //   queryClient.refetchQueries(["GetCreatorStatsQuery"]);
    },
  });
};
