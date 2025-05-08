import { useMutation } from "@tanstack/react-query";

import {
  setErrorAndSuccesDialogMessage,
  toggleErrorAndSuccesDialog,
} from "../../global-redux/GlobalRedux";
import { postCommentApi } from "../home-page-apis/PostCommentApi";

export const postCommentMutation = (newCommentObj) => {
  return useMutation({
    mutationKey: ["postcomment", newCommentObj],
    mutationFn: (newCommentObj) => postCommentApi(newCommentObj),
    onSuccess: (data) => {},
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
  });
};
