// API File
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function updateModeratorStatusApi({
  postId,
  status,
  source,
  reason,
  version,
}) {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/moderator/changepoststatus`,
      { postId, status, source, reason, version },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    let errorMessage;
    if (error.response?.status === 500) {
      errorMessage = "Something went wrong please try again";
    } else {
      errorMessage =
        error.response?.data?.message ||
        "There was an error while fetching the post";
    }
    throw new Error(errorMessage);
  }
}
