import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchAdminVersionContentApi = async ({ id, source, version }) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/admin/getadminversions`,
      {
        params: { id, source, version },
        withCredentials: true,
      }
    );

    console.log(response.data.data);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching version data:", error);
    throw new Error("Failed to fetch version data");
  }
};
