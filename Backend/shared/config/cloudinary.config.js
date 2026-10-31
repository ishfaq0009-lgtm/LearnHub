import { v2 as cloudinary } from "cloudinary";

const configured = Boolean(
  process.env.YOUR_CLOUD_NAME && process.env.YOUR_API_KEY && process.env.YOUR_API_SECRET
);

if (configured) {
  cloudinary.config({
    cloud_name: process.env.YOUR_CLOUD_NAME,
    api_key: process.env.YOUR_API_KEY,
    api_secret: process.env.YOUR_API_SECRET,
    secure: true,
  });
}

export { cloudinary, configured };
