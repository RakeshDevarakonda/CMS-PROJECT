import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const moderatorrStatsApi = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/moderator/getmoderatorstats`,
      { withCredentials: true }
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
        "There was an error while updating the post";
    }
    throw new Error(errorMessage);
  }
};
