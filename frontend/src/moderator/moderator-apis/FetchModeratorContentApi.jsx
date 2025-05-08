import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchModeratorContentApi = async (params) => {
  try {
    const cleanParams = Object.fromEntries(
      // eslint-disable-next-line no-unused-vars
      Object.entries(params).filter(([key, value]) => value != null)
    );

    const queryParams = new URLSearchParams(cleanParams).toString();

    // window.history.pushState(null, "", `?${queryParams}`);

    const response = await axios.get(
      `${API_BASE_URL}/api/moderator/getallmoderatorposts?${queryParams}`,
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
        "There was an error while fetching the Content";
    }

    throw new Error(errorMessage);
  }
};
