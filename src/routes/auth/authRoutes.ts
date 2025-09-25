import express = require("express");
import { login } from "../../controllers/auth/login";
import { register } from "../../controllers/auth/register";
import { upload } from "../../utils/multer";
import { logout } from "../../controllers/auth/logout";
import { getProfile } from "../../controllers/auth/getProfile";
import { updateProfile } from "../../controllers/auth/updateProfile";
import { authenticate } from "../../middleware/authenticate";

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with optional profile image upload.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Unique username for the user
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *               full_name:
 *                 type: string
 *                 description: Full name of the user
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Optional profile image
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 full_name:
 *                   type: string
 *       400:
 *         description: Bad request (validation error or missing fields)
 */
router.post("/register", upload.single("profileImage"), register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     description: Login menggunakan email atau username dan password. Akan mengembalikan token dan data user.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Email atau username user
 *                 example: Naruto
 *               password:
 *                 type: string
 *                 description: Password user
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Login successful.
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       example: 49aa03cc-e9d3-409d-b330-60847c6959ad
 *                     username:
 *                       type: string
 *                       example: Naruto
 *                     name:
 *                       type: string
 *                       example: Naruto Uzumaki
 *                     email:
 *                       type: string
 *                       example: Naruto
 *                     avatar:
 *                       type: string
 *                       nullable: true
 *                       example: /uploads/profile/1758088163575-Naruto.jpg
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Bad request jika identifier atau password tidak diisi
 *       401:
 *         description: Unauthorized jika email/username atau password salah
 */
router.post("/login", login);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Menghapus cookie serta membuat user keluar dari aplikasi
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Logout berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout berhasil
 */
router.post("/logout", logout);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user profile
 *     description: Mengambil data profile user yang sedang login beserta thread-nya untuk di tampilkan di halaman profil.
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Profile user berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 49aa03cc-e9d3-409d-b330-60847c6959ad
 *                     email:
 *                       type: string
 *                       example: Naruto
 *                     username:
 *                       type: string
 *                       example: Naruto
 *                     name:
 *                       type: string
 *                       example: Naruto Uzumaki
 *                     bio:
 *                       type: string
 *                       nullable: true
 *                       example: Dattebayo
 *                     profile_picture:
 *                       type: string
 *                       nullable: true
 *                       example: /uploads/profile/1758088163575-Naruto.jpg
 *                     backgroundPhoto:
 *                       type: string
 *                       nullable: true
 *                       example: /uploads/background/1234.jpg
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-09-25T07:12:34.000Z
 *                     threads:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: f2a9d1c5-9b3d-4e5b-abc1-1234567890ab
 *                           content:
 *                             type: string
 *                             example: Ini thread pertama saya
 *                           image:
 *                             type: string
 *                             nullable: true
 *                             example: /uploads/thread/1234.jpg
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-09-25T08:00:00.000Z
 *       401:
 *         description: Unauthorized, token tidak valid atau tidak ditemukan
 *       404:
 *         description: User tidak ditemukan
 */
router.get("/me", authenticate, getProfile);

/**
 * @swagger
 * /api/v1/auth/me:
 *   put:
 *     summary: Update current user profile
 *     description: Update user profile include username,email, full_name, bio, profile image and background photo
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 description: Nama lengkap user
 *                 example: Naruto Uzumaki
 *               username:
 *                 type: string
 *                 description: Username user
 *                 example: Naruto
 *               email:
 *                 type: string
 *                 description: Email user
 *                 example: naruto@konoha.com
 *               bio:
 *                 type: string
 *                 description: Bio user
 *                 example: Nanadaime
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Foto profile baru
 *               backgroundPhoto:
 *                 type: string
 *                 format: binary
 *                 description: Foto background baru
 *     responses:
 *       200:
 *         description: Profile berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 49aa03cc-e9d3-409d-b330-60847c6959ad
 *                     username:
 *                       type: string
 *                       example: Naruto
 *                     name:
 *                       type: string
 *                       example: Naruto Uzumaki
 *                     email:
 *                       type: string
 *                       example: naruto@konoha.com
 *                     bio:
 *                       type: string
 *                       nullable: true
 *                       example: Ninja dari Konoha
 *                     profile_picture:
 *                       type: string
 *                       nullable: true
 *                       example: /uploads/profile/1758088163575-Naruto.jpg
 *                     backgroundPhoto:
 *                       type: string
 *                       nullable: true
 *                       example: /uploads/background/1234.jpg
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-09-25T10:00:00.000Z
 *       401:
 *         description: Unauthorized, token tidak valid atau tidak ditemukan
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Internal server error
 */
router.put(
  "/me",
  authenticate,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "backgroundPhoto", maxCount: 1 },
  ]),
  updateProfile
);

export default router;
