// API File
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function updateAdminStatusApi({
  postId,
  status,
  source,
  reason,
  version,
  isChecked,
}) {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/admin/changepoststatus`,
      { postId, status, source, reason, version, isChecked },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
    let errorMessage;

    if (error.response?.status === 500) {
      errorMessage = "Something went wrong please try again";
    } else {
      errorMessage =
        error.response?.data?.message ||
        "There was an error while fetching the post";
    }

    if (error?.response?.data?.customCode) {
      errorMessage = "POST_ALREADY_MODERATED";
    }
    throw new Error(errorMessage);
  }
}
