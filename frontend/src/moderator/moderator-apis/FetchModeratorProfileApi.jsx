import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchModeratorProfileApi = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/moderator/getmoderatorprofiledata`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    console.error("Error fetching profile data:", error);
    throw new Error("Failed to fetch profile data");
  }
};
