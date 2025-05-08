// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const extractPublicId = (url) => {
  const urlParts = url.split("/");
  const uploadIndex = urlParts.findIndex((part) => part === "upload");
  const versionIndex = urlParts.findIndex((part) => part.startsWith("v"));
  const startIndex = versionIndex !== -1 ? versionIndex + 1 : uploadIndex + 2;
  const publicIdWithExt = urlParts.slice(startIndex).join("/");
  return decodeURIComponent(publicIdWithExt.replace(/\.[^/.]+$/, ""));
};


export const deleteUrl = async (urls) => {
  if (!Array.isArray(urls)) {
    throw new Error("'urls' must be an array");
  }

  if (urls.length === 0) {
    return { message: "No images to delete", results: [] };
  }


  const results = [];

  for (const url of urls) {
    try {
      const publicId = extractPublicId(url);
      const result = await cloudinary.uploader.destroy(publicId);

      results.push({
        url,
        publicId,
        status: result.result === "ok" ? "success" : "error",
        result: result.result,
      });
    } catch (err) {
      results.push({ url, status: "error", error: err.message });
    }
  }

  return { message: "Deletion completed", results };
};
