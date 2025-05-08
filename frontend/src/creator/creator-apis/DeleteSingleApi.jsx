import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const deleteSingleApi = async ({ id, version }) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/creator/deletesinglepost/${id}`,
      {
        params: { version },
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
        "There was an error while deleting the post";
    }

    throw new Error(errorMessage);
  }
};
