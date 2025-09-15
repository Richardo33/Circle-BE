import express = require("express");
import { login } from "../../controllers/auth/login";
import { register } from "../../controllers/auth/register";
import { upload } from "../../utils/multer";
import { logout } from "../../controllers/auth/logout";
import { authenticate } from "../../middleware/authenticate";

const router = express.Router();

router.post("/register", upload.single("profileImage"), register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", authenticate, (req, res) => {
  return res.json({
    success: true,
    user: (req as any).user,
  });
});

export default router;
