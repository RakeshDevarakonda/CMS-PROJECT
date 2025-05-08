import axios from "axios";

export async function postCommentApi(newCommentObj) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/homepage/comment`,
      newCommentObj
    );
    return response.data;
  } catch (error) {
    console.log(error);
    let errorMessage;

    if (error.response?.status === 500) {
      errorMessage = "Something went wrong please try again";
    } else {
      errorMessage =
        error.response?.data?.message || "There was an error while sign up";
    }

    console.log(errorMessage);

    throw new Error(errorMessage);
  }
}
