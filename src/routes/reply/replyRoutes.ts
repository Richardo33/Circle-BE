import express from "express";
import { authenticate } from "../../middleware/authenticate";
import { createReply } from "../../controllers/thread/createReply";
import { upload } from "../../utils/multer";

const router = express.Router();

router.post(
  "/:threadId",
  authenticate,
  upload.single("replyImage"),
  createReply
);

export default router;
