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

import { updateCreatorPostApi } from "../creator-apis/UpdateCreatorPostApi.jsx";

import { useNavigate, useParams } from "react-router-dom";
import {
  setErrorAndSuccesDialogMessage,
  toggleErrorAndSuccesDialog,
} from "../../global-redux/GlobalRedux.jsx";
import { manageContentSelector } from "../../global-redux/ManageContentSlice.jsx";

export const useUpdateMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { publishPost } = useSelector(createPostSelector);

  const { editid } = useParams();

  const { params } = useSelector(manageContentSelector);
  const mutation = useMutation({
    mutationKey: ["updateCreatorPost"],
    mutationFn: updateCreatorPostApi,
    onSuccess: (data) => {
      console.log(data);
      queryClient.setQueryData(
        ["fetchcreatormanagecontent", params],
        (oldData) => {
          if (oldData) {
            const filteredPosts = oldData.posts.filter((e) => e._id !== editid);
            return {
              ...oldData,
              posts: [data.post, ...filteredPosts],
            };
          }
          return oldData;
        }
      );

      queryClient.setQueryData(["GetCreatorStatsQuery"], (oldData) => {
        if (!oldData) return oldData;

        const { approved, pending, draft, totalPosts } = oldData.dataCount;
        const { oldStatus, newStatus } = data;

        const newData = { ...oldData, dataCount: { ...oldData.dataCount } };

        if (oldStatus === "approved" && newStatus === "pending") {
          newData.dataCount.approved = approved > 0 ? approved - 1 : 0;
          newData.dataCount.pending += 1;
        } else if (oldStatus === "approved" && newStatus === "draft") {
          newData.dataCount.approved = approved > 0 ? approved - 1 : 0;
          newData.dataCount.draft += 1;
        } else if (oldStatus === "draft" && newStatus === "pending") {
          newData.dataCount.draft -= 1;
          newData.dataCount.pending += 1;
        }

        return newData;
      });

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
