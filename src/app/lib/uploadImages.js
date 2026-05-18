import cloudinary from "./cloudinary";

export function uploadImages(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "gadget-sale-items",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [
          {
            width: 1200,
            height: 1200,
            crop: "limit",
            quality: "auto",
            fetch_format: "auto",
          },
        ],
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}