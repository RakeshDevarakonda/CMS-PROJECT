import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllArticlesApi = async (currentPage, allarticles) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/homepage/getallarticles`,
      {
        params: { currentPage, allarticles },
      }
    );

    console.log(response?.data);
    return response?.data;
  } catch (error) {
    console.log(error);
    let errorMessage;

    if (error.response?.status === 500) {
      errorMessage = "Something went wrong please try again";
    } else {
      errorMessage =
        error.response?.data?.message ||
        "There was an error while checking the authentication";
    }

    throw new Error(errorMessage);
  }
};
