import express from "express";
import { getThreads } from "../../controllers/thread/getThreads";
import { createThread } from "../../controllers/thread/createThreads";
import { authenticate } from "../../middleware/authenticate";
import { getThreadById } from "../../controllers/thread/getThreadbyID";
import { getThreadsUser } from "../../controllers/thread/getThreadUser";
import { upload } from "../../utils/multer";

const router = express.Router();

router.get("/threads", authenticate, getThreads);
router.post("/threads", authenticate, upload.single("image"), createThread);
router.get("/:id", authenticate, getThreadById);
router.get("/threads/me", authenticate, getThreadsUser);

export default router;
