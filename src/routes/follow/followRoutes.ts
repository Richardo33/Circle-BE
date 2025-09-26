import express from "express";
import { authenticate } from "../../middleware/authenticate";
import {
  followUser,
  getFollows,
  getFollowsByUserId,
} from "../../controllers/follow/getFollows";

const router = express.Router();

router.get("/", authenticate, getFollows);

router.post("/", authenticate, followUser);
router.get("/:userId", authenticate, getFollowsByUserId);

export default router;
