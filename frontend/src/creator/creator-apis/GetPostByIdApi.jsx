import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getPostEditById = async ({ editid, version }) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/creator/getsinglepost/${editid}/editpost`,
      {
        params: {
          version: version, // Send version as a query parameter
        },
        withCredentials: true,
      }
    );

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error("Invalid response format");
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
};
