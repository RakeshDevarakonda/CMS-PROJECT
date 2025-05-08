import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { deleteSingleApi } from "./../creator-apis/DeleteSingleApi";
import {
  setErrorAndSuccesDialogMessage,
  toggleErrorAndSuccesDialog,
} from "../../global-redux/GlobalRedux.jsx";
import { toggleDeleting } from "../../global-redux/ManageContentSlice.jsx";
export const deleteSinglePostMutation = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deletesinglepost"],
    mutationFn: deleteSingleApi,
    retry: 1,
    onSuccess: (data) => {

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

    onSettled:()=>{
      dispatch(toggleDeleting())
      queryClient.refetchQueries(["fetchcreatormanagecontent"]);
      queryClient.refetchQueries(["GetCreatorStatsQuery"]);
    }
  });
};
