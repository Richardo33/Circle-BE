import express from "express";
import { getThreads } from "../../controllers/thread/getThreads";
import { createThread } from "../../controllers/thread/createThreads";
import { authenticate } from "../../middleware/authenticate";
import { getThreadById } from "../../controllers/thread/getThreadbyID";
import { getThreadsUser } from "../../controllers/thread/getThreadUser";
import { getThreadsByUsername } from "../../controllers/thread/threadsUser";
import { upload } from "../../utils/multer";
import { getThreadsByUserId } from "../../controllers/thread/getThreadsbyUserId";

const router = express.Router();

router.get("/threads", authenticate, getThreads);
router.post("/threads", authenticate, upload.single("image"), createThread);
router.get("/:id", authenticate, getThreadById);
router.get("/threads/me", authenticate, getThreadsUser);
router.get("/threads/:username", authenticate, getThreadsByUsername);
router.get("/threads/stats/:userId", authenticate, getThreadsByUserId);

export default router;
