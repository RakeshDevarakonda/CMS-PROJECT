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

import { useNavigate, useParams } from "react-router-dom";
import {
  setErrorAndSuccesDialogMessage,
  toggleErrorAndSuccesDialog,
} from "../../global-redux/GlobalRedux.jsx";
import { updateadminPostApi } from "../admin-apis/UpdateAdminPostApi.jsx";
import { manageContentSelector } from "../../global-redux/ManageContentSlice.jsx";

export const useUpdateAdminPost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { params } = useSelector(manageContentSelector);

  const { editid } = useParams();

  const { publishPost } = useSelector(createPostSelector);
  const mutation = useMutation({
    mutationKey: ["updateadminPost"],
    mutationFn: updateadminPostApi,
    onSuccess: (data) => {
      queryClient.setQueryData(["adminmanagecontent", params], (oldData) => {
        if (oldData) {
          const filteredPosts = oldData.posts.filter((e) => e._id !== editid);

          return {
            ...oldData,
            posts: [data.post, ...filteredPosts],
          };
        }
        return oldData;
      });



      if (data?.oldStatus === "approved" && data?.newStatus === "pending") {
        queryClient.setQueryData(["GetAdminStatsQuery"], (oldData) => {
          if (!oldData) {
            return oldData;
          }
          const newData = {
            ...oldData,
            dataCount: {
              ...oldData.dataCount,
              approved: oldData.dataCount.approved - 1,
              pending: oldData.dataCount.pending + 1,
            },
          };

          return newData;
        });
      } else if (
        data?.oldStatus === "approved" &&
        data?.newStatus === "draft"
      ) {
        queryClient.setQueryData(["GetAdminStatsQuery"], (oldData) => {
          if (!oldData) {
            return oldData;
          }
          const newData = {
            ...oldData,
            dataCount: {
              ...oldData.dataCount,
              approved: oldData.dataCount.approved - 1,
              totalPosts: oldData.dataCount.totalPosts - 1,
            },
          };

          return newData;
        });
      } else if (data?.oldStatus === "draft" && data?.newStatus === "pending") {
        queryClient.setQueryData(["GetAdminStatsQuery"], (oldData) => {
          if (!oldData) {
            return oldData;
          }
          const newData = {
            ...oldData,
            dataCount: {
              ...oldData.dataCount,
              totalPosts: oldData.dataCount.totalPosts + 1,
              pending: oldData.dataCount.pending + 1,
            },
          };

          return newData;
        });
      }

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
      navigate(-1);
    },
  });
  return mutation;
};
