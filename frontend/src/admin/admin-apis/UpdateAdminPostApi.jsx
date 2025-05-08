import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function updateadminPostApi(FormDataSend) {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/admin/updatesinglepost`,
      FormDataSend,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    let errorMessage;

    if (error.response?.status === 500) {
      errorMessage = "Something went wrong please try again";
    } else {
      errorMessage =
        error.response?.data?.message ||
        "There was an error while updating post";
    }

    throw new Error(errorMessage);
  }
}
