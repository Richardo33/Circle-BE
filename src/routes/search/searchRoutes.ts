import express from "express";
import { searchUsers } from "../../controllers/search/searchUser";
import { authenticate } from "../../middleware/authenticate";

const router = express.Router();

router.get("/", authenticate, searchUsers);

export default router;
