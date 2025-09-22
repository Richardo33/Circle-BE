import multer from "multer";
import path from "path";
import fs from "fs";

const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "others";

    if (file.fieldname === "profileImage") folder = "profile";
    else if (file.fieldname === "image") folder = "thread";
    else if (file.fieldname === "replyImage") folder = "reply";
    else if (file.fieldname === "backgroundPhoto") folder = "background";

    const dest = path.resolve(__dirname, `../uploads/${folder}`);
    ensureDir(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});
