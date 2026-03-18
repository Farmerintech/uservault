import multer from "multer";

// Store uploaded file in memory (so we can send it directly)
const storage = multer.memoryStorage();
export const imageUploader = multer({ storage });