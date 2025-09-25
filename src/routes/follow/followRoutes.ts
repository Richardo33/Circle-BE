import express from "express";
import { authenticate } from "../../middleware/authenticate";
import {
  followUser,
  getFollows,
  getFollowsByUserId,
} from "../../controllers/follow/getFollows";

const router = express.Router();

/**
 * @swagger
 * /api/v1/follows:
 *   get:
 *     summary: Get followers or following list
 *     description: |
 *       Mengambil daftar followers (orang yang mengikuti user login) atau following (orang yang diikuti user login).
 *       Wajib menambahkan query parameter type dengan nilai followers atau following.
 *     tags:
 *       - Follow
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [followers, following]
 *         required: true
 *         description: Tentukan apakah ingin mengambil followers atau following
 *         example: following
 *     responses:
 *       200:
 *         description: Daftar followers atau following berhasil didapatkan
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
 *                         example: 49aa03cc-e9d3-409d-b330-60847c6959ad
 *                       username:
 *                         type: string
 *                         example: sasuke
 *                       full_name:
 *                         type: string
 *                         example: Sasuke Uchiha
 *                       profile_picture:
 *                         type: string
 *                         nullable: true
 *                         example: /uploads/profile/1758088163575-sasuke.jpg
 *                       isFollowing:
 *                         type: boolean
 *                         description: Apakah user login sudah follow user ini
 *                         example: true
 *       400:
 *         description: Missing atau invalid type query parameter
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
 *                   example: Invalid type query parameter
 *       401:
 *         description: Unauthorized, user belum login
 *       500:
 *         description: Internal server error
 */
router.get("/", authenticate, getFollows);

/**
 * @swagger
 * /api/v1/follows/{userId}:
 *   get:
 *     summary: Get followers or following of a user
 *     description: |
 *       Mengambil daftar followers (orang yang mengikuti user tertentu) atau following (orang yang diikuti user tertentu). untuk melihat stats following dan followers dari user lain.
 *       Wajib menambahkan query parameter `type` dengan nilai `followers` atau `following`.
 *     tags:
 *       - Follow
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID user yang ingin dilihat followers/following-nya
 *         example: f4691bb0-4799-4005-b7d7-6f0d6e00d490
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [followers, following]
 *         description: Tentukan apakah ingin mengambil daftar followers atau following
 *         example: followers
 *     responses:
 *       200:
 *         description: Daftar followers atau following berhasil didapatkan
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
 *                         example: 49aa03cc-e9d3-409d-b330-60847c6959ad
 *                       username:
 *                         type: string
 *                         example: sakura
 *                       full_name:
 *                         type: string
 *                         example: Sakura Haruno
 *                       profile_picture:
 *                         type: string
 *                         nullable: true
 *                         example: /uploads/profile/1758088163575-sakura.jpg
 *       400:
 *         description: Missing userId atau type query parameter / Invalid type
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
 *                   example: Invalid type query parameter
 *       401:
 *         description: Unauthorized, user belum login
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Internal server error
 */
router.get("/:userId", authenticate, getFollowsByUserId);

/**
 * @swagger
 * /api/v1/follows:
 *   post:
 *     summary: Follow or unfollow a user
 *     description: |
 *       Endpoint ini digunakan untuk follow atau unfollow user lain.
 *       Jika user sudah di-follow, maka request berikutnya akan otomatis **unfollow**.
 *     tags:
 *       - Follow
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetId
 *             properties:
 *               targetId:
 *                 type: string
 *                 description: ID user yang ingin di-follow atau di-unfollow
 *                 example: 49aa03cc-e9d3-409d-b330-60847c6959ad
 *     responses:
 *       200:
 *         description: Followed atau unfollowed successfully
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
 *                 message:
 *                   type: string
 *                   example: Followed successfully
 *       400:
 *         description: Missing user Id atau targetId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Missing user Id
 *       401:
 *         description: Unauthorized, user belum login
 *       500:
 *         description: Internal server error
 */
router.post("/", authenticate, followUser);

export default router;
