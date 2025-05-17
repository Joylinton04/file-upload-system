import express from "express";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import { constants } from "fs";
import cors from "cors";
import { fileURLToPath } from "url";

const app = express();
const allowedOrigins = ["http://localhost:5173"];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors({ origin: allowedOrigins }));
const dir = "./public";

const checkDirectory = async () => {
  try {
    await fs.access(dir, constants.F_OK);
  } catch (err) {
    fs.mkdir(dir);
  }
};

checkDirectory(dir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
//filter size,only pictures allowed
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG JPG AND PNG files are allowed"), false);
    }
    cb(null, true);
  },
});
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("API is working");
});
//handle file upload

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.json({ success: false, message: "No file found" });

  try {
    const metadata = await fs.stat(req.file.path);
    const fileUrl = `${req.protocol}://${req.get('host')}/public/${req.file.filename}`;
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      fileUrl,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port: 3000");
});
