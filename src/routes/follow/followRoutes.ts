import express from "express";
import { authenticate } from "../../middleware/authenticate";
import {
  followUser,
  getFollows,
  getFollowsByUserId,
} from "../../controllers/follow/getFollows";

const router = express.Router();

router.get("/", authenticate, getFollows);
router.get("/:userId", authenticate, getFollowsByUserId);
router.post("/", authenticate, followUser);

export default router;
