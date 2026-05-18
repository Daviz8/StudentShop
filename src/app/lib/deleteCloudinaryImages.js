
import cloudinary from "./cloudinary";

export async function deleteCloudinaryImages(images = []) {
  const publicIds = images
    .map((image) => image.publicId)
    .filter(Boolean);

  if (publicIds.length === 0) return;

  await cloudinary.api.delete_resources(publicIds, {
    resource_type: "image",
  });
}