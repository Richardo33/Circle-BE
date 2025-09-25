import express from "express";
import { searchUsers } from "../../controllers/search/searchUser";
import { getSuggestedUsers } from "../../controllers/search/suggestedUsers";
import { getUserByUsername } from "../../controllers/search/getUserProfile";
import { authenticate } from "../../middleware/authenticate";

const router = express.Router();

/**
 * @swagger
 * /api/v1/search:
 *   get:
 *     tags:
 *       - Search
 *     summary: Search user
 *     description: Cari user berdasarkan fullname atau username (maksimal 7 hasil, exclude user yang sedang login).
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: Kata kunci pencarian (fullname atau username).
 *     responses:
 *       200:
 *         description: Daftar user yang cocok dengan keyword
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "user-123"
 *                       username:
 *                         type: string
 *                         example: "johndoe"
 *                       full_name:
 *                         type: string
 *                         example: "John Doe"
 *                       profile_picture:
 *                         type: string
 *                         nullable: true
 *                         example: "/uploads/profile/johndoe.png"
 *                       isFollowing:
 *                         type: boolean
 *                         example: false
 *       400:
 *         description: Query parameter keyword tidak diberikan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Keyword is required
 *       500:
 *         description: Kesalahan server
 */
router.get("/", authenticate, searchUsers);

/**
 * @swagger
 * /api/v1/search/suggested:
 *   get:
 *     tags:
 *       - Search
 *     summary: Get suggested users
 *     description: Show 3 maximum suggested not followed user
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Daftar user yang disarankan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "user-456"
 *                       full_name:
 *                         type: string
 *                         example: "Jane Doe"
 *                       username:
 *                         type: string
 *                         example: "janedoe"
 *                       photo_profile:
 *                         type: string
 *                         nullable: true
 *                         example: "/uploads/profile/janedoe.png"
 *       401:
 *         description: Unauthorized, user belum login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get("/suggested", authenticate, getSuggestedUsers);

/**
 * @swagger
 * /api/v1/search/{username}:
 *   get:
 *     tags:
 *       - Search
 *     summary: Get user profile by username
 *     description: Get profile user
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username dari user yang ingin dicari
 *         example: monster
 *     responses:
 *       200:
 *         description: Detail user yang ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "user-789"
 *                     email:
 *                       type: string
 *                       example: "monster@gmail.com"
 *                     username:
 *                       type: string
 *                       example: "monster"
 *                     full_name:
 *                       type: string
 *                       example: "Monster Hunter"
 *                     bio:
 *                       type: string
 *                       nullable: true
 *                       example: "Just a monster slayer"
 *                     photo_profile:
 *                       type: string
 *                       nullable: true
 *                       example: "/uploads/profile/monster.png"
 *                     backgroundPhoto:
 *                       type: string
 *                       nullable: true
 *                       example: "/uploads/background/monster-bg.jpg"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-09-24T15:20:30.000Z"
 *                     followers_count:
 *                       type: integer
 *                       example: 100
 *                     following_count:
 *                       type: integer
 *                       example: 50
 *       400:
 *         description: Username tidak diberikan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Username is required
 *       404:
 *         description: User tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get("/:username", authenticate, getUserByUsername);

export default router;
