import express from "express";
import { authenticate } from "../../middleware/authenticate";
import { likeThread } from "../../controllers/thread/likeThread";

const router = express.Router();

router.post("/:threadId", authenticate, likeThread);

export default router;
