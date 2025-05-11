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

  const { contentTotalData, contentDeleteId, params } = useSelector(
    manageContentSelector
  );

  return useMutation({
    mutationKey: ["deleteadminsinglepost"],
    mutationFn: deleteAdminSingleApi,
    retry: 1,
    onSuccess: (data) => {
      queryClient.setQueryData(["adminmanagecontent", params], (oldData) => {
        if (!oldData) {
          return oldData;
        }
        const updatedData = oldData?.posts?.filter(
          (item) => item._id !== data.post._id
        );
        return {
          ...oldData,
          posts: updatedData,
        };
      });

      queryClient.setQueryData(["GetAdminStatsQuery"], (oldData) => {
        if (!oldData) {
          return oldData;
        }
        const oldStatus = data.oldStatus;
    

        return {
          ...oldData,
          dataCount: {
            ...oldData.dataCount,
            deleted: oldData.dataCount.deleted + 1,
            [oldStatus]: oldData.dataCount[oldStatus] - 1,
          },
        };
      });
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
