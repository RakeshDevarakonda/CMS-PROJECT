// home-page-apis/LogoutApi.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function LogoutApi() {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/logout`, null, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.log(error);
    let errorMessage;

    if (error.response?.status === 500) {
      errorMessage = "Something went wrong, please try again";
    } else {
      errorMessage = error.response?.data?.message || "Logout failed";
    }

    throw new Error(errorMessage);
  }
}
