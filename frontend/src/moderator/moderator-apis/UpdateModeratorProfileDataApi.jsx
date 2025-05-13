import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function updateModeratorProfileDataApi(formData) {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/moderator/updatemoderatorprofile`,
      formData,
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
        "There was an error while updating profile"
    }
    throw new Error(errorMessage);
  }
}
