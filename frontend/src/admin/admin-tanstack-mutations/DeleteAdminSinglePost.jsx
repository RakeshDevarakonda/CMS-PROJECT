import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import {
  setErrorAndSuccesDialogMessage,
  toggleErrorAndSuccesDialog,
} from "../../global-redux/GlobalRedux.jsx";
import {
  manageContentSelector,
  setContentTotalData,
  toggleDeleting,
} from "../../global-redux/ManageContentSlice.jsx";
import { deleteAdminSingleApi } from "../admin-apis/DeleteAdminSinglePostApi.jsx";
export const deleteAdminSinglePostMutation = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { contentTotalData, contentDeleteId } = useSelector(
    manageContentSelector
  );

  return useMutation({
    mutationKey: ["deleteadminsinglepost"],
    mutationFn: deleteAdminSingleApi,
    retry: 1,
    onSuccess: (data) => {
      const deletedData = [...contentTotalData];

      const updatedData = deletedData.filter((e) => e._id !== contentDeleteId);

      dispatch(setContentTotalData(updatedData));
    },
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
   
    },
  });
};
