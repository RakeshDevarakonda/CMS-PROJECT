// utils/cloudinaryUploader.js
import { v2 as cloudinary } from "cloudinary";
import { extractPublicId } from "./DeleteUrls.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (photos, folder = "CMS PROJECT") => {
  let fileUrls;
  try {
    if (!photos || !photos.length) {
      throw new Error("No files provided for upload");
    }

    const cloudinaryResponses = await Promise.all(
      photos.map((filePath) => cloudinary.uploader.upload(filePath, { folder }))
    );

    fileUrls = cloudinaryResponses.map((res) => res.secure_url);
    return { success: true, urls: fileUrls };
  } catch (error) {
    console.log(error);
    for (const url of fileUrls) {
      const publicId = extractPublicId(url);
      await cloudinary.uploader.destroy(publicId);
    }
    return { success: false, error };
  }
};
