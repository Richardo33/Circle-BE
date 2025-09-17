import express from "express";
import { getThreads } from "../../controllers/thread/getThreads";
import { createThread } from "../../controllers/thread/createThreads";
import { authenticate } from "../../middleware/authenticate";
import { upload } from "../../utils/multer";

const router = express.Router();

router.get("/threads", authenticate, getThreads);
router.post("/threads", authenticate, upload.single("image"), createThread);

export default router;
