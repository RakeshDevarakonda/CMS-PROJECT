import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { deleteSingleApi } from "./../creator-apis/DeleteSingleApi";
import {
  setErrorAndSuccesDialogMessage,
  toggleErrorAndSuccesDialog,
} from "../../global-redux/GlobalRedux.jsx";
import { manageContentSelector, toggleDeleting } from "../../global-redux/ManageContentSlice.jsx";
export const deleteSinglePostMutation = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const {params}=useSelector(manageContentSelector)

  return useMutation({
    mutationKey: ["deletesinglepost"],
    mutationFn: deleteSingleApi,
    retry: 1,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["fetchcreatormanagecontent", params],
        (oldData) => {
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
        }
      );

      queryClient.setQueryData(["GetCreatorStatsQuery"], (oldData) => {
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
