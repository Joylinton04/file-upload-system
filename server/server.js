import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import connectMongodb from "./config/configDB.js";
import uploadRoute from "./route/uploadRoute.js";

const app = express();
const allowedOrigins = ["http://localhost:5173"];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectMongodb();

app.use(express.json());
app.use(cors({ origin: allowedOrigins }));

app.use("/public", express.static(path.join(__dirname, "public")));
app.use('/upload', uploadRoute)

app.get("/", (req, res) => {
  res.send("API is working");
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle specific Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File too large. Max size is 2MB.' });
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      console.log(err)
      return res.status(400).json({ success: false, message: 'Unsupported file type.' });
    }

    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    // Handle general errors
    return res.status(500).json({ success: false, message: 'An error occurred during upload.' });
  }

  next();
});



app.listen(3000, () => {
  console.log("Server is running on port: 3000");
});
