import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function createAdminPostApi(FormDataSend) {
  for (let pair of FormDataSend.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/admin/createpost`,
      FormDataSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
    let errorMessage;

    if (error.response?.status === 500) {
      errorMessage = "Something went wrong please try again";
    } else {
      errorMessage =
        error.response?.data?.message ||
        "There was an error while creating the post";
    }

    throw new Error(errorMessage);
  }
}
