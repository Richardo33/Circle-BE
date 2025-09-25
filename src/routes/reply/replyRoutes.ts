import express from "express";
import { authenticate } from "../../middleware/authenticate";
import { createReply } from "../../controllers/thread/createReply";
import { upload } from "../../utils/multer";

const router = express.Router();

/**
 * @swagger
 * /api/v1/reply/{threadId}:
 *   post:
 *     tags:
 *       - Replies
 *     summary: Create a reply on a thread
 *     description: Memberikan comment/reply pada thread tertentu. Bisa hanya teks, hanya gambar, atau keduanya.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dari thread yang ingin dibalas
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Isi reply
 *               replyImage:
 *                 type: string
 *                 format: binary
 *                 description: Gambar opsional untuk reply
 *     responses:
 *       200:
 *         description: Reply berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     reply:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         user_id:
 *                           type: string
 *                         content:
 *                           type: string
 *                         image_url:
 *                           type: string
 *                           nullable: true
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *       401:
 *         description: Unauthorized (belum login)
 *       500:
 *         description: Invalid Thread content atau Internal Server Error
 */
router.post(
  "/:threadId",
  authenticate,
  upload.single("replyImage"),
  createReply
);

export default router;
