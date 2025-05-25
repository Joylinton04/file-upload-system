import multer from "multer";
import fs from 'fs/promises'
import { constants } from "fs";

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


export default upload;