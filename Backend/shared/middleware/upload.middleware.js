import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, callback) {
    if (!file.mimetype?.startsWith("image/")) {
      const error = new Error("Only image files are allowed.");
      error.status = 400;
      return callback(error);
    }
    callback(null, true);
  },
});

export default upload;
