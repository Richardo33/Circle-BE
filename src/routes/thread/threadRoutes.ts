import express from "express";
import { getThreads } from "../../controllers/thread/getThreads";
import { authenticate } from "../../middleware/authenticate";

const router = express.Router();

router.get("/threads", authenticate, getThreads);

export default router;
