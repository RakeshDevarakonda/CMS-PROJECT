import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  createPostSelector,
  setDraftPost,
  setErrorMessage,
  setImageUrl,
  setPostSubmiting,
  setPreview,
  setPublishPost,
  setResetPost,
  setUploadStatus,
  setUrlError,
  setUrlPreview,
} from "../../global-redux/CreatePostsSlice.jsx";

import { useNavigate } from "react-router-dom";
import {
  setErrorAndSuccesDialogMessage,
  toggleErrorAndSuccesDialog,
} from "../../global-redux/GlobalRedux.jsx";
import { updateadminPostApi } from "../admin-apis/UpdateAdminPostApi.jsx";

export const useUpdateAdminPost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { publishPost } = useSelector(createPostSelector);
  const mutation = useMutation({
    mutationKey: ["updateadminPost"],
    mutationFn: updateadminPostApi,
    onSuccess: (data) => {
      queryClient.refetchQueries(["adminmanagecontent"]);
      navigate(-1);

      if (publishPost) {
        dispatch(setPublishPost());
        dispatch(
          setErrorAndSuccesDialogMessage({
            message: "Post Updated Succesfully",
            type: "Success",
            buttonname: "Close",
            deleteurl: true,
          })
        );
      } else {
        dispatch(setDraftPost());
        dispatch(
          setErrorAndSuccesDialogMessage({
            message: "Draft Updated Succesfully",
            type: "Success",
            buttonname: "Close",
            deleteurl: true,
          })
        );
      }
      dispatch(toggleErrorAndSuccesDialog());
      dispatch(setResetPost());

      dispatch(setUrlPreview(null));
      dispatch(setUrlError(null));
      dispatch(setPreview(null));
      dispatch(setUploadStatus(null));
      dispatch(setErrorMessage(""));
      dispatch(setImageUrl(""));
      localStorage.removeItem("allurls");
    },
    onError: (error) => {
      if (publishPost) {
        dispatch(setPublishPost());
      } else {
        dispatch(setDraftPost());
      }

      if (error?.status === 403) {
        navigate("/forbidden");
        return;
      }

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
      dispatch(setPostSubmiting());
    },
  });
  return mutation;
};
