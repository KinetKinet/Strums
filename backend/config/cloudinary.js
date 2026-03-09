import { v2 as cloudinary } from 'cloudinary';

const cloudinaryUrl = (process.env.CLOUDINARY_URL || '').trim();
const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim();

if (cloudinaryUrl) {
  cloudinary.config({
    cloudinary_url: cloudinaryUrl,
  });
} else {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export const isCloudinaryConfigured = Boolean(
  cloudinaryUrl || (cloudName && apiKey && apiSecret)
);

export default cloudinary;