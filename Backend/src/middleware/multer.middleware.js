import fs from "fs";
import multer from "multer";
import path from "path";
import ApiError from "../utils/ApiError.js";

// ---------- Directories ----------
const publicDir = path.join(process.cwd(), "public");
const imageDir = path.join(publicDir, "images");
const fileDir = path.join(publicDir, "files");
const lorTempDir = path.join(publicDir, "lorTemplate");

// Create directories if not exist
[publicDir, imageDir, fileDir, lorTempDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ---------- File Storage ----------
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fileDir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const cleanName = file.originalname.replace(/\s+/g, "_");

    cb(null, `${uniqueSuffix}-${cleanName}`);
  },
});

// ---------- Image Storage ----------
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageDir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const cleanName = file.originalname.replace(/\s+/g, "_");

    cb(null, `${uniqueSuffix}-${cleanName}`);
  },
});

// ---------- LOR Template Storage ----------
const lorTempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, lorTempDir);
  },

  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, "_");
    cb(null, cleanName);
  },
});

// ---------- File Filter ----------
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV and Excel files are allowed"), false);
  }
};

// ---------- Upload Middlewares ----------
export const uploadFile = multer({
  storage: fileStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const uploadImage = multer({
  storage: imageStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

export const uploadLorTemp = multer({
  storage: lorTempStorage,
  limits: {
    fileSize: 6 * 1024 * 1024, // 6MB
  },
});
