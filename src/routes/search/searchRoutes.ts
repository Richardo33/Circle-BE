import express from "express";
import { searchUsers } from "../../controllers/search/searchUser";
import { getSuggestedUsers } from "../../controllers/search/suggestedUsers";
import { getUserByUsername } from "../../controllers/search/getUserProfile";
import { authenticate } from "../../middleware/authenticate";

const router = express.Router();

router.get("/", authenticate, searchUsers);

router.get("/suggested", authenticate, getSuggestedUsers);

router.get("/:username", authenticate, getUserByUsername);

export default router;
