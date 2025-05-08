import axios from "axios";

export async function getSinglePostApi(id) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/homepage/getsinglepost/${id}`
    );
    return response.data;
  } catch (error) {
    let errorMessage;

    if (error.response?.status === 500) {
      errorMessage = "Something went wrong please try again";
    } else {
      errorMessage =
        error.response?.data?.message || "There was an error while signing in";
    }

    throw new Error(errorMessage);
  }
}
