import express from "express";
import { authenticate } from "../../middleware/authenticate";
import { followUser, getFollows } from "../../controllers/follow/getFollows";

const router = express.Router();

router.get("/", authenticate, getFollows);
router.post("/", authenticate, followUser);

export default router;
