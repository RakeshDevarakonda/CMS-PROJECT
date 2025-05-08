import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function CreatePostApi(FormDataSend) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/creator/createpost`,
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
        "There was an error while creating the post";
    }

    throw new Error(errorMessage);
  }
}
