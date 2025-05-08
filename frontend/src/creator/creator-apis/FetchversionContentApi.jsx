import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchversionContentApi = async ({ id, source, version }) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/creator/getallversions`,
      {
        params: { id, source, version },
        withCredentials: true,
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Error fetching version data:", error);
    throw new Error("Failed to fetch version data");
  }
};
