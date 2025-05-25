import express from "express";
import upload from "../middleware/multerMiddleware.js";
import fileModel from "../models/file.model.js";

const uploadRoute = express.Router()


uploadRoute.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) return res.json({ success: false, message: "No file found" });
  const { originalname, size, filename } = req.file;

  try {
    const fileUrl = `${req.protocol}://${req.get("host")}/public/${
      req.file.filename
    }`;

    const newFile = await fileModel({ name: originalname, size, fileUrl, filename });

    newFile.save();

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


uploadRoute.get("/files-uploaded", async (req, res) => {
  try {
    const getAllFiles = await fileModel.find();
    res.send(getAllFiles);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
});

uploadRoute.delete('/files-uploaded/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const fileData = await fileModel.findByIdAndDelete(id);
    if (!fileData) {
      return res.status(404).json({ success: false, message: 'No file found' });
    }

    await fs.unlink(path.join(__dirname, `/public/${fileData.filename}`))

    res.json({ success: true, message: "File deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default uploadRoute;