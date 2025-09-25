import express from "express";
import { authenticate } from "../../middleware/authenticate";
import { likeThread } from "../../controllers/thread/likeThread";

const router = express.Router();

/**
 * @swagger
 * /api/v1/like/{threadId}:
 *   post:
 *     tags:
 *       - Likes
 *     summary: Like atau Unlike thread
 *     description: Endpoint ini digunakan untuk melakukan like pada thread. Jika user sudah like sebelumnya, maka request ini akan menghapus like (unlike).
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID thread yang akan di-like/unlike
 *     responses:
 *       200:
 *         description: Berhasil melakukan like atau unlike
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thread liked successfully
 *                 tweet_id:
 *                   type: string
 *                   example: "thread-123"
 *                 user_id:
 *                   type: string
 *                   example: "user-456"
 *                 liked:
 *                   type: boolean
 *                   example: true
 *                 likes:
 *                   type: integer
 *                   example: 12
 *       401:
 *         description: Unauthorized (belum login)
 *       500:
 *         description: Internal Server Error
 */
router.post("/:threadId", authenticate, likeThread);

export default router;
